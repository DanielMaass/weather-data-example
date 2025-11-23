import { WeatherData, WeatherDataRow } from '../lib/weather-data-types';

export function getHumidityData(data?: WeatherData) {
  if (!data) return [];

  return data.map(({ MESS_DATUM, UPM }: Pick<WeatherDataRow, 'MESS_DATUM' | 'UPM'>) => {
      const year = MESS_DATUM.toString().slice(0, 4)
      const month = MESS_DATUM.toString().slice(4, 6)
      const day = MESS_DATUM.toString().slice(6, 8)
      const date = new Date(Number(year), Number(month) - 1, Number(day))

      return {
        date,
        value: UPM,
      }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}
