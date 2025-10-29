export interface WeatherMain {
  temp: number;
  feels_like?: number;
  temp_min?: number;
  temp_max?: number;
  pressure?: number;
  humidity?: number;
}

export interface WeatherItem {
  id: number;
  main: string;
  description: string;
  icon?: string;
}

export interface WeatherResponse {
  weather: WeatherItem[];
  main: WeatherMain;
  wind?: { speed: number; deg?: number; gust?: number };
  dt?: number;
  name?: string;
  coord?: { lon: number; lat: number };
  [k: string]: any;
}

export interface ForecastResponse {
  daily?: any[]; // simplified — we only use first day if present
  [k: string]: any;
}
