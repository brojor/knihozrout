export class BookRepository extends BaseRepository {
  async fetchBookByEAN(ean: number): Promise<ApiResponse<Book>> {
    return this.call<Book>('/api/books/from-ean', {
      method: 'POST',
      body: { ean },
    })
  }

  async fetchBookFromUrl(url: string): Promise<ApiResponse<Book>> {
    return this.call<Book>('/api/books/from-url', {
      method: 'POST',
      body: { url },
    })
  }

  async fetchBook(id: number): Promise<ApiResponse<Book>> {
    return this.call<Book>(`/api/books/${id}`, {
      method: 'GET',
    })
  }
}
