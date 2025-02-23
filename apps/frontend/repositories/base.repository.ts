import type { $Fetch, FetchOptions, FetchResponse } from 'ofetch'
import { useAuthStore } from '~/stores/auth'
import { useNotificationsStore } from '~/stores/notifications'

export class BaseRepository {
  protected api: $Fetch

  constructor() {
    const config = useRuntimeConfig()
    const { token } = useAuthStore()
    const notifications = useNotificationsStore()

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
      onRequestError({ error }: { error: Error }) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          notifications.error('Zkontrolujte prosím své připojení k internetu.', {
            title: 'Chyba připojení',
          })
          return
        }

        notifications.error('Nastala neočekávaná chyba.', {
          title: 'Chyba aplikace',
        })
        console.error('Unexpected request error:', error)
      },
      onResponseError({ response }: { response: FetchResponse<ApiErrorResponse> }) {
        const notifications = useNotificationsStore()

        if (response.status === 401) {
          const auth = useAuthStore()
          auth.clearAuth()
          navigateTo('/auth')
          return
        }

        if (response.status >= 500) {
          notifications.error('Omlouváme se, někde se stala chyba. Zkuste to prosím později.', {
            title: 'Chyba serveru',
          })
          return
        }

        if (response.status === 429) {
          notifications.error('Zkuste to prosím později.', {
            title: 'Příliš mnoho požadavků',
          })
          return
        }

        if ([400, 404, 409, 422].includes(response.status)) {
          if (!response._data) {
            notifications.error('Nastala neočekávaná chyba.', {
              title: 'Chyba aplikace',
            })
            return
          }

          throw new ApiError(response._data)
        }

        notifications.error('Nastala neočekávaná chyba.', {
          title: 'Chyba aplikace',
        })
        console.error('Unexpected response status:', response.status)
      },
    })
  }

  protected call<T>(endpoint: string, options?: FetchOptions<'json'>): Promise<T> {
    return this.api<T>(endpoint, options)
  }
}
