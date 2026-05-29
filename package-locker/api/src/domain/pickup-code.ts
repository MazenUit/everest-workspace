const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generatePickupCode(): string {
  let code = '';
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * CHARS.length);
    code += CHARS[index];
  }
  return code;
}