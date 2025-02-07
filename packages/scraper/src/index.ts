import { ScrapedBook } from './types/book.js'
import { KnihyDobrovskyProvider } from './providers/knihy_dobrovsky.js'
import { KnizniKlubProvider } from './providers/knizni_klub.js'
import { BaseProvider } from './providers/base_provider.js'
import { BookValidator } from './validators/book.validator.js'

interface SearchResultItem {
  url: string
  domain: string
  position: number
  isSupported: boolean
}

export class BookScraper {
  private readonly providers: BaseProvider[]

  constructor(
    private readonly googleApiKey: string,
    private readonly googleSearchEngineId: string,
  ) {
    this.providers = [
      new KnihyDobrovskyProvider(),
      new KnizniKlubProvider()
    ]
  }

  private async searchByEan(ean: number): Promise<SearchResultItem[]> {
    const supportedDomains = this.providers.map(p => p.domain)
    // const query = `${ean} site:${supportedDomains.join(' OR site:')}`   
    const query = `${ean}`
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleSearchEngineId}&q=${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      throw new Error(`API vrátilo chybu: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.items) {
      return []
    }

    return data.items
      .map((item: any, index: number) => {
        try {
          const url = new URL(item.link)
          const domain = url.hostname.replace('www.', '')
          
          return {
            url: item.link,
            domain,
            position: index + 1,
            isSupported: supportedDomains.includes(domain)
          }
        } catch (e) {
          return null
        }
      })
      .filter((result: SearchResultItem | null): result is SearchResultItem => result !== null)
  }

  public async searchAndScrapeBook(ean: number): Promise<{
    searchResults: SearchResultItem[],
    scrapedBook?: ScrapedBook
  }> {
    const searchResults = await this.searchByEan(ean)
    const supportedResults = searchResults.filter(r => r.isSupported)

    if (supportedResults.length === 0) {
      return { searchResults }
    }

    try {
      const scrapedBook = await this.scrapeBookFromResults(supportedResults)
      return { searchResults, scrapedBook }
    } catch (error) {
      return { searchResults }
    }
  }

  private async scrapeBookFromResults(results: SearchResultItem[]): Promise<ScrapedBook> {
    let mergedBook: Partial<ScrapedBook> = {}

    for (const result of results) {
      const provider = this.providers.find(p => p.domain === result.domain)!
      const bookData = await provider.scrapeBookDetails(result.url)
      
      mergedBook = {
        ...bookData,
        ...mergedBook
      }

      if (BookValidator.isComplete(mergedBook)) {
        break;
      }
    }

    if (!BookValidator.isValid(mergedBook)) {
      throw new Error('Nepodařilo se získat všechna povinná data o knize')
    }

    return mergedBook
  }
}

export default BookScraper 