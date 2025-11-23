import { WeatherData, WeatherDataRow } from '../lib/weather-data-types';

export function getTemperatureData(data?: WeatherData) {
  if (!data) return [];

  return data.map(({ MESS_DATUM, TNK, TXK }: Pick<WeatherDataRow, 'MESS_DATUM' | 'TNK' | 'TXK'>) => {
      const year = MESS_DATUM.toString().slice(0, 4)
      const month = MESS_DATUM.toString().slice(4, 6)
      const day = MESS_DATUM.toString().slice(6, 8)
      const date = new Date(Number(year), Number(month) - 1, Number(day))
      const lowhigh: [number, number] | undefined = TNK && TXK ? [TNK, TXK] : undefined
      return {
        date,
        low: TNK,
        high: TXK,
        lowhigh,
      }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}
