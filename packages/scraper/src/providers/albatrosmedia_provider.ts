import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString } from '../utils/index.js'

export class AlbatrosmediaProvider extends BaseProvider {
    readonly domain = 'albatrosmedia.cz'

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

    // FIXME nevrací undefined
    private extractTitle($: cheerio.CheerioAPI): string | undefined {
        return $('.product-top__header h1').text().trim().split(' - ')[0]
    }
    
    // FIXME nevrací undefined
    private extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        return $('.product-top__header h1').text().trim().split(' - ')[1]
    }

    private extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('h3.product__author a').map((_, el) => {
            const fullName = $(el).text().trim()
            const nameParts = fullName.split(' ')
            const lastName = nameParts.pop() || ''
            const firstName = nameParts.join(' ')
            return { firstName, lastName }
        }).get()
        
        return authors.length > 0 ? authors : undefined
    }

    private extractLanguage($: cheerio.CheerioAPI) {
        const language = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk')
            .next('span').text().trim().toLowerCase()

        return this.languageMap[language]
    }

    private extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran')
            .next('span').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    private extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'nakladatelství')
            .next('span').text().trim()

        return publisher ? publisher : undefined
    }

    private extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'datum vydání')
            .next('span').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('figure.product__cover img').attr('data-src')

        return coverImage || undefined
    }

    private extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        const originalTitle = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'původní název')
            .next('span').text().trim() || undefined

        return originalTitle || undefined
    }

    private extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        const language = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'původní jazyk')
            .next('span').text().trim().toLowerCase()

        return this.languageMap[language]
    }

    private extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.p-i__long-anotation').text().trim()
        return description ? description : undefined
    }
} 