/**
 * Avanti serves a local US market. Keep the ten-digit local number as the
 * stored/displayed value and accept a pasted leading country code when present.
 */
export function phoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

export function isValidUsPhone(value: string) {
  return phoneDigits(value).length === 10;
}

export function formatUsPhone(value: string) {
  const digits = phoneDigits(value).slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
