#!/usr/bin/env node
import { getWeather, getIcon } from './services/api.service.js';
import getArgs from './helpers/args.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log.service.js';
import { getKeyValue, saveKeyValue, TOKEN_DICTIONARY } from './services/storage.service.js';
import axios from 'axios';
import express from 'express';
import { allRoutes } from './routes/routes.js';

const port = 3000;

export const saveToken = async (token: string) => {
    if (!token.length) {
        printError('Не передан токен!');
        return;
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Token saved');
    } catch (e) {
        const typedError = e as Error;
        console.error(typedError)
        printError(typedError.message);
    }
}

export const saveLatAndLon = async (lat: number, lon: number) => {
    if (!Number(lat) || !Number(lon)) {
        printError('Не переданы широта и долгота, либо это не числа!');
        return;
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.lat, lat);
        await saveKeyValue(TOKEN_DICTIONARY.lon, lon);
        printSuccess('Latitude and longtitude were saved');
    } catch (e) {
        const typedError = e as Error;
        console.error(typedError)
        printError(typedError?.message);
    }
}



export const getForecast = async (printInConsole: boolean = true): Promise<string | undefined> => {
    try {
        const lon = await getKeyValue(TOKEN_DICTIONARY.lon);
        const lat = await getKeyValue(TOKEN_DICTIONARY.lat);
        const weather = await getWeather(lat ?? process.env.LAT, lon ?? process.env.LON);
        //console.log(weather);
        return printWeather(weather, getIcon(weather?.weather[0]?.icon), printInConsole);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err?.response?.status == 400) {
                printError('Неверно указан город');
            } else if (err?.response?.status == 401) {
                printError('Неверный токен');
            } else {
                console.log(err?.response?.status);
                printError(err.message);
            }
        } else {
            const typedError = err as Error;
            printError(typedError.message);
        }

    }
}

const intiCli = async () => {
    const args = getArgs(process.argv);
    if (args.h) {
        printHelp();
    }

    if (args.t && typeof args.t === 'string') {
        await saveToken(args.t);
    }

    if (args.lat && args.lon && typeof args.lat === 'string' && typeof args.lon === 'string') {
        const lat = parseFloat(args.lat);
        const lon = parseFloat(args.lon);
        await saveLatAndLon(lat, lon);
    }

    getForecast();
}

const initAppWithExpress = (): void => {
    const app = express();
    app.use(express.json());
    app.use(allRoutes);
    app.listen(port);
}

initAppWithExpress()

