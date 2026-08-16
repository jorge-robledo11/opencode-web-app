import type { MenuOption } from "../types/MenuOption.ts";
import { paint } from "../utils/colors.ts";
import { printCyan } from "./output.ts";
import { promptChoice } from "./input.ts";

export function renderMenu(options: MenuOption[]): string {
  const header = `════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════`;
  const lines = options.map((o) => `  ${o.key}. ${o.label}`);
  return [header, ...lines, "════════════════════════════════════════"].join("\n");
}

export async function promptMenuChoice(options: MenuOption[]): Promise<string | null> {
  printCyan(renderMenu(options));
  return promptChoice(paint("cyan", "Selecciona una opción: "));
}
