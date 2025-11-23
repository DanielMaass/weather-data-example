export const formatShortDate = (date: Date | null) => date?.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" }) || ''
