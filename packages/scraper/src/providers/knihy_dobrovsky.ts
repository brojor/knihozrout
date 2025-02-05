import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider'
import { LanguageCode, PartialScrapedBook } from '../types/book'

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

    async scrape(url: string): Promise<PartialScrapedBook> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        return {
            title: this.extractTitle($),
            subtitle: this.extractSubtitle($),
            authors: this.extractAuthors($),
            language: this.extractLanguage($),
            pageCount: this.extractPageCount($),
            isbn: this.extractIsbn($),
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

    private extractAuthors($: cheerio.CheerioAPI) {
        return $('.annot p.author a').map((_, el) => {
            const fullName = $(el).text().trim()
            const [firstName, lastName] = fullName.split(' ').map(s => s.trim())
            return { firstName, lastName }
        }).get()
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

    private extractIsbn($: cheerio.CheerioAPI): string | undefined {
        const isbn = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'isbn')
            .next('dd').text().trim()

        return isbn ? isbn : undefined
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

        return publicationDate ? new Date(publicationDate).getFullYear() : undefined
    }

    private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        return $('.img-big a').attr('data-src')
    }
} 