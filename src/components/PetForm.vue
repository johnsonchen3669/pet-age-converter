<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PetType } from '../composables/useAgeCalculator'

export type PetFormPayload = {
  petType: PetType
  birthday: string
}

const props = defineProps<{
  initialPetType: PetType
  initialBirthday: string
  maxDate: string
}>()

const emit = defineEmits<{
  calculate: [payload: PetFormPayload]
}>()

const petType = ref<PetType>(props.initialPetType)
const birthday = ref(props.initialBirthday)
const errorMessage = ref('')

watch(
  () => props.initialPetType,
  (value) => {
    petType.value = value
  },
)

watch(
  () => props.initialBirthday,
  (value) => {
    birthday.value = value
  },
)

const minDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 25)
  return date.toISOString().split('T')[0]
})

function submitForm() {
  if (!birthday.value) {
    errorMessage.value = '請先輸入毛孩生日。'
    return
  }

  if (birthday.value > props.maxDate) {
    errorMessage.value = '生日不可晚於今天。'
    return
  }

  errorMessage.value = ''
  emit('calculate', {
    petType: petType.value,
    birthday: birthday.value,
  })
}
</script>

<template>
  <section class="rounded-[1.75rem] bg-slate-950 px-5 py-5 text-white sm:px-6 sm:py-6">
    <div class="space-y-5">
      <header class="space-y-2">
        <p class="text-sm font-medium uppercase tracking-[0.28em] text-orange-200/80">Step 1</p>
        <h2 class="text-2xl font-bold">輸入寵物生日</h2>
        <p class="text-sm leading-6 text-slate-300">
          選擇毛孩類型並填入生日，系統會自動換算目前年齡與對應人類歲數。
        </p>
      </header>

      <div class="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          class="rounded-2xl border px-4 py-4 text-left transition duration-200"
          :class="petType === 'dog'
            ? 'border-orange-300 bg-orange-300/15 text-white shadow-[0_12px_30px_rgba(251,146,60,0.15)]'
            : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'"
          @click="petType = 'dog'"
        >
          <p class="text-sm text-slate-300">🐶 狗狗</p>
          <p class="mt-2 text-lg font-bold">以犬隻年齡表換算</p>
        </button>

        <button
          type="button"
          class="rounded-2xl border px-4 py-4 text-left transition duration-200"
          :class="petType === 'cat'
            ? 'border-emerald-300 bg-emerald-300/15 text-white shadow-[0_12px_30px_rgba(52,211,153,0.15)]'
            : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'"
          @click="petType = 'cat'"
        >
          <p class="text-sm text-slate-300">🐱 貓咪</p>
          <p class="mt-2 text-lg font-bold">以貓齡對照表換算</p>
        </button>
      </div>

      <label class="block space-y-2">
        <span class="text-sm font-medium text-slate-200">生日</span>
        <input
          v-model="birthday"
          type="date"
          :max="maxDate"
          :min="minDate"
          class="w-full rounded-2xl border border-white/10 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-orange-300"
        />
      </label>

      <p v-if="errorMessage" class="rounded-2xl border border-rose-300/35 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
        {{ errorMessage }}
      </p>

      <button
        type="button"
        class="w-full rounded-2xl bg-gradient-to-r from-orange-300 via-amber-300 to-emerald-300 px-4 py-4 text-base font-bold text-slate-950 transition hover:translate-y-[-1px]"
        @click="submitForm"
      >
        開始計算
      </button>
    </div>
  </section>
</template>