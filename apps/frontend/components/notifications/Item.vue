<script setup lang="ts">
import type { Notification } from '@/stores/notifications'
import { useNotificationsStore } from '@/stores/notifications'
import { computed } from 'vue'

const props = defineProps<{
  notification: Notification
}>()

const store = useNotificationsStore()

const typeColor = computed(() => {
  switch (props.notification.type) {
    case 'success': return 'text-green-500'
    case 'error': return 'text-red-500'
    case 'warning': return 'text-yellow-500'
    case 'info': return 'text-blue-500'
    default: return 'text-gray-500'
  }
})

const typeStyles = computed(() => {
  const base = 'border-l-4'

  switch (props.notification.type) {
    case 'success':
      return `${base} bg-green-50 border-green-500 text-green-800`
    case 'error':
      return `${base} bg-red-50 border-red-500 text-red-800`
    case 'warning':
      return `${base} bg-yellow-50 border-yellow-500 text-yellow-800`
    case 'info':
      return `${base} bg-blue-50 border-blue-500 text-blue-800`
    default:
      return `${base} bg-gray-50 border-gray-500 text-gray-800`
  }
})

const iconStyles = computed(() => {
  const icon = {
    success: 'i-material-symbols-check-circle',
    error: 'i-material-symbols-error',
    warning: 'i-material-symbols-warning',
    info: 'i-material-symbols-info',
    default: 'i-material-symbols-notifications',
  }[props.notification.type ?? 'default']

  return `${icon} ${typeColor.value}`
})

function handleClose() {
  store.removeNotification(props.notification.id)
}
</script>

<template>
  <div
    class="flex items-center gap-3 rounded shadow-lg mb-3 py-3 pl-4 pr-3" :class="[
      typeStyles,
    ]"
  >
    <!-- Icon -->
    <div class="w-5 h-5" :class="[iconStyles]" />

    <!-- Content -->
    <div class="flex-grow min-w-0">
      <div v-if="notification.title" class="font-medium mb-1">
        {{ notification.title }}
      </div>
      <div class="text-sm">
        {{ notification.message }}
      </div>
      <button
        v-if="notification.action"
        class="mt-2 px-3 py-1 text-sm rounded bg-black/5"
        @click="notification.action.handler"
      >
        {{ notification.action.label }}
      </button>
    </div>

    <!-- Close button -->
    <button
      class="p-1"
      @click="handleClose"
    >
      <div
        class="i-material-symbols-close w-5 h-5" :class="[
          typeColor,
        ]"
      />
    </button>
  </div>
</template>
