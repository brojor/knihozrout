import { HttpContext } from '@adonisjs/core/http'
import BookScraper from '@knihozrout/scraper'
import env from '#start/env'

export default class TestController {
  async testScraper({ response }: HttpContext) {
    const scraper = new BookScraper(env.get('GOOGLE_API_KEY'), env.get('GOOGLE_SEARCH_ENGINE_ID'))

    try {
      const result = await scraper.testSearch('9788000061894')
      return response.ok({ message: result })
    } catch (error) {
      return response.badRequest({
        error: error instanceof Error ? error.message : 'Neznámá chyba',
      })
    }
  }
}
