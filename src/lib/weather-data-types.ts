// Shared types for Magdeburg data rows
export type WeatherDataRow = {
  STATIONS_ID: number
  MESS_DATUM: number
  QN_3?: number
  FX?: number
  FM?: number
  QN_4?: number
  RSK?: number
  RSKF?: number
  SDK?: number
  SHK_TAG?: number
  NM?: number
  VPM?: number
  PM?: number
  TMK?: number
  UPM?: number
  TXK?: number
  TNK?: number
  TGK?: number
  // allow extra keys from the parsed TXT
  [key: string]: any
}

export type WeatherData = WeatherDataRow[]
