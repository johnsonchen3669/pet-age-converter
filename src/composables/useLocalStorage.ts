import { ref } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const storedValue = ref<T>(initialValue)

  try {
    const rawValue = localStorage.getItem(key)

    if (rawValue !== null) {
      storedValue.value = JSON.parse(rawValue) as T
    }
  } catch {
    storedValue.value = initialValue
  }

  function setValue(value: T) {
    storedValue.value = value
    localStorage.setItem(key, JSON.stringify(value))
  }

  function clearValue() {
    storedValue.value = initialValue
    localStorage.removeItem(key)
  }

  return {
    storedValue,
    setValue,
    clearValue,
  }
}