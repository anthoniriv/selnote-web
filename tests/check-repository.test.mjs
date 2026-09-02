import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkRepository } from '../scripts/check-repository.mjs';

const requiredDocuments = [
  '.gitignore', 'SECURITY.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'LICENSE',
  '.github/CODEOWNERS', '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/bug_report.md', '.github/ISSUE_TEMPLATE/feature_request.md'
];

function repositoryFixture(html = '<script>const valid = true;</script><img src="assets/logo.svg">') {
  const root = mkdtempSync(join(tmpdir(), 'noteschain-check-'));
  for (const file of requiredDocuments) {
    const pathname = join(root, file);
    mkdirSync(join(pathname, '..'), { recursive: true });
    writeFileSync(pathname, 'ok');
  }
  mkdirSync(join(root, 'assets'));
  writeFileSync(join(root, 'assets/logo.svg'), '<svg/>');
  writeFileSync(join(root, 'index.html'), html);
  return root;
}

test('accepts valid JavaScript, documents, and local assets', () => {
  const root = repositoryFixture();
  try {
    assert.doesNotThrow(() => checkRepository(root));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects invalid inline JavaScript', () => {
  const root = repositoryFixture('<script>const = ;</script>');
  try {
    assert.throws(() => checkRepository(root), /Invalid JavaScript/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects a missing local asset', () => {
  const root = repositoryFixture('<img src="assets/missing.svg">');
  try {
    assert.throws(() => checkRepository(root), /Missing or unsafe local reference/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects a missing local module imported by index.html', () => {
  const root = repositoryFixture('<script type="module">import "./missing.mjs";</script>');
  try {
    assert.throws(() => checkRepository(root), /Missing or unsafe module reference/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

import {
  MAX_P2P_TEXT_BYTES,
  isValidBinaryChunkLength,
  isValidBlobChunk,
  isValidBlobStart,
  parseP2PMessage
} from '../scripts/p2p-validation.mjs';

const hash = 'a'.repeat(64);

test('rejects oversized or malformed P2P text before JSON parsing', () => {
  assert.equal(parseP2PMessage('x'.repeat(MAX_P2P_TEXT_BYTES + 1)), null);
  assert.equal(parseP2PMessage('{'), null);
  assert.equal(parseP2PMessage('[]'), null);
});

test('bounds blob allocations and chunk payloads from peers', () => {
  assert.equal(isValidBlobStart({ hash, iv: 'AQ==', chunks: 1, bytes: 1 }), true);
  assert.equal(isValidBlobStart({ hash, iv: 'AQ==', chunks: 4097, bytes: 1 }), false);
  assert.equal(isValidBlobStart({ hash, iv: 'AQ==', chunks: 1, bytes: 32769 }), false);
  assert.equal(isValidBinaryChunkLength(36 + 32768), true);
  assert.equal(isValidBinaryChunkLength(36 + 32769), false);
  assert.equal(isValidBlobChunk({ hash, i: 0, d: 'A'.repeat(43696) }, 1), false);
});
