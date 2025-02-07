import { PartialScrapedBook } from '../types/book'

export abstract class BaseProvider {
  abstract readonly domain: string
  
  /**
   * Scrapuje data o knize z dané URL
   * @param url URL stránky s knihou
   * @returns Částečná data o knize - provider nemusí být schopen získat všechna data
   */
  abstract scrapeBookDetails(url: string): Promise<PartialScrapedBook>
} 