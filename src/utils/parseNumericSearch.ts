export function parseNumericSearch(term: string): number | undefined {
    if (!term) return
    const numeric = Number(term.replace(',', '.'))
    return Number.isFinite(numeric) && term.match(/^[+-]?\d+(\.\d+)?$/) ? numeric : undefined
}
