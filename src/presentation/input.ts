export async function promptCityName(): Promise<string | null> {
  const name = prompt("Nombre de la ciudad: ");
  if (!name) return null;
  return name.trim();
}

export async function promptNumber(promptText: string, max: number): Promise<number | null> {
  const raw = prompt(promptText);
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > max) return null;
  return n;
}

export async function promptChoice(promptText: string): Promise<string | null> {
  const value = prompt(promptText);
  return value ?? null;
}
