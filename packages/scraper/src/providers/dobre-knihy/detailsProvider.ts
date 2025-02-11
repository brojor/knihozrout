import * as cheerio from 'cheerio'
import { BaseDetailsProvider } from '../baseDetailsProvider.js'
import { LanguageCode, ScrapedAuthor } from '../../types/book.js'
import { extractYearFromDateString, parseAuthors } from '../../utils/index.js'

export class DobreKnihyDetailsProvider extends BaseDetailsProvider {
    readonly domain = 'dobre-knihy.cz'

    protected eanIsMatching($: cheerio.CheerioAPI, ean: number): boolean {
        const parsedEan = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean:')
            .next('td').text().trim()
        
        console.log(`Provider ${this.domain} compares ${parsedEan} with ${ean}`)
        return parseInt(parsedEan) === ean
    }

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1').text().trim().split(' - ')[0]
        return title || undefined
    }
    
    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const subtitle = $('h1').text().trim().split(' - ')[1]
        return subtitle || undefined
    }

    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('#detail_title a').map((_, el) => $(el).text().trim()).get()
        
        return parseAuthors(authors)
    }

    protected extractLanguage($: cheerio.CheerioAPI) {
        const language = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk:')
            .next('td').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    protected extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran:')
            .next('td').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    protected extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'nakladatel:')
            .next('td').text().trim()

        return publisher ? publisher : undefined
    }

    protected extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'rok vydání:')
            .next('td').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    protected extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('#detail_image_in img').attr('src')

        return coverImage || undefined
    }

    protected extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    protected extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    protected extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description =$('#product_description p:not(.perex):not(:has(strong:contains("Štítky:")))').map((_, el) => $(el).text().trim()).get().join('\n').trim()
        return description || undefined
    }
} 