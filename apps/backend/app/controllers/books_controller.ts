import { HttpContext } from '@adonisjs/core/http'
import Book from '#models/book'
import Author from '#models/author'
import Genre from '#models/genre'
import Library from '#models/library'
import { createBookValidator } from '#validators/book'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

interface QueryFilters {
  language?: string
  libraryId?: number
  authorId?: number
  genreId?: number
  readingStatus?: string
  series?: number
}

type SortColumn = 'title' | 'authorLastName' | 'authorFirstName' | 'publicationYear' | 'pageCount'
type SortDirection = 'asc' | 'desc'

export default class BooksController {
  /**
   * Pomocná metoda pro aplikaci filtrů
   */
  private applyFilters(query: ModelQueryBuilderContract<typeof Book>, filters: QueryFilters) {
    if (filters.language) {
      query.where('language', filters.language)
    }

    if (filters.libraryId) {
      query.where('libraryId', filters.libraryId)
    }

    if (filters.authorId) {
      query.whereHas('authors', (q) => {
        q.where('authors.id', filters.authorId!)
      })
    }

    if (filters.genreId) {
      query.whereHas('genres', (q) => {
        q.where('genres.id', filters.genreId!)
      })
    }

    if (filters.readingStatus) {
      query.whereHas('readingState', (q) => {
        q.where('status', filters.readingStatus!)
      })
    }

    if (filters.series) {
      query.where('seriesId', filters.series)
    }

    return query
  }

  /**
   * Pomocná metoda pro aplikaci řazení
   */
  private applySorting(
    query: ModelQueryBuilderContract<typeof Book>,
    sort: SortColumn,
    direction: SortDirection = 'asc'
  ) {
    switch (sort) {
      case 'title':
        query.orderBy('title', direction)
        break
      case 'authorLastName':
        query
          .orderBy('authors.lastName', direction)
          .whereHas('authors', (q) => {
            q.where('authors.id', '>', 0)
          })
          .join('author_book', 'books.id', '=', 'author_book.book_id')
          .join('authors', 'authors.id', '=', 'author_book.author_id')
        break
      case 'authorFirstName':
        query
          .orderBy('authors.firstName', direction)
          .whereHas('authors', (q) => {
            q.where('authors.id', '>', 0)
          })
          .join('author_book', 'books.id', '=', 'author_book.book_id')
          .join('authors', 'authors.id', '=', 'author_book.author_id')
        break
      case 'publicationYear':
        query.orderBy('publication_year', direction)
        break
      case 'pageCount':
        query.orderBy('page_count', direction)
        break
      default:
        query.orderBy('title', 'asc')
    }
    return query
  }

  /**
   * Pomocná metoda pro formátování jmen autorů
   */
  private formatAuthorsNames(authors: any[], sortBy?: string): string {
    if (!authors.length) return ''

    const format = sortBy === 'authorLastName' ? 'sortable' : 'natural'
    return authors.map((author) => author.getFormattedName(format)).join(', ')
  }

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

  /**
   * Zobrazí seznam knih v tabulce s detaily
   */
  async list({ request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const filters = request.only([
      'language',
      'libraryId',
      'authorId',
      'genreId',
      'readingStatus',
      'series',
    ])
    const sort = request.input('sort', 'title')
    const direction = request.input('direction', 'asc')

    let query = Book.query()
      .where('userId', auth.user!.id)
      .select(['id', 'title', 'subtitle', 'publicationYear', 'pageCount'])
      .preload('authors', (q) => {
        q.select(['id', 'firstName', 'lastName'])
      })

    query = this.applyFilters(query, filters)
    query = this.applySorting(query, sort, direction)

    const books = await query.paginate(page, limit)

    // Transformace dat pro odpověď
    const transformedBooks = {
      ...books.toJSON(),
      data: books.toJSON().data.map((book) => ({
        ...book,
        authorName: this.formatAuthorsNames(book.authors, sort),
      })),
    }

    return transformedBooks
  }

  /**
   * Zobrazí seznam knih v mřížce (pouze ID a obrázek přebalu)
   */
  async grid({ request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 24)
    const filters = request.only([
      'language',
      'libraryId',
      'authorId',
      'genreId',
      'readingStatus',
      'series',
    ])
    const sort = request.input('sort', 'title')
    const direction = request.input('direction', 'asc')

    let query = Book.query()
      .where('userId', auth.user!.id)
      .select(['id', 'coverImage'])
      .preload('readingState')

    query = this.applyFilters(query, filters)
    query = this.applySorting(query, sort, direction)

    return await query.paginate(page, limit)
  }
}
