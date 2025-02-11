import * as cheerio from 'cheerio'
import { BaseDetailsProvider } from '../baseDetailsProvider.js'
import { LanguageCode, ScrapedAuthor } from '../../types/book.js'
import { extractYearFromDateString, parseAuthors } from '../../utils/index.js'

export class KnihyDobrovskyDetailsProvider extends BaseDetailsProvider {
    readonly domain = 'knihydobrovsky.cz'

    protected eanIsMatching($: cheerio.CheerioAPI, ean: number): boolean {
        const parsedEan = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean')
            .next('dd').text().trim()
        
        console.log(`Provider ${this.domain} compares ${parsedEan} with ${ean}`)
        return parseInt(parsedEan) === ean
    }

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1 > span[itemprop="name"]').text().trim().split(' - ')[0]
        return title || undefined
    }
    
    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const subtitle = $('h1 > span[itemprop="name"]').text().trim().split(' - ')[1]
        return subtitle || undefined
    }

    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('.annot p.author a').map((_, el) => $(el).text().trim()).get()
        
        return parseAuthors(authors)
    }

    protected extractLanguage($: cheerio.CheerioAPI) {
        const language = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk')
            .next('dd').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    protected extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran')
            .next('dd').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    protected extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'nakladatel')
            .next('dd').text().trim()

        return publisher || undefined
    }

    protected extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'datum vydání')
            .next('dd').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    protected extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('.img-big a').attr('data-src')

        return coverImage || undefined
    }

    protected extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        const originalTitle = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'původní název')
            .next('dd').text().trim() || undefined

        return originalTitle || undefined
    }

    protected extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        const language = $('.box-book-info dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'původní jazyk')
            .next('dd').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    protected extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.box-annot p:not(.box-share)').map((_, el) => $(el).text().trim()).get().join('\n').trim()

        return description || undefined
    }
} 