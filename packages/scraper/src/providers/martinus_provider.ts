import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString } from '../utils/index.js'

export class MartinusProvider extends BaseProvider {
    readonly domain = 'martinus.cz'

    // TODO přesnout do globální mapy jazyků
    private readonly languageMap: Record<string, LanguageCode> = {
        'čeština': 'cs',
        'slovenština': 'sk',
        'angličtina': 'en',
        'němčina': 'de',
        'polština': 'pl',
        'španělština': 'es',
        'francouzština': 'fr',
        'italština': 'it'
    }

    async scrapeBookDetails(url: string): Promise<PartialScrapedBook> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        return {
            title: this.extractTitle($),
            originalTitle: this.extractOriginalTitle($),
            subtitle: this.extractSubtitle($),
            description: this.extractDescription($),
            authors: this.extractAuthors($),
            language: this.extractLanguage($),
            originalLanguage: this.extractOriginalLanguage($),
            pageCount: this.extractPageCount($),
            publisher: this.extractPublisher($),
            publicationYear: this.extractPublicationYear($),
            coverImage: this.extractCoverImage($)
        }
    }

    private extractTitle($: cheerio.CheerioAPI): string | undefined {
        return $('h1.product-detail__title').text().trim().split(' - ')[0]
    }

    private extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        return $('h1.product-detail__title').text().trim().split(' - ')[1]
    }

    private extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authorsString = $('ul.product-detail__author').attr('title')?.trim()

        const authors = authorsString ? authorsString.split(' a ') : []

        // TODO přesunout do utils
        // TODO zajistit, že jména a příjmení nejsou prázdné
        const authorsArray = authors.map((author) => {
            const nameParts = author.trim().split(' ')
            const lastName = nameParts.pop() || ''
            const firstName = nameParts.join(' ')
            return { firstName, lastName }
        })

        return authorsArray.length > 0 ? authorsArray : undefined
    }

    private extractLanguage($: cheerio.CheerioAPI) {
        const language = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk')
            .next('dd').find('a').text().trim().toLowerCase()

        return this.languageMap[language]
    }

    private extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran')
            .next('dd').text().trim()
        
        return pageCount ? parseInt(pageCount) : undefined
    }

    private extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'nakladatel')
            .next('dd').find('a').text().trim()

        return publisher ? publisher : undefined
    }

    private extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'rok vydání')
            .next('dd').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    private extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        const originalTitle = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'originální název')
            .next('dd').text().trim() 

        return originalTitle || undefined
    }

    private extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    private extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('section#description .cms-article').text().trim()

        console.log(description)
        return description ? description : undefined
    }
} 