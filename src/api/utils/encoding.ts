export function forceBytes(value: string | number): Buffer {
  if (typeof value === 'number') {
    value = value.toString();
  }
  return Buffer.from(value, 'utf-8');
}

export function urlsafeBase64Encode(data: Buffer): string {
  return data.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function urlsafeBase64Decode(data: string): Buffer {
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64');
}