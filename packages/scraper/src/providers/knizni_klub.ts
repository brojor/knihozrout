import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider.js'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book.js'
import { extractYearFromDateString } from '../utils/index.js'

export class KnizniKlubProvider extends BaseProvider {
    readonly domain = 'knizniklub.cz'

    protected extractTitle($: cheerio.CheerioAPI): string | undefined {
        const title = $('h1[itemprop="name"]').text().trim().split(' - ')[0]
        return title || undefined
    }

    protected extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        const originalTitle = $('#specification-content p').filter((_, el) => $(el)
            .find('strong').text().trim() === 'Originální název:').text()
            .replace('Originální název:', '').trim()

        return originalTitle || undefined
    }

    // TODO buď konzistentní v pořadí metod
    protected extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const subtitle = $('h1[itemprop="name"]').text().trim().split(' - ')[1]
        return subtitle || undefined
    }

    protected extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.additional-info--content span[itemprop="description"]').text().trim()
        return description || undefined
    }

    protected extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
        const authorText = $('.title-header__author__content').first().text().trim()
        if (!authorText) {
            return undefined
        }
        
        const authors = authorText.split(',')
            .filter(author => author.trim() !== '')
            .map(author => {
                const nameParts = author.trim().split(' ')
                const lastName = nameParts.pop() || ''
                const firstName = nameParts.join(' ')
                return { firstName, lastName }
            })
        
        return authors.length > 0 ? authors : undefined
    }

    protected extractLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        const language = $('#title-info tr')
            .filter((_, el) => $(el).find('th').text().trim() === 'Jazyk:')
            .find('a')
            .text();

        return this.languageMap[language] || undefined
    }

    protected extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('#title-info tr')
            .filter((_, el) => $(el).find('th').text().trim() === 'Počet stran:')
            .find('td')
            .text()
            .trim();

        return pageCount ? parseInt(pageCount) : undefined
    }

    protected extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('#title-info tr')
            .filter((_, el) => $(el).find('th').text().trim() === 'Nakladatel:')
            .find('td a')
            .first()
            .text()
            .trim();

        return publisher || undefined
    }

    protected extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const dateText = $('#title-info tr')
            .filter((_, el) => $(el).find('th').text().trim() === 'Rok a měsíc vydání:')
            .find('td')
            .text()
            .trim();

        return extractYearFromDateString(dateText)
    }

    protected extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const imageUrl = $('.overview .illu a').attr('href')
        return imageUrl || undefined
    }

    protected extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        return undefined
    }
} 