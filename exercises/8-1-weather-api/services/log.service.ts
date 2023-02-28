import chalk from 'chalk';
import dedent from 'dedent-js';
import { OpenDataWeatherResponse } from './api.service.js';

const printError = (error: string) => {
    console.log(`${chalk.red('ERROR:')} ${error}`);
}


const printSuccess = (message: string) => {
    console.log(`${chalk.green('Success:')} ${message}`);
}

const printHelp = (printInConsole: boolean = true): object | void => {
    if (printInConsole) {
        console.log(
            dedent`${chalk.cyan('Help: ')} 
            Без параметров - вывод погоды
            -s [CITY] для установки города
            -h для вывода помощи
            -t [API_KEY] для установки токена
            `
        );
    } else {
        return {
            'withoutParams': 'вывод погоды',
            '/help [get]': 'для вывода помощи',
            '/add_token [post]': 'для установки токена, параметры : token(string, required)',
            '/get_weather [get]': 'для поиска погоды, параметры: lat(float, required) lon(float, required)',
        }
    }
}

const printWeather = (res: OpenDataWeatherResponse, icon: string, printInConsole: boolean = true) => {
    let weatherInitMessage;
    const temp = res?.main?.temp;
    switch (true) {
        case temp > 25:
            weatherInitMessage = `${chalk.bgRed('The weather is rather hot')}`;
            break;
        case temp >= 15 && temp <= 25:
            weatherInitMessage = `${chalk.bgGreen('The weather is wonderful')}`;
            break;
        case temp > -2 && temp < 15:
            weatherInitMessage = `${chalk.bgYellow('The weather is not very cold')}`;
            break;
        case temp > -10 && temp <= -2:
            weatherInitMessage = `${chalk.bgYellow('The weather is cold')}`;
            break;
        case temp < -10:
            weatherInitMessage = `${chalk.bgRed('The weather is very cold')}`;
            break;
        default:
            weatherInitMessage = 'Weather is unknown';
    }
    if (printInConsole) {
        console.log(
            dedent`${weatherInitMessage}
            ${icon} ${res.weather[0].description}
            it is ${temp} degrees now in the city ${res.name} 
            `
        )
    } else {
        return `${res.weather[0].description} it is ${temp} degrees now in the city ${res.name}`
    }

}

export { printError, printSuccess, printHelp, printWeather };