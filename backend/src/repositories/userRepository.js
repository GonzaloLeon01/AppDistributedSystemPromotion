const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const adminFilePath = path.join(__dirname, '../models/admin.json');

class UserRepository {
    // Función para comparar la contraseña ingresada con el hash almacenado
    async verifyPassword(password, hashedPassword) {
        console.log(password);
        console.log(hashedPassword);
        const match = await bcrypt.compare(password, hashedPassword);
        return match; // Retorna true si la contraseña coincide, false si no
    }

    async getAll() {
        try {
            const data = await fs.readFile(adminFilePath);
            const users = JSON.parse(data);
            return users.data;
        } catch (error) {
            throw new Error('Error al leer el archivo de administradores');
        }
    }

    async verifyCredentials(username, password) {
        try {
            const users = await this.getAll();
            const user = users.find(u => 
                u.username === username
            );
            console.log(user);
            if(user){
                const match=await this.verifyPassword(password,user.password);
                if(match){
                    return user;
                }
            }
            return null;
        } catch (error) {
            throw new Error('Error al verificar credenciales',error);
        }
    }

    async verifyRefreshToken(username) {
        try {
            const users = await this.getAll();
            return users.find(u => u.username === username) || null;
        } catch (error) {
            throw new Error('Error al verificar usuario');
        }
    }

}

module.exports = new UserRepository();