export const ANSI = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
} as const;

export type ColorName = keyof typeof ANSI;

export function paint(color: ColorName, text: string): string {
  return `${ANSI[color]}${text}${ANSI.reset}`;
}
