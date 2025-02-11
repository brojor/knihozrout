import * as cheerio from 'cheerio'
import { BaseDetailsProvider } from '../baseDetailsProvider.js'
import { LanguageCode, ScrapedAuthor } from '../../types/book.js'
import { extractYearFromDateString, parseAuthors } from '../../utils/index.js'

export class KnihcentrumDetailsProvider extends BaseDetailsProvider {
    readonly domain = 'knihcentrum.cz'

    protected eanIsMatching($: cheerio.CheerioAPI, ean: number): boolean {
        const parsedEan = $('.data-table td')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean')
            .next('td').text().trim()
        
        console.log(`Provider ${this.domain} compares ${parsedEan} with ${ean}`)
        return parseInt(parsedEan) === ean
    }

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('.product-name h1[itemprop="name"]').text().trim()

        return title || undefined
    }

    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const subtitle = $('#major-podnazev span').text().trim()

        return subtitle || undefined
    }

    // TODO zpracuj pomocí společné utils funkce
    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('#major-autori a').map((_, el) => $(el).text().trim()).get()
        
        return parseAuthors(authors)
    }

    protected extractLanguage($: cheerio.CheerioAPI) {
        return undefined
    }

    protected extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('.data-table td').filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran').next('td').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    protected extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('.data-table td').filter((_, el) => $(el).text().trim().toLowerCase() === 'značka').next('td').text().trim()

        return publisher || undefined
    }

    protected extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('.data-table td').filter((_, el) => $(el).text().trim().toLowerCase() === 'rok vydání').next('td').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    protected extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('.gallery .picture a').attr('href')

        return coverImage || undefined
    }

    protected extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    protected extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    protected extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.full-description .body p').map((_, el) => $(el).text().trim()).get().join('\n').trim()

        return description || undefined
    }
} 