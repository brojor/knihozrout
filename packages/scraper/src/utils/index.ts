export function extractYearFromDateString(dateStr: string): number | undefined {
    if (!dateStr) {
        return undefined
    }

    const parsedDate = new Date(dateStr)
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate.getFullYear()
    }

    const yearMatch = dateStr.match(/\b(19\d{2}|20\d{2})\b/)
    if (yearMatch) {
        return parseInt(yearMatch[0], 10)
    }

    return undefined 
}