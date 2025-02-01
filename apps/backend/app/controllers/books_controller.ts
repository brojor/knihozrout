import { HttpContext } from '@adonisjs/core/http'
import Book from '#models/book'
import Author from '#models/author'
import Genre from '#models/genre'
import Library from '#models/library'
import { createBookValidator } from '#validators/book'

export default class BooksController {
  /**
   * Vytvoří novou knihu
   */
  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createBookValidator)

    // Pokud není specifikována knihovna, najdeme defaultní
    const libraryId =
      data.libraryId ||
      (await Library.query()
        .where('userId', auth.user!.id)
        .orderBy('createdAt', 'asc')
        .firstOrFail()
        .then((library) => library.id))

    // Zpracování autorů
    const authorIds = await Promise.all(
      data.authors.map(async (authorData) => {
        // Hledáme autora podle jména a příjmení
        let author = await Author.query()
          .where('firstName', authorData.firstName)
          .where('lastName', authorData.lastName)
          .first()

        // Pokud autor neexistuje, vytvoříme ho
        if (!author) {
          author = await Author.create({
            firstName: authorData.firstName,
            lastName: authorData.lastName,
          })
        }

        return author.id
      })
    )

    // Zpracování žánrů
    const genreIds = await Promise.all(
      data.genres.map(async (genreName) => {
        // Hledáme žánr podle jména
        let genre = await Genre.findBy('name', genreName)

        // Pokud žánr neexistuje, vytvoříme ho
        if (!genre) {
          genre = await Genre.create({ name: genreName })
        }

        return genre.id
      })
    )

    // Vytvoření knihy
    const book = await Book.create({
      ...data,
      userId: auth.user!.id,
      libraryId,
    })

    // Připojení autorů a žánrů
    await book.related('authors').attach(authorIds)
    await book.related('genres').attach(genreIds)

    // Načtení vztahů pro odpověď
    await book.load((loader) => {
      loader.load('authors')
      loader.load('genres')
      loader.load('library')
    })

    return response.created(book)
  }
}
