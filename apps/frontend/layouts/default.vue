<template>
  <div class="min-h-[100dvh] flex flex-col">
    <div class="flex-1 p-4 flex">
      <slot />
    </div>
    <BottomNavBar />
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
