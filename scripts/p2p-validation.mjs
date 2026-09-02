export const MAX_P2P_TEXT_BYTES = 256 * 1024;
export const MAX_BLOB_CHUNKS = 4096;
export const MAX_CHUNK_BYTES = 32 * 1024;
export const MAX_BLOB_BYTES = MAX_P2P_TEXT_BYTES * MAX_BLOB_CHUNKS;

const HASH = /^[a-f0-9]{64}$/i;
const BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;

export function parseP2PMessage(value) {
  if (typeof value !== 'string' || new TextEncoder().encode(value).byteLength > MAX_P2P_TEXT_BYTES) return null;
  try {
    const message = JSON.parse(value);
    return message && typeof message === 'object' && !Array.isArray(message) && typeof message.t === 'string' && message.t.length <= 32
      ? message
      : null;
  } catch {
    return null;
  }
}

export function isValidBlobStart(message) {
  return typeof message?.hash === 'string'
    && HASH.test(message.hash)
    && typeof message.iv === 'string'
    && message.iv.length > 0
    && message.iv.length <= 128
    && BASE64.test(message.iv)
    && Number.isSafeInteger(message.chunks)
    && message.chunks > 0
    && message.chunks <= MAX_BLOB_CHUNKS
    && Number.isSafeInteger(message.bytes)
    && message.bytes > 0
    && message.bytes <= MAX_BLOB_BYTES
    && message.bytes <= message.chunks * MAX_CHUNK_BYTES
    && message.bytes > (message.chunks - 1) * MAX_CHUNK_BYTES;
}

export function isValidBinaryChunkLength(byteLength) {
  return Number.isSafeInteger(byteLength) && byteLength > 36 && byteLength <= 36 + MAX_CHUNK_BYTES;
}

export function isValidBlobChunk(message, totalChunks) {
  const encoded = message?.d;
  return typeof message?.hash === 'string'
    && HASH.test(message.hash)
    && Number.isSafeInteger(message.i)
    && message.i >= 0
    && message.i < totalChunks
    && typeof encoded === 'string'
    && encoded.length > 0
    && encoded.length <= Math.ceil(MAX_CHUNK_BYTES * 4 / 3) + 4
    && BASE64.test(encoded);
}
