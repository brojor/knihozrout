import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString } from '../utils/index.js'

export class KnihyDobrovskyProvider extends BaseProvider {
    readonly domain = 'knihydobrovsky.cz'

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
        return $('h1 > span[itemprop="name"]').text().trim().split(' - ')[0]
    }

    private extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        return $('h1 > span[itemprop="name"]').text().trim().split(' - ')[1]
    }

    private extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('.annot p.author a').map((_, el) => {
            const fullName = $(el).text().trim()
            const nameParts = fullName.split(' ')
            const lastName = nameParts.pop() || ''
            const firstName = nameParts.join(' ')
            return { firstName, lastName }
        }).get()
        
        return authors.length > 0 ? authors : undefined
    }

    private extractLanguage($: cheerio.CheerioAPI) {
        const language = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk')
            .next('dd').text().trim().toLowerCase()

        return this.languageMap[language]
    }

    private extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran')
            .next('dd').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    private extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'nakladatel')
            .next('dd').text().trim()

        return publisher ? publisher : undefined
    }

    private extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'datum vydání')
            .next('dd').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        return $('.img-big a').attr('data-src')
    }

    private extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        return $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'původní název')
            .next('dd').text().trim() || undefined
    }

    private extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        const language = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'původní jazyk')
            .next('dd').text().trim().toLowerCase()

        return this.languageMap[language]
    }

    private extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.box-annot p:not(.box-share)').map((_, el) => $(el).text().trim()).get().join('\n').trim()
        return description ? description : undefined
    }
} 