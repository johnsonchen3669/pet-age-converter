<script setup lang="ts">
import { computed } from 'vue'
import type { CalculationResult, PetType } from '../composables/useAgeCalculator'

type StoredCalculation = CalculationResult & {
  petType: PetType
  birthday: string
  calculatedAt: string
}

const props = defineProps<{
  result: StoredCalculation | null
}>()

const petLabel = computed(() => (props.result?.petType === 'cat' ? '貓咪' : '狗狗'))

const calculatedAtLabel = computed(() => {
  if (!props.result) {
    return ''
  }

  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(props.result.calculatedAt))
})
</script>

<template>
  <section class="rounded-[1.75rem] bg-white/85 p-5 text-slate-900 ring-1 ring-slate-200/80 sm:p-6">
    <div v-if="result" class="space-y-5">
      <header class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Step 2</p>
          <h2 class="mt-2 text-2xl font-bold">換算結果</h2>
        </div>
        <span class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          {{ petLabel }}
        </span>
      </header>

      <div class="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
        <div class="rounded-3xl bg-slate-950 px-5 py-5 text-white">
          <p class="text-sm text-slate-300">目前年齡</p>
          <p class="mt-3 text-3xl font-black sm:text-4xl">
            {{ result.petAgeYears }} 歲 {{ result.petAgeMonths }} 個月
          </p>
          <p class="mt-3 text-sm text-slate-300">
            生日：{{ result.birthday }}
          </p>
        </div>

        <div class="rounded-3xl bg-gradient-to-br from-orange-100 via-amber-50 to-emerald-100 px-5 py-5">
          <p class="text-sm font-medium text-slate-600">對應人類年齡</p>
          <p class="display-serif mt-3 text-5xl font-black leading-none text-slate-950 sm:text-6xl">
            {{ result.humanAge }}
          </p>
          <p class="mt-3 text-base font-semibold text-slate-700">大約等於 {{ result.humanAge }} 歲的人類階段</p>
        </div>
      </div>

      <div class="rounded-3xl bg-slate-100 px-4 py-4 text-sm leading-6 text-slate-600">
        <p>上次計算：{{ calculatedAtLabel }}</p>
        <p v-if="result.isEstimated" class="mt-1 font-medium text-slate-800">
          目前年齡落在對照表外圍區間，顯示值為依鄰近資料點推估。
        </p>
      </div>
    </div>

    <div v-else class="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-slate-500">
      <p class="text-lg font-semibold text-slate-700">還沒有計算結果</p>
      <p class="mt-2 text-sm leading-6">填入生日並按下「開始計算」，這裡就會顯示寵物年齡與對應的人類歲數。</p>
    </div>
  </section>
</template>