import axios from 'axios';
import { WeatherResponse, ForecastResponse } from '../../types/weather.types';

export async function fetchCurrent(city: string | null, lat: number | null, lon: number | null, apiKey: string, units = 'metric'): Promise<WeatherResponse> {
  let url = '';
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  }
  const { data } = await axios.get<WeatherResponse>(url);
  return data;
}

export async function fetchForecastOneDay(lat: number, lon: number, apiKey: string, units = 'metric'): Promise<ForecastResponse> {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current,alerts&appid=${apiKey}&units=${units}`;
  const { data } = await axios.get<ForecastResponse>(url);
  return data;
}

export function checkConditions(weather: WeatherResponse | any, conditions: Array<{ type: string; threshold?: number }>): { alert: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let alert = false;

  for (const c of conditions) {
    const t = c.type;
    const th = c.threshold;
    if (!weather) continue;
    if (t === 'rain') {
      const has = Array.isArray(weather.weather) && weather.weather.some((w: any) => String(w.main).toLowerCase().includes('rain') || String(w.description).toLowerCase().includes('rain'));
      if (has) { alert = true; reasons.push('rain'); }
    } else if (t === 'snow') {
      const has = Array.isArray(weather.weather) && weather.weather.some((w: any) => String(w.main).toLowerCase().includes('snow') || String(w.description).toLowerCase().includes('snow'));
      if (has) { alert = true; reasons.push('snow'); }
    } else if (t === 'temp_below') {
      const temp = weather.main?.temp;
      if (typeof temp === 'number' && temp < (th ?? 0)) { alert = true; reasons.push(`temp_below ${th}`); }
    } else if (t === 'temp_above') {
      const temp = weather.main?.temp;
      if (typeof temp === 'number' && temp > (th ?? 0)) { alert = true; reasons.push(`temp_above ${th}`); }
    } else if (t === 'wind_above') {
      const speed = weather.wind?.speed;
      if (typeof speed === 'number' && speed > (th ?? 0)) { alert = true; reasons.push(`wind_above ${th}`); }
    }
  }

  return { alert, reasons };
}
