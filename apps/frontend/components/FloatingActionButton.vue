<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['scan', 'manual'])
const isOpen = ref(false)
const fabRef = ref<HTMLElement | undefined>()

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function handleActionClick(action: 'scan' | 'manual') {
  emit(action)
  isOpen.value = false
}

onClickOutside(fabRef, () => {
  if (isOpen.value) {
    isOpen.value = false
  }
})
</script>

<template>
  <div
    ref="fabRef"
    class="absolute bottom-[4vw] right-[4vw]"
    aria-label="Přidat knihu"
  >
    <button
      class="absolute right-0 w-[12vw] h-[12vw] rounded-full bg-[#3DAAD6] text-white flex items-center justify-center shadow-lg transition-transform duration-300"
      :class="[isOpen ? 'translate-y-[-28vw]' : 'scale-90 shadow-none pointer-events-none']"
      aria-label="Přidat knihu ručně"
      :aria-hidden="!isOpen"
      @click="handleActionClick('manual')"
    >
      <div
        class="i-material-symbols:edit-square-outline text-2xl"
        aria-hidden="true"
      />
    </button>

    <button
      class="absolute right-0 w-[12vw] h-[12vw] rounded-full bg-[#2ED68E] text-white flex items-center justify-center shadow-lg transition-transform duration-300"
      :class="[isOpen ? 'translate-y-[-14vw]' : 'scale-90 shadow-none pointer-events-none']"
      aria-label="Naskenovat čárový kód knihy"
      :aria-hidden="!isOpen"
      @click="handleActionClick('scan')"
    >
      <div
        class="i-material-symbols:barcode text-2xl"
        aria-hidden="true"
      />
    </button>

    <button
      class="relative w-[12vw] h-[12vw] rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 bg-[#D66127] text-white"
      aria-label="Menu pro přidání knihy"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    >
      <div
        class="i-material-symbols:add text-2xl transition-transform duration-300"
        :class="{ 'rotate-45': isOpen }"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
