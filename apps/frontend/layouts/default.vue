<template>
  <div class="h-[100dvh] flex flex-col">
    <div class="flex-grow overflow-auto">
      <slot />
    </div>
    <div class="flex-shrink-0">
      <BottomNavBar />
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
