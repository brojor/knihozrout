import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString } from '../utils/index.js'

export class KnihyCentrumProvider extends BaseProvider {
    readonly domain = 'knihcentrum.cz'

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
        const title = $('.product-name h1[itemprop="name"]').text().trim()

        return title || undefined
    }

    private extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        return $('#major-podnazev span').text().trim()
    }

    // TODO zpracuj pomocí společné utils funkce
    private extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('#major-autori a').map((_, el) => {
            const fullName = $(el).text().trim()
            const nameParts = fullName.split(' ')
            const lastName = nameParts.pop() || ''
            const firstName = nameParts.join(' ')
            return { firstName, lastName }
        }).get()
        
        return authors.length > 0 ? authors : undefined
    }

    private extractLanguage($: cheerio.CheerioAPI) {
        return undefined
    }

    private extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('.data-table td').filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran').next('td').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    private extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('.data-table td').filter((_, el) => $(el).text().trim().toLowerCase() === 'značka').next('td').text().trim()

        return publisher ? publisher : undefined
    }

    private extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('.data-table td').filter((_, el) => $(el).text().trim().toLowerCase() === 'rok vydání').next('td').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('.gallery .picture a').attr('href')

        return coverImage || undefined
    }

    private extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    private extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    private extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.full-description .body p').map((_, el) => $(el).text().trim()).get().join('\n').trim()

        return description || undefined
    }
} 