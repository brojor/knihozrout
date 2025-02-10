export { }

declare global {
  interface Window {
    handleSharedText: (sharedText: string) => void
  }
}
