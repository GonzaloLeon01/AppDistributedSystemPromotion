const axios = require('axios');

// URL de tu servidor HTTP
const serverUrl = 'http://localhost:4000';//process.env.SERVER_URL; // Cambia esto según tu servidor

async function checkServer() {
    checkAnimals();
    checkCheckpoints();
}
async function checkAnimals(){
    try {
        // Hacer una solicitud GET
        const response = await axios.get(serverUrl + '/API/animals');//'/API/animals'
        console.log('Respuesta GET:', JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud GET:', error.message);
    }

    try {
        // Hacer una solicitud POST
        const newAnimal =
            { id: '1',  name : "aminal", description:"descpcion"};
        
        const response = await axios.post(serverUrl+ '/API/animals', JSON.stringify(newAnimal),{
            headers: {
              'Content-Type': 'application/json'
            }});// o JSON.stringify(postData); '/API/animals'
        console.log('Respuesta POST:', JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
    try {
        // Hacer una solicitud PATCH
        const modAnimal =
            { name : "aminalM", description:"descpcion2"};
        
        const response = await axios.patch(serverUrl+ '/API/animals/1', JSON.stringify(modAnimal));// o JSON.stringify(postData); '/API/animals'
        console.log('Respuesta PATCH:', JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud PATCH:', error.message);
    }
    try {
        // Hacer una solicitud DELETE
        const response = await axios.delete(serverUrl + '/API/animals/1');//'/API/animals'
        console.log('Respuesta DELETE:', JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud DELETE:', error.message);
    }
}
async function checkCheckpoints(){
    try {
        // Hacer una solicitud GET
        const response = await axios.get(serverUrl + '/API/checkpoints');//'/API/animals'
        console.log('Respuesta GET:', JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud GET:', error.message);
    }

    try {
        // Hacer una solicitud POST
        const newCheckpoint =
            { id: 'cee1f9bf-6e42-4071-859a-82d71e231cc1',  lat : 10, long:10,description : 'el chuck'};
        
        const response = await axios.post(serverUrl+ '/API/checkpoints', JSON.stringify(newCheckpoint));// o JSON.stringify(postData); '/API/animals'
        console.log('Respuesta POST:',JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
    try {
        // Hacer una solicitud PATCH
        const modCheckpoint =
        {  lat : 0, long:0,description : 'el chack'};
        
        const response = await axios.patch(serverUrl+ '/API/animals/cee1f9bf-6e42-4071-859a-82d71e231cc1',  JSON.stringify(modCheckpoint));// o JSON.stringify(postData);
        console.log('Respuesta PATCH:', JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud PATCH:', error.message);
    }
    try {
        // Hacer una solicitud DELETE
        const response = await axios.delete(serverUrl + '/API/checkpoints/cee1f9bf-6e42-4071-859a-82d71e231cc1');
        console.log('Respuesta DELETE:', JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud DELETE:', error.message);
    }
}
async function checkUsuarios(){
    try {
        // Hacer una solicitud GET
        const response = await axios.get(serverUrl + '/');//'/API/animals'
        console.log('Respuesta GET:', response.data);
    } catch (error) {
        console.error('Error en la solicitud GET:', error.message);
    }
    try {
        // Hacer una solicitud POST
        const credentials =
            { username: "Ignacio",  password : "5645"};
        
        const response = await axios.post(serverUrl+ '/API/login', JSON.stringify(credentials),{
            headers: {
              'Content-Type': 'application/json'
            }});// o JSON.stringify(postData); '/API/animals'
            console.log('Respuesta POSTY:');
        console.log('Respuesta POST:', JSON.parse(response.data));
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
}
checkUsuarios();
checkServer();