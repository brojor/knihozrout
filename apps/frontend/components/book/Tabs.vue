<script setup lang="ts">
interface Tab {
  title: string
  key?: string | number
}

const props = defineProps<{
  tabs: Tab[]
  modelValue?: number
  paddingInline?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const activeTab = ref(props.modelValue ?? 0)
const previousTab = ref(activeTab.value)
const tabsNavRef = ref<HTMLElement | null>(null)
const tabButtonRefs = ref<HTMLElement[]>([])
const indicatorRef = ref<HTMLElement | null>(null)

const transitionName = ref('slide-right')

function activateTab(index: number) {
  if (index === activeTab.value)
    return

  transitionName.value = index > activeTab.value ? 'slide-left' : 'slide-right'

  previousTab.value = activeTab.value
  activeTab.value = index
  emit('update:modelValue', index)

  nextTick(() => {
    updateIndicator()
  })
}

function updateIndicator() {
  const activeTabEl = tabButtonRefs.value[activeTab.value]!
  const containerEl = activeTabEl.parentElement!

  // Získáme offset tlačítka vzhledem k hlavnímu kontejneru
  const containerLeft = containerEl.offsetLeft
  const buttonLeft = activeTabEl.offsetLeft

  // Použití transform pro hardwarovou akceleraci
  indicatorRef.value!.style.width = `${activeTabEl.offsetWidth}px`
  indicatorRef.value!.style.transform = `translateX(${containerLeft + buttonLeft}px)`
}

const navContainerStyle = computed(() => {
  if (!props.paddingInline)
    return {}

  const padding = typeof props.paddingInline === 'number'
    ? `${props.paddingInline}px`
    : props.paddingInline

  return {
    paddingLeft: padding,
    paddingRight: padding,
  }
})

watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined && newValue !== activeTab.value) {
    transitionName.value = newValue > activeTab.value ? 'slide-left' : 'slide-right'

    previousTab.value = activeTab.value
    activeTab.value = newValue

    nextTick(() => {
      updateIndicator()
    })
  }
})

// Po mounted inicializujeme indikátor
onMounted(() => {
  nextTick(() => {
    updateIndicator()
  })
})
</script>

<template>
  <div class="w-full">
    <!-- Tab navigace -->
    <nav>
      <div
        ref="tabsNavRef"
        role="tablist"
        class="relative flex border-b border-gray-200"
      >
        <div class="flex" :style="navContainerStyle">
          <button
            v-for="(tab, index) in tabs"
            :key="tab.key ?? index"
            ref="tabButtonRefs"
            role="tab"
            :aria-selected="activeTab === index"
            :aria-controls="`panel-${index}`"
            class="px-4 py-3 text-sm font-medium transition-colors duration-200 relative touch-manipulation"
            :class="[
              activeTab === index
                ? 'text-blue-600'
                : 'text-gray-600 active:bg-gray-50',
            ]"
            @click="activateTab(index)"
          >
            {{ tab.title }}
          </button>
        </div>

        <div
          ref="indicatorRef"
          class="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-250 ease-[cubic-bezier(0.2,0,0.2,1)] transform translate-x-0 w-0 will-change-transform will-change-width"
          aria-hidden="true"
        />
      </div>
    </nav>

    <!-- Tab obsah s animací -->
    <div class="relative overflow-hidden min-h-8">
      <transition :name="transitionName">
        <article
          :id="`panel-${activeTab}`"
          :key="activeTab"
          role="tabpanel"
          class="w-full"
        >
          <slot :name="`tab-${activeTab}`" />
        </article>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Animace posunu obsahu tabů - optimalizováno pro mobilní zařízení */
.slide-left-enter-active,
.slide-right-enter-active {
  transition: transform 250ms cubic-bezier(0.2, 0, 0.2, 1),
              opacity 250ms cubic-bezier(0.2, 0, 0.2, 1);
  will-change: transform, opacity;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  transition-delay: 17ms;
}

.slide-left-leave-active,
.slide-right-leave-active {
  transition: transform 212ms cubic-bezier(0.2, 0, 0.2, 1),
              opacity 150ms cubic-bezier(0.2, 0, 0.2, 1);
  will-change: transform, opacity;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

/* Slide left animace: nový obsah přichází zprava */
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide right animace: nový obsah přichází zleva */
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Container height fix */
.slide-left-enter-to,
.slide-right-enter-to {
  position: relative;
}

.indicator {
  transition: transform 250ms cubic-bezier(0.2, 0, 0.2, 1),
              width 250ms cubic-bezier(0.2, 0, 0.2, 1);
  transform: translateX(0);
  width: 0;
  will-change: transform, width;
}
</style>
