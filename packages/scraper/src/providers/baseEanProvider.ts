import * as cheerio from 'cheerio'
import { EanProviderError } from '../errors/scraperError.js'
export abstract class BaseEanProvider {
    abstract readonly domain: string
  
    /**
     * Extrahuje EAN kód z URL adresy
     */
    protected abstract extractEan($: cheerio.CheerioAPI): number | undefined
  
    /**
     * Kontroluje, zda provider podporuje danou URL
     */
    canHandle(url: string): boolean {
      try {
        const domain = new URL(url).hostname.replace('www.', '')
        return domain === this.domain
      } catch {
        return false
      }
    }
  
    /**
     * Získá EAN kód z URL adresy
     */
    async getEanFromUrl(url: string): Promise<number> {
      const response = await fetch(url)
      if (!response.ok) {
        throw new EanProviderError(`Failed to fetch ${url}: ${response.status} - ${response.statusText}`)
      }
  
      const html = await response.text()
      const $ = cheerio.load(html)
  
      const ean = this.extractEan($)
      if (!ean) {
        throw new EanProviderError(`Nepodařilo se najít EAN kód na stránce ${url}`)
      }
  
      return ean
    }
  }