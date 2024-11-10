//import server from './server.js';

const mqtt = require('mqtt');

const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const topic = "checkpoint";
const options = {
    host: process.env.MQTTHOST,
    port: process.env.MQTTPORT,
    clientId: 'Backend',
    username: "api",
    password: "api",
};
const fallbackOptions = {
    host: 'test.mosquitto.org',  // Servidor de prueba de Mosquitto
    port: 1883,
};
const client = mqtt.connect(fallbackOptions);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const startMockedMqttPublishers = () => {
    setInterval(sendRandomData, getRandomInt(1000, 20000));
}


function generateRandomMessage(i) {
    return {
        checkpointID: `8C:AA:B5:8B:F8:4${i}`,
        animals: [
            { id: '11:5e:e7:84:c4:f6', rssi: Math.random() * -20 },
            { id: '7c:0a:3f:83:db:93', rssi: Math.random() * -20 },
            { id: 'c2:5a:3d:ae:10:28', rssi: Math.random() * -20 },
            { id: '0f:ad:28:07:10:14', rssi: Math.random() * -20 },
            { id: '02:b3:ec:c2:17:72', rssi: Math.random() * -20 }
        ]
    };
}

function sendRandomData() {

    for(let i=0;i<4;i++){
        const data = generateRandomMessage(i);
        const message = JSON.stringify(data);
        client.publish(topic, message);
        console.log('Mensaje enviado:', message);
    }

    
}

client.on('connect', function () {
    console.log('Conectado al broker correctamente. en:' + options);
});

client.on('error', function (error) {
    console.error('Error:', error, brokerUrl);
});

//import { startMockedMqttPublishers } from './test/Mock.js';
sendRandomData();
startMockedMqttPublishers();
