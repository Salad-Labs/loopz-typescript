export const getUniquePropertyValues = <T>(
  array: T[],
  property: keyof T
): string[] => {
  const uniqueValues = new Set<string>()

  array.forEach((item) => {
    const value = item[property]
    if (typeof value === "string") {
      uniqueValues.add(value)
    }
  })

  return Array.from(uniqueValues)
}
