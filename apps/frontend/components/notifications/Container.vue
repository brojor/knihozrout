<!-- components/notifications/Container.vue -->
<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'

const store = useNotificationsStore()
</script>

<template>
  <Teleport to="#teleports">
    <div class="fixed left-0 right-0 top-0 z-50 mx-auto max-w-lg px-4 pt-4">
      <div class="relative">
        <TransitionGroup
          move-class="transition duration-500 ease"
          enter-active-class="transition duration-500 ease"
          leave-active-class="transition duration-500 ease absolute inset-x-0"
          enter-from-class="transform -translate-y-4 opacity-0"
          leave-to-class="transform -translate-y-4 opacity-0"
        >
          <NotificationsItem
            v-for="notification in store.activeNotifications"
            :key="notification.id"
            :notification="notification"
          />
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>
