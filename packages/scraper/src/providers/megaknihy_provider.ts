import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString } from '../utils/index.js'

export class MegaknihyProvider extends BaseProvider {
    readonly domain = 'megaknihy.cz'

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
        const title = $('h1 > span[itemprop="name"]').text().trim()
        const match = title.match(/^(.+?)\s+.*\s+\1$/);
        return match ? match[1].split(' - ')[0] : undefined
    }
    
    // FIXME nevrací undefined
    private extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1 > span[itemprop="name"]').text().trim()
        const match = title.match(/^(.+?)\s+.*\s+\1$/);
        return match ? match[1].split(' - ')[1] : undefined
    }

    // megaknihy nepodporují více autorů
    private extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const author = $('.product-author a').text().trim()
        const [firstName, lastName] = author.split(' ')
        if (firstName && lastName) {
            return [{ firstName, lastName }] 
        }
        return undefined
    }

    private extractLanguage($: cheerio.CheerioAPI) {
        const language = $('#tabDetails span[itemprop="inLanguage"]').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    private extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('#tabDetails span[itemprop="numberOfPages"]').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    private extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('#tabDetails span[itemprop="publisher"]').text().trim()

        return publisher ? publisher : undefined
    }

    private extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('#product_details li:contains("Rok vydání:")').contents().filter(function() {
            return this.nodeType === 3; // Text node
          }).text().trim();

        return extractYearFromDateString(publicationDate)
    }

    private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('img[itemprop="image"]').attr('src')

        return coverImage || undefined
    }

    private extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    private extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    private extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('#tabDescription .full p').map((_, el) => $(el).text().trim()).get().join('\n')

        return description || undefined
    }
} 