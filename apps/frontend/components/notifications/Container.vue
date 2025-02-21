<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'

const store = useNotificationsStore()
</script>

<template>
  <Teleport to="#teleports">
    <div class="fixed left-0 right-0 top-0 z-50 mx-auto max-w-lg px-4 pt-4">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <NotificationsItem
          v-for="notification in store.activeNotifications"
          :key="notification.id"
          :notification="notification"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>
