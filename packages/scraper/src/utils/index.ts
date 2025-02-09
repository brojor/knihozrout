import { ScrapedAuthor } from "../types/book"

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

export function parseAuthors(authors: string[]): ScrapedAuthor[] | undefined {
    if (!authors || authors.length === 0) {
        return undefined
    }

    const parsedAuthors = authors.map(author => {
        if (author.trim() === '') {
            return null
        }

        const nameParts = author.trim().split(' ')
        const lastName = nameParts.pop()
        const firstName = nameParts.join(' ')
        if (firstName && lastName) {
            return { firstName: firstName.trim(), lastName: lastName.trim() }
        }

        return null
    }).filter(result => result !== null)

    return parsedAuthors.length > 0 ? parsedAuthors : undefined
}