
import * as cheerio from 'cheerio'
import { BaseDetailsProvider } from '../baseDetailsProvider.js'
import { LanguageCode, ScrapedAuthor } from '../../types/book.js'
import { extractYearFromDateString, parseAuthors } from '../../utils/index.js'

export class KnihyDetailsProvider extends BaseDetailsProvider {
    readonly domain = 'knihy.cz'

    protected eanIsMatching($: cheerio.CheerioAPI, ean: number): boolean {
        const parsedEan = $('.box-detail__info__params dt')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean:')
            .next('dd').text().trim()
            
        console.log(`Provider ${this.domain} compares ${parsedEan} with ${ean}`)
        return parseInt(parsedEan) === ean
    }

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1[itemprop="name"]').text().trim()

        return title || undefined
    }
    
    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    // TODO použít utils společný pro všechny
    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('.box-detail__info__authors').first().find('a').map((_, el) => $(el).text().trim()).get()

        return parseAuthors(authors)
    }

    protected extractLanguage($: cheerio.CheerioAPI) {
        const language = $('.box-detail--more-info__parameters__table th')
        .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk')
        .next('td').text().trim().toLowerCase()

        return this.languageMap[language] || undefined
    }

    protected extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('.box-detail--more-info__parameters__table th')
        .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran')
        .next('td').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    protected extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('.box-detail__info__subtitle').filter((_, el) => $(el).text().trim().toLowerCase() === 'vydavatelství')
        .next('a').text().trim()

        return publisher || undefined
    }

    protected extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('.box-detail--more-info__parameters__table th')
        .filter((_, el) => $(el).text().trim().toLowerCase() === 'rok vydání')
        .next('td').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    protected extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('.box-detail__image__main a').attr('href')

        return coverImage || undefined
    }

    protected extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    protected extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    protected extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.box-detail--more-info__description__text').text().trim()

        return description || undefined
    }
} 