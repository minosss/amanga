import typedarrays from 'crypto-js/lib-typedarrays.js';
import aes from 'crypto-js/aes.js';
import encHex from 'crypto-js/enc-hex.js';
import { ungzip } from 'pako';

export function decode(ddr: Buffer): string {
  const text = typedarrays.create(ddr.slice(16) as any);
  const hex = ddr.slice(0, 16).toString('hex');
  const iv = encHex.parse(hex);

  const p = aes.decrypt(
    {
      ciphertext: text,
    } as any,
    iv,
    { iv },
  );

  return ungzip(Buffer.from(p.toString(), 'hex'), { to: 'string' });
}
