import { KnihyDobrovskyProvider } from './providers/knihy_dobrovsky'

async function test() {
  const provider = new KnihyDobrovskyProvider()
  const url = 'https://www.knihydobrovsky.cz/kniha/ctvrte-kridlo-exkluzivni-vydani-711011300'
  // const url = 'https://www.knihydobrovsky.cz/kniha/dobra-znameni-77924'

  try {
    console.log('Stahuji data z:', url)
    const bookDetails = await provider.scrape(url)
    console.log('Detaily knihy:', JSON.stringify(bookDetails, null, 2))
  } catch (error) {
    console.error('Chyba:', error)
  }
}

test() 