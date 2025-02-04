export class BookScraper {
  private readonly apiKey: string
  private readonly searchEngineId: string

  constructor(apiKey: string, searchEngineId: string) {
    this.apiKey = apiKey
    this.searchEngineId = searchEngineId
  }

  async testSearch(isbn: string): Promise<string> {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${isbn}`
    )

    if (!response.ok) {
      throw new Error(`API vrátilo chybu: ${response.status}`)
    }

    const data = await response.json()
    return `Nalezeno ${data.searchInformation?.totalResults || 0} výsledků`
  }
}

export default BookScraper 