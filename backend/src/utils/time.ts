export const addMinutes = (time: string, mins: number): string => {
  const [hours, minutes] = time.split(":").map(Number)
  const total = hours! * 60 + minutes! + mins
  const h = Math.floor(total / 60).toString().padStart(2, "0")
  const m = (total % 60).toString().padStart(2, "0")
  return `${h}:${m}`
}
