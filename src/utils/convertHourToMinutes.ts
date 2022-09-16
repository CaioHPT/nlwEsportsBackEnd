export function convertHourToMinutes(hour: string): number{
    const [hours, minutes] = hour.split(":").map(Number)

    const minutesAmount = (hours * 60) + minutes

    return minutesAmount
}