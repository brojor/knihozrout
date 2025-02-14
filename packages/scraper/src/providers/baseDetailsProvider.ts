import * as cheerio from 'cheerio'
import { LanguageCode, PartialScrapedBook, ScrapedAuthor } from '../types/book'
import { LANGUAGE_MAP } from '../constants/language-map.js'
import { DetailsProviderError } from '../errors/scraperError.js'
export abstract class BaseDetailsProvider {
  abstract readonly domain: string
  protected readonly languageMap = LANGUAGE_MAP

  /**
   * Scrapuje data o knize z dané URL
   * @param url URL stránky s knihou
   * @returns Částečná data o knize - provider nemusí být schopen získat všechna data
   */
  async scrapeBookDetails(url: string, ean: number): Promise<PartialScrapedBook> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new DetailsProviderError(`Failed to fetch ${url}: ${response.status} - ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    if (!this.eanIsMatching($, ean)) {
      return {}
    }

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
      coverImage: this.extractCoverImage($),
      ean,
    }
  }

  protected abstract eanIsMatching($: cheerio.CheerioAPI, ean: number): boolean
  
  protected abstract extractTitle($: cheerio.CheerioAPI): string | undefined
  protected abstract extractOriginalTitle($: cheerio.CheerioAPI): string | undefined
  protected abstract extractSubtitle($: cheerio.CheerioAPI): string | undefined
  protected abstract extractDescription($: cheerio.CheerioAPI): string | undefined
  protected abstract extractAuthors($: cheerio.CheerioAPI): ScrapedAuthor[] | undefined
  protected abstract extractLanguage($: cheerio.CheerioAPI): LanguageCode | undefined
  protected abstract extractOriginalLanguage($: cheerio.CheerioAPI): LanguageCode | undefined
  protected abstract extractPageCount($: cheerio.CheerioAPI): number | undefined
  protected abstract extractPublisher($: cheerio.CheerioAPI): string | undefined
  protected abstract extractPublicationYear($: cheerio.CheerioAPI): number | undefined
  protected abstract extractCoverImage($: cheerio.CheerioAPI): string | undefined
} 