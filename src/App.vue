<script setup lang="ts">
import { computed, ref } from 'vue'
import PetForm, { type PetFormPayload } from './components/PetForm.vue'
import ResultDisplay from './components/ResultDisplay.vue'
import {
  calculatePetAge,
  type CalculationResult,
  type PetType,
} from './composables/useAgeCalculator'
import { useLocalStorage } from './composables/useLocalStorage'

type StoredCalculation = CalculationResult & {
  petType: PetType
  birthday: string
  calculatedAt: string
}

const STORAGE_KEY = 'pet-age-result'
const today = new Date().toISOString().split('T')[0]

const { storedValue, setValue } = useLocalStorage<StoredCalculation | null>(
  STORAGE_KEY,
  null,
)

const currentResult = ref<StoredCalculation | null>(storedValue.value)

const initialPetType = computed(() => currentResult.value?.petType ?? 'dog')
const initialBirthday = computed(() => currentResult.value?.birthday ?? '')

function handleCalculate(payload: PetFormPayload) {
  const result = calculatePetAge(payload.birthday, payload.petType)

  const nextValue: StoredCalculation = {
    ...result,
    petType: payload.petType,
    birthday: payload.birthday,
    calculatedAt: new Date().toISOString(),
  }

  currentResult.value = nextValue
  setValue(nextValue)
}
</script>

<template>
  <main class="relative overflow-hidden">
    <div class="mesh-orb left-[-5rem] top-20 h-36 w-36 bg-orange-200"></div>
    <div class="mesh-orb right-[-3rem] top-40 h-44 w-44 bg-emerald-200 [animation-delay:1.5s]"></div>
    <div class="mesh-orb bottom-24 left-1/2 h-32 w-32 -translate-x-1/2 bg-amber-100 [animation-delay:3s]"></div>

    <section class="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article class="flex flex-col justify-between rounded-[2rem] border border-white/60 bg-slate-900 px-6 py-8 text-white shadow-[0_28px_90px_rgba(15,23,42,0.26)] sm:px-8 lg:px-10">
          <div class="space-y-6">
            <span class="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-orange-100">
              Pet Age Converter
            </span>

            <div class="space-y-4">
              <p class="text-sm font-medium tracking-[0.2em] text-orange-200/85">輸入生日，快速換算毛孩年齡</p>
              <h1 class="display-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                寵物歲數計算機
              </h1>
              <p class="max-w-xl text-base leading-7 text-slate-200/86 sm:text-lg">
                支援狗狗與貓咪生日換算，顯示目前年齡與對應人類歲數，重新整理頁面也會保留上次計算結果。
              </p>
            </div>
          </div>

          <div class="mt-10 grid gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm text-slate-300">換算方式</p>
              <p class="mt-2 text-xl font-bold text-white">生日 → 月齡 → 人類年齡</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm text-slate-300">資料保留</p>
              <p class="mt-2 text-xl font-bold text-white">localStorage</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-sm text-slate-300">資料來源</p>
              <p class="mt-2 text-xl font-bold text-white">BC Pets 對照表</p>
            </div>
          </div>
        </article>

        <div class="glass-panel soft-shadow rounded-[2rem] border border-white/70 px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
          <div class="grid gap-5">
            <PetForm
              :initial-birthday="initialBirthday"
              :initial-pet-type="initialPetType"
              :max-date="today"
              @calculate="handleCalculate"
            />

            <ResultDisplay :result="currentResult" />

            <footer class="rounded-3xl bg-white/70 px-4 py-4 text-sm leading-6 text-slate-600">
              資料來源：
              <a
                class="font-semibold text-slate-900 underline decoration-orange-300 underline-offset-4"
                href="https://www.bcpets.com.hk/shop/pet-encyclopedia/pets-age-vs-human/"
                target="_blank"
                rel="noreferrer"
              >
                BC Pets 狗及貓與人年齡換算表
              </a>
            </footer>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
