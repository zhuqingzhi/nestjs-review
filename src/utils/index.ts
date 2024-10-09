import * as crypto from 'crypto';
export function md5(str: string): string {
  const hex = crypto.createHash('md5');
  const hexStr = hex.update(str);
  return hexStr.digest('hex');
}
