import Author from '#models/author'

interface AuthorData {
  firstName: string
  lastName: string
}

export class AuthorService {
  async createAuthors(authors: AuthorData[]): Promise<number[]> {
    const authorIds: number[] = []
    for (const authorData of authors) {
      const author = await Author.updateOrCreate(
        { firstName: authorData.firstName, lastName: authorData.lastName },
        authorData
      )
      authorIds.push(author.id)
    }
    return authorIds
  }
}
