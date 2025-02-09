import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString } from '../utils/index.js'

export class KnihyDobrovskyProvider extends BaseProvider {
    readonly domain = 'knihydobrovsky.cz'

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1 > span[itemprop="name"]').text().trim().split(' - ')[0]
        return title || undefined
    }
    
    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const subtitle = $('h1 > span[itemprop="name"]').text().trim().split(' - ')[1]
        return subtitle || undefined
    }

    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('.annot p.author a').map((_, el) => {
            const fullName = $(el).text().trim()
            const nameParts = fullName.split(' ')
            const lastName = nameParts.pop() || ''
            const firstName = nameParts.join(' ')
            return { firstName, lastName }
        }).get()
        
        return authors.length > 0 ? authors : undefined
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