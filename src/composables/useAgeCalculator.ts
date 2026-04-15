import { catAgeTable, dogAgeTable, type AgePoint } from '../data/ageTable'

export type PetType = 'dog' | 'cat'

export type CalculationResult = {
  petAgeYears: number
  petAgeMonths: number
  humanAge: number
  totalMonths: number
  isEstimated: boolean
}

function diffInMonths(startDate: Date, endDate: Date) {
  let wholeMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())

  let anchor = new Date(startDate)
  anchor.setMonth(anchor.getMonth() + wholeMonths)

  if (endDate < anchor) {
    wholeMonths -= 1
    anchor = new Date(startDate)
    anchor.setMonth(anchor.getMonth() + wholeMonths)
  }

  const nextAnchor = new Date(anchor)
  nextAnchor.setMonth(nextAnchor.getMonth() + 1)

  const elapsed = endDate.getTime() - anchor.getTime()
  const span = nextAnchor.getTime() - anchor.getTime()
  const fractionalMonths = span === 0 ? 0 : elapsed / span

  return Math.max(0, wholeMonths + fractionalMonths)
}

function interpolateHumanAge(totalMonths: number, ageTable: AgePoint[]) {
  const firstPoint = ageTable[0]
  const lastPoint = ageTable[ageTable.length - 1]

  if (totalMonths <= firstPoint.months) {
    return { humanAge: firstPoint.humanAge, isEstimated: true }
  }

  for (let index = 1; index < ageTable.length; index += 1) {
    const currentPoint = ageTable[index]
    const previousPoint = ageTable[index - 1]

    if (totalMonths <= currentPoint.months) {
      const ratio =
        (totalMonths - previousPoint.months) /
        (currentPoint.months - previousPoint.months)

      return {
        humanAge:
          previousPoint.humanAge +
          (currentPoint.humanAge - previousPoint.humanAge) * ratio,
        isEstimated: false,
      }
    }
  }

  const previousPoint = ageTable[ageTable.length - 2]
  const ratio =
    (totalMonths - previousPoint.months) / (lastPoint.months - previousPoint.months)

  return {
    humanAge:
      previousPoint.humanAge + (lastPoint.humanAge - previousPoint.humanAge) * ratio,
    isEstimated: true,
  }
}

export function calculatePetAge(birthday: string, petType: PetType): CalculationResult {
  const birthDate = new Date(`${birthday}T00:00:00`)
  const today = new Date()

  if (Number.isNaN(birthDate.getTime())) {
    throw new Error('生日格式無效')
  }

  if (birthDate > today) {
    throw new Error('生日不可晚於今天')
  }

  const totalMonths = diffInMonths(birthDate, today)
  const ageTable = petType === 'dog' ? dogAgeTable : catAgeTable
  const roundedMonths = Math.floor(totalMonths)
  const petAgeYears = Math.floor(roundedMonths / 12)
  const petAgeMonths = roundedMonths % 12
  const interpolation = interpolateHumanAge(totalMonths, ageTable)

  return {
    petAgeYears,
    petAgeMonths,
    totalMonths,
    humanAge: Number(interpolation.humanAge.toFixed(1)),
    isEstimated: interpolation.isEstimated,
  }
}