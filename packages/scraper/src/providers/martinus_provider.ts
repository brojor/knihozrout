import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString, parseAuthors } from '../utils/index.js'

export class MartinusProvider extends BaseProvider {
    readonly domain = 'martinus.cz'

    protected eanIsMatching($: cheerio.CheerioAPI, ean: number): boolean {
        const parsedEan = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'isbn')
            .next('dd').text().trim()
        
        console.log(`Provider ${this.domain} compares ${parsedEan} with ${ean}`)
        return parseInt(parsedEan) === ean
    }

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1.product-detail__title').text().trim().split(' - ')[0]
        
        return title || undefined
    }

    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const subtitle = $('h1.product-detail__title').text().trim().split(' - ')[1]

        return subtitle || undefined
    }

    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authorsString = $('ul.product-detail__author').attr('title')?.trim()
        if (!authorsString) {
            return undefined
        }

        return parseAuthors(authorsString.split(' a '))
    }

    protected extractLanguage($: cheerio.CheerioAPI) {
        const language = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk')
            .next('dd').find('a').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    protected extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran')
            .next('dd').text().trim()
        
        return pageCount ? parseInt(pageCount) : undefined
    }

    protected extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'nakladatel')
            .next('dd').find('a').text().trim()

        return publisher || undefined
    }

    protected extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'rok vydání')
            .next('dd').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    protected extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    protected extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        const originalTitle = $('section#details dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'originální název')
            .next('dd').text().trim() 

        return originalTitle || undefined
    }

    protected extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    protected extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('section#description .cms-article').text().trim()

        return description || undefined
    }
} 