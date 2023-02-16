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
    switch (iconCode.slice(0, -1)) {
        case '01':
            return '☀️';
        case '02':
            return '🌤️';
        case '03':
            return '☁️';
        case '04':
            return '☁️';
        case '09':
            return '🌧️';
        case '10':
            return '🌦️';
        case '11':
            return '🌩️';
        case '13':
            return '❄️';
        case '50':
            return '🌫️';
        default:
            return '';
    }
}


const getWeather = async (lat: number, lon: number): Promise<OpenDataWeatherResponse> => {
    //const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
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
    //console.log(data);
    return data;
    // const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    // url.searchParams.append('lat', lat);
    // url.searchParams.append('lon', lon);
    // url.searchParams.append('appid', token);
    // url.searchParams.append('lang', 'ru');
    // url.searchParams.append('units', 'metric');
    // https.get(url, (response) => {
    //     let result = '';
    //     response.on('data', (chunk) => {
    //         result += chunk;
    //     });
    //     response.on('end', () => {
    //         console.log(result);
    //     });
    // });
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