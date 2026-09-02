import { existsSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(process.argv[2] ?? '.');
const requiredDocuments = [
  '.gitignore',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'LICENSE',
  '.github/CODEOWNERS',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/bug_report.md',
  '.github/ISSUE_TEMPLATE/feature_request.md'
];
const localAssetTags = /<(?:script|img|source|audio|video|link)\b[^>]*\b(?:src|href)\s*=\s*(["'])(.*?)\1/gi;
const scriptTag = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const srcAttribute = /\bsrc\s*=/i;
const typeAttribute = /\btype\s*=\s*(["'])(.*?)\1/i;
const moduleReference = /\b(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?(["'])([^"']+)\1|\bimport\s*\(\s*(["'])([^"']+)\3\s*\)/g;

function fail(message) {
  throw new Error(message);
}

function isExternalReference(value) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value);
}

function validateDocuments(repositoryRoot) {
  for (const document of requiredDocuments) {
    if (!existsSync(resolve(repositoryRoot, document))) fail(`Missing required document: ${document}`);
  }
}

function validateModuleReferences(source, repositoryRoot) {
  let match;
  moduleReference.lastIndex = 0;
  while ((match = moduleReference.exec(source)) !== null) {
    const reference = match[2] ?? match[4];
    if (!reference?.startsWith('.')) continue;
    const target = resolve(repositoryRoot, reference);
    const targetRelative = relative(repositoryRoot, target);
    if (targetRelative === '..' || targetRelative.startsWith(`..${sep}`) || !existsSync(target) || !statSync(target).isFile()) {
      fail(`Missing or unsafe module reference: ${reference}`);
    }
  }
}

function validateJavaScript(html, repositoryRoot) {
  let match;
  let scriptNumber = 0;
  scriptTag.lastIndex = 0;
  while ((match = scriptTag.exec(html)) !== null) {
    scriptNumber += 1;
    const [, attributes, source] = match;
    if (srcAttribute.test(attributes)) continue;
    const type = typeAttribute.exec(attributes)?.[2]?.trim().toLowerCase();
    if (type && !['text/javascript', 'application/javascript', 'module'].includes(type)) continue;
    try {
      if (type === 'module') {
        validateModuleReferences(source, repositoryRoot);
        const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: source, encoding: 'utf8' });
        if (result.status !== 0) throw new Error(result.stderr.trim() || 'module syntax check failed');
      } else {
        new vm.Script(source, { filename: `index.html:inline-script-${scriptNumber}` });
      }
    } catch (error) {
      fail(`Invalid JavaScript in inline script ${scriptNumber}: ${error.message}`);
    }
  }
}

function validateLocalReferences(html, repositoryRoot) {
  let match;
  localAssetTags.lastIndex = 0;
  while ((match = localAssetTags.exec(html)) !== null) {
    const reference = match[2].trim();
    if (!reference || isExternalReference(reference)) continue;
    const pathname = reference.split(/[?#]/, 1)[0];
    if (!pathname) continue;
    const target = resolve(repositoryRoot, pathname.replace(/^\/+/, ''));
    const targetRelative = relative(repositoryRoot, target);
    if (targetRelative === '..' || targetRelative.startsWith(`..${sep}`) || !existsSync(target) || !statSync(target).isFile()) {
      fail(`Missing or unsafe local reference: ${reference}`);
    }
  }
}

export function checkRepository(repositoryRoot = root) {
  const indexPath = resolve(repositoryRoot, 'index.html');
  if (!existsSync(indexPath)) fail('Missing index.html');
  const html = readFileSync(indexPath, 'utf8');
  validateDocuments(repositoryRoot);
  validateJavaScript(html, repositoryRoot);
  validateLocalReferences(html, repositoryRoot);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    checkRepository();
    console.log('Repository checks passed.');
  } catch (error) {
    console.error(`Repository check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
