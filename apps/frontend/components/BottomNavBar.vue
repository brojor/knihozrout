<script setup lang="ts">
const route = useRoute()

const navigationItems = [
  { path: '/', label: 'Domů', icon: 'i-clarity:house-solid', index: 0 },
  { path: '/library', label: 'Knihovna', icon: 'i-clarity:library-solid', index: 1 },
  { path: '/search', label: 'Hledat', icon: 'i-clarity:search-line', index: 2 },
  { path: '/lists', label: 'Seznamy', icon: 'i-clarity:list-solid', index: 3 },
  { path: '/profile', label: 'Profil', icon: 'i-clarity:user-solid', index: 4 },
] as const
</script>

<template>
  <nav class="h-14 border-t border-gray-200">
    <ul class="h-full flex list-none m-0 p-0">
      <li
        v-for="item in navigationItems"
        :key="item.path"
        class="flex-1"
      >
        <NuxtLink
          :to="item.path"
          class="h-full flex flex-col items-center justify-center decoration-none text-base-gray"
          :class="{ 'text-primary': route.path === item.path }"
        >
          <div :class="item.icon" class="mb-1" />
          <span class="text-xs leading-none">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
