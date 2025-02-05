import * as cheerio from 'cheerio'
import { BaseProvider } from './base_provider'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book'

export class KnizniKlubProvider extends BaseProvider {
    readonly domain = 'knizniklub.cz'

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

    async scrape(url: string): Promise<PartialScrapedBook> {
        const response = await fetch(url)
        const html = await response.text()
        const $ = cheerio.load(html)

        return {
            title: this.extractTitle($),
            originalTitle: this.extractOriginalTitle($),
            subtitle: this.extractSubtitle($),
            description: this.extractDescription($),
            authors: this.extractAuthors($),
            language: this.extractLanguage($),
            pageCount: this.extractPageCount($),
            publisher: this.extractPublisher($),
            publicationYear: this.extractPublicationYear($),
            coverImage: this.extractCoverImage($),
        }
    }

    private extractTitle($: cheerio.CheerioAPI): string {
        return $('h1[itemprop="name"]').text().trim().split(' - ')[0]
    }

    private extractOriginalTitle($: cheerio.CheerioAPI): string | undefined {
        const originalTitle = $('#specification-content p').filter((_, el) => $(el)
            .find('strong').text().trim() === 'Originální název:').text()
            .replace('Originální název:', '').trim()

        return originalTitle || undefined
    }

    private extractSubtitle($: cheerio.CheerioAPI): string | undefined {
        const subtitle = $('h1[itemprop="name"]').text().trim().split(' - ')[1]
        return subtitle || undefined
    }

    private extractDescription($: cheerio.CheerioAPI): string | undefined {
        const description = $('.additional-info--content span[itemprop="description"]').text().trim()
        return description || undefined
    }

    private extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined {
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

    private extractLanguage($: cheerio.CheerioAPI): LanguageCode | undefined {
        const language = $('#title-info tr')
            .filter((_, el) => $(el).find('th').text().trim() === 'Jazyk:')
            .find('a')
            .text();

        return this.languageMap[language]
    }

    private extractPageCount($: cheerio.CheerioAPI): number | undefined {
        const pageCount = $('#title-info tr')
            .filter((_, el) => $(el).find('th').text().trim() === 'Počet stran:')
            .find('td')
            .text()
            .trim();

        return pageCount ? parseInt(pageCount) : undefined
    }

    private extractPublisher($: cheerio.CheerioAPI): string | undefined {
        const publisher = $('#title-info tr')
            .filter((_, el) => $(el).find('th').text().trim() === 'Nakladatel:')
            .find('td a')
            .first()
            .text()
            .trim();

        return publisher || undefined
    }

    private extractPublicationYear($: cheerio.CheerioAPI): number | undefined {
        const dateText = $('#title-info tr')
            .filter((_, el) => $(el).find('th').text().trim() === 'Rok a měsíc vydání:')
            .find('td')
            .text()
            .trim();

        const date = new Date(dateText)
        return date.getFullYear() || undefined
    }

    private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
        const imageUrl = $('.overview .illu a').attr('href')
        return imageUrl || undefined
    }
} 