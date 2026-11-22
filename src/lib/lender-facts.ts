type DirectoryFigure = { name: string; products: string[]; min_amount: string | null; max_amount: string | null; term: string | null; speed: string | null };

export function lenderFacts(lenders: DirectoryFigure[], product: string): [string, string, string, string] {
  const matching = lenders.filter((l) => l.products.includes(product));
  const values = (read: (l: DirectoryFigure) => string | null) => matching.map((l) => {
    const value = read(l);
    return value ? `${l.name}: ${value}` : null;
  }).filter(Boolean).join('; ') || 'Confirm with the lender';
  return [
    values((l) => [l.min_amount, l.max_amount].filter(Boolean).join(' – ') || null),
    values((l) => l.term),
    'Confirm security and guarantees with the lender',
    values((l) => l.speed),
  ];
}