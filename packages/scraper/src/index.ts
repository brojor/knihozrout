import { ScrapedAuthor, ScrapedBook, SearchResult } from './types/book'
import { KnihyDobrovskyProvider } from './providers/knihy_dobrovsky'
import { BaseProvider } from './providers/base_provider'

export class BookScraper {
  private readonly apiKey: string
  private readonly searchEngineId: string
  private readonly providers: BaseProvider[]

  constructor(apiKey: string, searchEngineId: string) {
    this.apiKey = apiKey
    this.searchEngineId = searchEngineId
    this.providers = [
      new KnihyDobrovskyProvider()
    ]
  }

  async searchByEan(ean: number): Promise<SearchResult[]> {
    const supportedDomains = this.providers.map(p => p.domain)
    const query = `${ean} site:${supportedDomains.join(' OR site:')}`   
   
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      throw new Error(`API vrátilo chybu: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.items) {
      return []
    }

    return data.items
      .map((item: any) => {
        try {
          const url = new URL(item.link)
          const domain = url.hostname.replace('www.', '')
          
          if (supportedDomains.includes(domain)) {
            return {
              url: item.link,
              domain
            }
          }
          return null
        } catch (e) {
          return null
        }
      })
      .filter((result: SearchResult | null): result is SearchResult => result !== null)
  }

  async scrapeBookDetails(ean: number): Promise<ScrapedBook> {
    const searchResults = await this.searchByEan(ean)
    
    if (searchResults.length === 0) {
      throw new Error('Kniha nebyla nalezena v žádném z podporovaných zdrojů')
    }

    let mergedBook: Partial<ScrapedBook> = { ean }

    for (const result of searchResults) {
      const provider = this.providers.find(p => p.domain === result.domain)!
      const bookData = await provider.scrape(result.url)
      
      // Sloučíme data, přičemž zachováme existující hodnoty
      mergedBook = {
        ...bookData,
        ...mergedBook,
        authors: [...new Set([
          ...(mergedBook.authors || []),
          ...(bookData.authors || [])
        ])].filter((author): author is ScrapedAuthor => 
          !!author.firstName && !!author.lastName
        ),
        subtitle: mergedBook.subtitle || bookData.subtitle,
        coverImage: mergedBook.coverImage || bookData.coverImage
      }
    }

    if (!this.isValidScrapedBook(mergedBook)) {
      throw new Error('Nepodařilo se získat všechna povinná data o knize')
    }

    return mergedBook as ScrapedBook
  }

  private isValidScrapedBook(book: Partial<ScrapedBook>): book is ScrapedBook {
    return !!(
      book.title &&
      book.authors &&
      book.authors.length > 0 &&
      book.authors.every(author => author.firstName && author.lastName)
    )
  }
}

export default BookScraper 