import * as cheerio from 'cheerio'
import { BaseDetailsProvider } from '../baseDetailsProvider.js'
import { LanguageCode, ScrapedAuthor } from '../../types/book.js'
import { extractYearFromDateString, parseAuthors } from '../../utils/index.js'

export class AlbatrosmediaDetailsProvider extends BaseDetailsProvider {
    readonly domain = 'albatrosmedia.cz'

    protected eanIsMatching($: cheerio.CheerioAPI, ean: number): boolean {
        const parsedEan = $('.product__infos span')
        .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean')
        .next('span').text().trim()
        
        console.log(`Provider ${this.domain} compares ${parsedEan} with ${ean}`)
        return parseInt(parsedEan) === ean
    }

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('.product-top__header h1').text().trim().split(' - ')[0]
        return title || undefined
    }
    
    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const subtitle = $('.product-top__header h1').text().trim().split(' - ')[1]
        return subtitle || undefined
    }

    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('h3.product__author a').map((_, el) => $(el).text().trim()).get()
        
        return parseAuthors(authors)
    }

    protected extractLanguage($: cheerio.CheerioAPI) {
        const language = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk')
            .next('span').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    protected extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran')
            .next('span').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    protected extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'nakladatelství')
            .next('span').text().trim()

        return publisher ? publisher : undefined
    }

    protected extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'datum vydání')
            .next('span').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    protected extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('figure.product__cover img').attr('data-src')

        return coverImage || undefined
    }

    protected extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        const originalTitle = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'původní název')
            .next('span').text().trim() || undefined

        return originalTitle || undefined
    }

    protected extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        const language = $('.product__infos span')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'původní jazyk')
            .next('span').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    protected extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.p-i__long-anotation').text().trim()
        return description || undefined
    }
} 