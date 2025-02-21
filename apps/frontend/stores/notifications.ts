export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// Application constants
const NOTIFICATION_DEFAULTS = {
  DURATION: 5000, // 5 seconds
  MAX_COUNT: 5, // maximum number of notifications shown at once
} as const

export interface Notification {
  id: string
  type: NotificationType
  message: string
  title?: string
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
  createdAt: number
}

interface NotificationsState {
  notifications: Notification[]
}

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    notifications: [],
  }),

  getters: {
    activeNotifications: state => state.notifications,
  },

  actions: {
    addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
      const id = crypto.randomUUID()
      const newNotification: Notification = {
        ...notification,
        id,
        createdAt: Date.now(),
        duration: notification.duration ?? NOTIFICATION_DEFAULTS.DURATION,
      }

      // Add to start of array for newest-first ordering
      this.notifications.unshift(newNotification)

      // Remove if we exceed max notifications
      if (this.notifications.length > NOTIFICATION_DEFAULTS.MAX_COUNT) {
        this.notifications.pop()
      }

      // Set up auto-removal if duration is specified
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, newNotification.duration)
      }

      return id
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    // Helper methods for different notification types
    success(message: string, options: Partial<Omit<Notification, 'id' | 'type' | 'message' | 'createdAt'>> = {}) {
      return this.addNotification({ type: 'success', message, ...options })
    },

    error(message: string, options: Partial<Omit<Notification, 'id' | 'type' | 'message' | 'createdAt'>> = {}) {
      return this.addNotification({ type: 'error', message, ...options })
    },

    warning(message: string, options: Partial<Omit<Notification, 'id' | 'type' | 'message' | 'createdAt'>> = {}) {
      return this.addNotification({ type: 'warning', message, ...options })
    },

    info(message: string, options: Partial<Omit<Notification, 'id' | 'type' | 'message' | 'createdAt'>> = {}) {
      return this.addNotification({ type: 'info', message, ...options })
    },

    clearAll() {
      this.notifications = []
    },
  },
})
