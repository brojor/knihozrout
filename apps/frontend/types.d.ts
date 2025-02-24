export { }

declare global {
  interface Window {
    handleSharedText: (sharedText: string) => void
  }
}

declare module '#app' {
  interface PageMeta {
    title?: string
  }
}
