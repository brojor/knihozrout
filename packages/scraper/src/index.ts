import { ScrapedAuthor, ScrapedBook, SearchResult } from './types/book'
import { KnihyDobrovskyProvider } from './providers/knihy_dobrovsky'
import { KnizniKlubProvider } from './providers/knizni_klub'
import { BaseProvider } from './providers/base_provider'

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

  async scrapeBookDetails(ean: number): Promise<ScrapedBook> {
    const searchResults = await this.searchByEan(ean)
    
    if (searchResults.length === 0) {
      throw new Error('Kniha nebyla nalezena v žádném z podporovaných zdrojů')
    }

    let mergedBook: Partial<ScrapedBook> = {}

    for (const result of searchResults) {
      const provider = this.providers.find(p => p.domain === result.domain)!
      const bookData = await provider.scrape(result.url)
      
      mergedBook = {
        ...bookData,
        ...mergedBook
      }

      if (this.isCompleteBook(mergedBook)) {
        break; // Máme všechna data, můžeme skončit
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

  private isCompleteBook(book: Partial<ScrapedBook>): boolean {
    const requiredFields: (keyof ScrapedBook)[] = [
      'title',
      'originalTitle',
      'subtitle',
      'description',
      'authors',
      'publicationYear',
      'coverImage',
      'pageCount',
      'language',
      'originalLanguage',
      'publisher'
    ];

    return requiredFields.every(field => book[field] !== undefined);
  }

  private async searchByEan(ean: number): Promise<SearchResult[]> {
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
}

export default BookScraper 