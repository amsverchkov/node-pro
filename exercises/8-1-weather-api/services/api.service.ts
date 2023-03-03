import { getKeyValue, TOKEN_DICTIONARY } from './storage.service.js';
import axios from 'axios';

export interface OpenDataWeatherResponse {
    name: string;
    main: {
        temp: number;
    },
    weather: {
        description: string;
        icon: string;
    }[],
}

export const getIcon = (iconCode: string): string => {
    const iconCodeNumber = iconCode.slice(0, -1);
    const iconCodeNumberToIcon: Record<string, string> = {
        '01': '☀️',
        '02': '🌤️',
        '03': '☁️',
        '04': '☁️',
        '09': '🌧️',
        '10': '🌦️',
        '11': '🌩️',
        '13': '❄️',
        '50': '🌫️',
    }
    return iconCodeNumberToIcon[iconCodeNumber] ?? '';
}


const getWeather = async (lat: number, lon: number): Promise<OpenDataWeatherResponse> => {
    const token = process.env.TOKEN ?? await getKeyValue(TOKEN_DICTIONARY.token) ?? getCookie(TOKEN_DICTIONARY.token);
    if (!token) {
        throw new Error('API key is not set, use -t [API_KEY]');
    }
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            'lat': lat,
            'lon': lon,
            'appid': token,
            'lang': 'en',
            'units': 'metric'
        }
    });
    return data;
};

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';')?.shift() ?? null;
    }
    return null;
}

export { getWeather };