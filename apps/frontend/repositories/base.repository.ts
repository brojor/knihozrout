import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'

export class BaseRepository {
  protected api: $Fetch

  constructor() {
    const config = useRuntimeConfig()
    const { token } = useAuthStore()

    this.api = $fetch.create({
      baseURL: config.public.baseUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      onRequest({ options }: { options: FetchOptions }) {
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          }
        }
      },
      onResponseError<T>({ response }: { response: FetchResponse<T> }) {
        if (response.status === 401) {
          const auth = useAuthStore()
          auth.clearAuth()
          navigateTo('/auth')
        }
      },
    })
  }

  protected call<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.api<T>(endpoint, options)
  }
}
