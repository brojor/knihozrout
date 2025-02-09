import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString, parseAuthors } from '../utils/index.js'

export class MegaknihyProvider extends BaseProvider {
    readonly domain = 'megaknihy.cz'

    protected eanIsMatching($: cheerio.CheerioAPI, ean: number): boolean {
        const scriptContent = $('script[type="application/ld+json"]').html();
        if (!scriptContent) {
            return false
        }

        const jsonData = JSON.parse(scriptContent);
        const parsedEan = jsonData.gtin;

        console.log(`Provider ${this.domain} compares ${parsedEan} with ${ean}`)
        return parseInt(parsedEan) === ean
    }

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1 > span[itemprop="name"]').text().trim()
        const match = title.match(/^(.+?)\s+.*\s+\1$/);
        return match ? match[1].split(' - ')[0] : undefined
    }

    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1 > span[itemprop="name"]').text().trim()
        const match = title.match(/^(.+?)\s+.*\s+\1$/);
        return match ? match[1].split(' - ')[1] : undefined
    }

    // megaknihy nepodporují více autorů
    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const author = $('.product-author a').text().trim()

        return parseAuthors([author])
    }

    protected extractLanguage($: cheerio.CheerioAPI) {
        const language = $('#tabDetails span[itemprop="inLanguage"]').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    protected extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('#tabDetails span[itemprop="numberOfPages"]').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    protected extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('#tabDetails span[itemprop="publisher"]').text().trim()

        return publisher || undefined
    }

    protected extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('#product_details li:contains("Rok vydání:")').contents().filter(function () {
            return this.nodeType === 3; // Text node
        }).text().trim();

        return extractYearFromDateString(publicationDate)
    }

    protected extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('img[itemprop="image"]').attr('src')

        return coverImage || undefined
    }

    protected extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    protected extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    protected extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('#tabDescription .full p').map((_, el) => $(el).text().trim()).get().join('\n')

        return description || undefined
    }
} 