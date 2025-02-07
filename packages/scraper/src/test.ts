import { KnizniKlubProvider } from './providers/knizni_klub'

async function test() {
  const provider = new KnizniKlubProvider()
  const url = 'https://www.knizniklub.cz/knihy/41291-pan-prstenu-spolecenstvo-prstenu.html' 
  // const url = 'https://www.knizniklub.cz/knihy/445756-dobra-znameni-ilustrovana.html' 

  try {
    console.log('Stahuji data z:', url)
    const bookDetails = await provider.scrapeBookDetails(url)
    console.log('Detaily knihy:', JSON.stringify(bookDetails, null, 2))
  } catch (error) {
    console.error('Chyba:', error)
  }
}

test() 