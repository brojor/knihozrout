import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString } from '../utils/index.js'

export class DobreKnihyProvider extends BaseProvider {
    readonly domain = 'dobre-knihy.cz'

    private languageMap: Record<string, LanguageCode> = {
        'česky': 'cs',
        'slovensky': 'sk',
        'anglicky': 'en',
        'německy': 'de',
        'polsky': 'pl',
        'španělsky': 'es',
        'francouzsky': 'fr',
        'italsky': 'it',
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
        return $('h1').text().trim().split(' - ')[0]
    }
    
    // FIXME nevrací undefined
    private extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        return $('h1').text().trim().split(' - ')[1]
    }

    private extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authors = $('#detail_title a').map((_, el) => {
            const fullName = $(el).text().trim()
            const nameParts = fullName.split(' ')
            const lastName = nameParts.pop() || ''
            const firstName = nameParts.join(' ')
            return { firstName, lastName }
        }).get()
        
        return authors.length > 0 ? authors : undefined
    }

    private extractLanguage($: cheerio.CheerioAPI) {
        const language = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'jazyk:')
            .next('td').text().trim().toLowerCase()

        return this.languageMap[language]
    }

    private extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'počet stran:')
            .next('td').text().trim()

        return pageCount ? parseInt(pageCount) : undefined
    }

    private extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'nakladatel:')
            .next('td').text().trim()

        return publisher ? publisher : undefined
    }

    private extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const publicationDate = $('#product_box_2 th')
            .filter((_, el) => $(el).text().trim().toLowerCase() === 'rok vydání:')
            .next('td').text().trim()

        return extractYearFromDateString(publicationDate)
    }

    private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const coverImage = $('#detail_image_in img').attr('src')

        return coverImage || undefined
    }

    private extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        return undefined
    }

    private extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }

    private extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description =$('#product_description p:not(.perex):not(:has(strong:contains("Štítky:")))').map((_, el) => $(el).text().trim()).get().join('\n').trim()
        return description ? description : undefined
    }
} 