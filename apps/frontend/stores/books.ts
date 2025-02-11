import type { Book } from '~/composables/api'

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
  // getters: {
  //   currentBook: state => state.currentBook,
  // },
})
