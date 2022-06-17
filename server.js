const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const moment = require('moment');

const connectDB = require('./utils/db');

const SerialResponse = require('./models/SerialResponse.model');

app.use(cors());
app.use(express.json());
require('dotenv').config()

connectDB();

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.post('/serial-data', async (req, res) => {
    try {
        let { data, espId, latitude, longitude, speed, altitude } = req.body;

        if(latitude) latitude = latitude.toString;
        if(longitude) longitude = longitude.toString;
        if(speed) speed = speed.toString;
        if(altitude) altitude = altitude.toString;
        
        console.log('Serial Reponse : ', req.body);
        const srObj = await SerialResponse.findById(espId);
        if(!srObj) await SerialResponse.create({_id: espId});
        const serialRes = await SerialResponse.findByIdAndUpdate(espId, {
            data: data,
            time: moment().format('DD MM YYYY HH:mm:ss'),
            latitude: latitude,
            longitude: longitude,
            speed: speed,
            altitude: altitude
        });
    
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

app.get('/get-data', async (req, res) => {
    try {
        const srObj = await SerialResponse.findById('1');
        return res.status(200).json({
            success: true,
            data: srObj
        });
    } catch (err) {
        console.log('error !', err);
        return res.status(503).json({
            success: false,
            error: err
        })
    }
});

server.listen(process.env.PORT || 3000, () => {
    let port = process.env.PORT || 3000;
    console.log(`listening on localhost:${port}`);
});
