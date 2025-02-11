import { AlbatrosmediaDetailsProvider } from './providers/albatrosmedia'

async function test() {
  const provider = new AlbatrosmediaDetailsProvider()
  const url = 'https://www.albatrosmedia.cz/tituly/93592236/ctvrte-kridlo-exkluzivni-vydani/' 

  try {
    console.log('Stahuji data z:', url)
    const bookDetails = await provider.scrapeBookDetails(url, 9788025370063)
    console.log('Detaily knihy:', JSON.stringify(bookDetails, null, 2))
  } catch (error) {
    console.error('Chyba:', error)
  }
}

test() 