export const useBooksStore = defineStore('books', {
  state: () => ({
    currentBook: null as Book | null,
  }),
  actions: {
    setCurrentBook(book: Book) {
      this.currentBook = book
    },
    clearCurrentBook() {
      this.currentBook = null
    },
  },
})
