<script setup lang="ts">
import { useVirtualizer } from '@tanstack/vue-virtual'

const props = defineProps<{
  books: Book[]
}>()

// Reference a rozměry
const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(358) // Výchozí mobilní šířka

// Fixní počet sloupců a hodnoty
const columnCount = 2
const ITEM_GAP = 12
const CONTAINER_PADDING = 12

// Počet řádků
const rowCount = computed(() => Math.ceil(props.books.length / columnCount))

// Výpočet výšky řádku jako computed property
const rowHeight = computed(() => {
  const itemWidth = (containerWidth.value - (CONTAINER_PADDING * 2) - ITEM_GAP) / columnCount
  return itemWidth * (3 / 2) + 48
})

// Virtualizer s použitím computed hodnoty
const rowVirtualizer = useVirtualizer({
  count: rowCount.value,
  getScrollElement: () => containerRef.value,
  estimateSize: () => rowHeight.value,
  overscan: 5,
})

// Memoizované položky pro vykreslení
const virtualItems = computed(() => {
  return rowVirtualizer.value.getVirtualItems().map((virtualRow) => {
    const rowBooks = []

    for (let col = 0; col < columnCount; col++) {
      const bookIndex = virtualRow.index * columnCount + col
      if (bookIndex < props.books.length) {
        rowBooks.push(props.books[bookIndex])
      }
      else {
        rowBooks.push(null)
      }
    }

    return {
      virtualRow,
      books: rowBooks,
    }
  })
})

// Sledování změn v datech nebo šířce
watch([() => props.books.length, rowHeight], () => {
  rowVirtualizer.value.measure()
}, { flush: 'post' })

onMounted(() => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
    rowVirtualizer.value.measure() // Důležité: přeměření po inicializaci
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="h-full w-full overflow-auto relative px-3"
  >
    <div
      :style="{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }"
    >
      <div
        v-for="item in virtualItems"
        :key="item.virtualRow.index"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${item.virtualRow.size}px`,
          transform: `translateY(${item.virtualRow.start}px)`,
        }"
        class="flex gap-3"
      >
        <!-- Knihy v řádku -->
        <div
          v-for="(book, colIndex) in item.books"
          :key="`${item.virtualRow.index}-${colIndex}`"
          class="w-1/2"
        >
          <LibraryGridCard
            v-if="book"
            :book="book"
          />
        </div>
      </div>
    </div>
  </div>
</template>
