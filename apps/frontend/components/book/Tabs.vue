<script setup lang="ts">
interface Tab {
  title: string
  key?: string | number
}

const props = defineProps<{
  tabs: Tab[]
  modelValue?: number
  animationDuration?: number
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
  if (!tabButtonRefs.value.length || !indicatorRef.value)
    return

  const activeTabEl = tabButtonRefs.value[activeTab.value]
  if (!activeTabEl)
    return

  const containerEl = activeTabEl.parentElement
  if (!containerEl)
    return

  // Získáme offset tlačítka vzhledem k hlavnímu kontejneru
  const containerLeft = containerEl.offsetLeft
  const buttonLeft = activeTabEl.offsetLeft

  // Použití transform pro hardwarovou akceleraci
  indicatorRef.value.style.width = `${activeTabEl.offsetWidth}px`
  indicatorRef.value.style.transform = `translateX(${containerLeft + buttonLeft}px)`
}

// Výpočet stylu pro indikátor
const indicatorStyle = computed(() => {
  return {
    transition: `transform ${props.animationDuration || 250}ms cubic-bezier(0.2, 0, 0.2, 1), width ${props.animationDuration || 250}ms cubic-bezier(0.2, 0, 0.2, 1)`,
    transform: 'translateX(0)',
    width: '0px',
    willChange: 'transform, width',
  }
})

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
    <div ref="tabsNavRef" class="relative flex border-b border-gray-200">
      <div class="flex" :style="navContainerStyle">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          ref="tabButtonRefs"
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

      <!-- Animovaný indikátor -->
      <div
        ref="indicatorRef"
        class="absolute bottom-0 h-0.5 bg-blue-600"
        :style="indicatorStyle"
      />
    </div>

    <!-- Tab obsah s animací -->
    <div class="relative overflow-hidden min-h-8">
      <transition
        :name="transitionName"
        :duration="{
          enter: animationDuration || 250,
          leave: Math.floor((animationDuration || 250) * 0.85),
        }"
      >
        <div :key="activeTab" class="w-full">
          <slot :name="`tab-${activeTab}`" />
        </div>
      </transition>
    </div>
  </div>
</template>

  <style scoped>
  /* Animace posunu obsahu tabů - optimalizováno pro mobilní zařízení */
  .slide-left-enter-active,
  .slide-right-enter-active {
    transition: transform v-bind('`${props.animationDuration || 250}ms`') cubic-bezier(0.2, 0, 0.2, 1),
                opacity v-bind('`${props.animationDuration || 250}ms`') cubic-bezier(0.2, 0, 0.2, 1);
    will-change: transform, opacity;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    transition-delay: 17ms; /* Fixní hodnota - efekt je téměř roven jednomu snímku při 60fps */
  }

  .slide-left-leave-active,
  .slide-right-leave-active {
    transition: transform v-bind('`${Math.floor((props.animationDuration || 250) * 0.85)}ms`') cubic-bezier(0.2, 0, 0.2, 1),
                opacity v-bind('`${Math.floor((props.animationDuration || 250) * 0.6)}ms`') cubic-bezier(0.2, 0, 0.2, 1);
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
  </style>
