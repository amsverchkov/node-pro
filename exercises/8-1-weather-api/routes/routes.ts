import express, { Request, Response } from 'express';
import { printHelp } from './../services/log.service.js';
import { saveToken, saveLatAndLon, getForecast } from './../weather.js';

const allRoutes = express.Router();

allRoutes.get('/help', (req: Request, res: Response) => {
    res.status(200).json(printHelp(false))
});

allRoutes.get('/help', (req: Request, res: Response) => {
    res.status(200).json(printHelp(false))
});

allRoutes.post('/save_token', (req: Request, res: Response) => {
    const token = req.body?.token;
    if (!token) {
        res.status(500).send('Unfortunately there is no token param in post body json');
    }
    res.cookie('token', token)
    saveToken(token);
    res.status(200).send();
});

allRoutes.post('/set_lat(itude)?_lon(longitude)?_and_get_weather', async (req: Request, res: Response) => {
    const lat = req.body.lat ?? req.body.latitude;
    const lon = req.body.lon ?? req.body.longtitude;
    if (!lat || !lon) {
        res.status(500).send(`You didn't specified on of post body params like lat or lon in json`);
    }
    await saveLatAndLon(parseFloat(lat), parseFloat(lon));
    const result = await getForecast(false);
    res.status(200).send(result);
})

allRoutes.get('/', async (req: Request, res: Response) => {
    const result = await getForecast(false);
    res.status(200).send(result);
})

export { allRoutes }