//import server from './server.js';

const mqtt = require('mqtt');

const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1885';
const topic = 'checkpoints';
const options = {
    host:'localhost',
    port: 1885,
    username: 'admin',
    password: 'admin'
  };
const client = mqtt.connect(options);

const startMockedMqttPublishers = () => {
  setInterval(sendRandomData, 5000);
}

function generateRandomCheckpoint() {
    const id = Math.random()*29819;
    const descriptions = ['checkpoint zone 1', 'checkpoint zone 2', 'checkpoint zone 3', 'checkpoint zone 4', 'checkpoint zone 5'];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const lat = Math.random() * 10;
    const long = Math.random() * 10;
    return {
        id: id,
        lat: lat,
        long: long,
        description: description
    };
}

function generateRandomAnimal() {
    const id = Math.floor(Math.random()*10) ;
    const descriptions = ['Animal', 'Animal 2', 'Animal 3', 'Animal 4', 'NOT Animal O.O'];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const names = ['Juan', 'Mandarina', 'ElDiablo', 'Zuko', 'Escubi'];
    const name = names[Math.floor(Math.random() * names.length)];
    return {
        id: id,
        name: name,
        description: description
    };
}
const mockMessage = {
    checkpointID: '1234',
    animals: [
        { id: '11:5e:e7:84:c4:f6', rssi: -50 },
        { id: '7c:0a:3f:83:db:93', rssi: -62 },
        { id: 'c2:5a:3d:ae:10:28', rssi: -73 }
    ]
};
function generateRandomMessage(){
    return {
        checkpointID: '1234',
        animals: [
            { id: '11:5e:e7:84:c4:f6', rssi: Math.random()*-10 },
            { id: '7c:0a:3f:83:db:93', rssi: Math.random()*-10 },
            { id: 'c2:5a:3d:ae:10:28', rssi: Math.random()*-10 }
        ]
    };
}
function sendRandomData() {
    const data = generateRandomMessage();
    const message = JSON.stringify(data);
    client.publish(topic, message);
    console.log('Mensaje enviado:', message);
}

client.on('connect', function () {
    console.log('Conectado al broker correctamente. en:' + brokerUrl);
});

client.on('error', function (error) {
    console.error('Error:', error, brokerUrl);
});

//import { startMockedMqttPublishers } from './test/Mock.js';
startMockedMqttPublishers();