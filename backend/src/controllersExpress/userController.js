const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const {
    accessTokenSecret,
    refreshTokenSecret,
    accessTokenExpiration,
    refreshTokenExpiration,
} = require("../config/auth.config");

class UserController {
    constructor() {
        // Bind de los métodos
        this.login = this.login.bind(this);
        this.refresh = this.refresh.bind(this);
        this.validateCredentials = this.validateCredentials.bind(this);
    }

    async login(req, res) {
        try {
            let credentials = this.parseRequestBody(req.body);
            console.log('Login attempt for:', credentials.username);

            if (!this.validateCredentials(credentials)) {
                return res.status(400).json({ error: 'Ausencia de datos para llevar a cabo una request' });
            }

            const user = await userRepository.verifyCredentials(
                credentials.username,
                credentials.password
            );

            if (user) {
                const accessToken = this.generateAccessToken(user);
                const refreshToken = this.generateRefreshToken(user);

                res.status(200).json({
                    message: 'Login exitoso',
                    accessToken,
                    refreshToken,
                    user: {
                        username: user.username,
                    },
                });
            } else {
                res.status(401).json({ error: 'No existe el token, contraseña invalida' });
            }
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async refresh(req, res) {
        try {
            let body = this.parseRequestBody(req.body);
            const { refreshToken } = body;
            
            if (!refreshToken) {
                return res.status(400).json({ error: 'Ausencia de datos para llevar a cabo una request' });
            }

            jwt.verify(refreshToken, refreshTokenSecret, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ error: 'Token existente pero erróneo' });
                }

                try {
                    const user = await userRepository.verifyRefreshToken(decoded.username);
                    if (!user) {
                        return res.status(404).json({ error: 'Falla en encontrar una ruta/ el contenido solicitado' });
                    }

                    const newAccessToken = this.generateAccessToken(user);
                    res.status(200).json({ accessToken: newAccessToken });
                } catch (error) {
                    console.error('Error verifying refresh token:', error);
                    res.status(500).json({ error: 'Falla en el servidor' });
                }
            });
        } catch (error) {
            console.error('Error in refresh:', error);
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    parseRequestBody(body) {
        try {
            // Si el body es un objeto con una única clave que parece JSON
            if (typeof body === 'object' && Object.keys(body).length === 1) {
                const key = Object.keys(body)[0];
                if (key.startsWith('{')) {
                    return JSON.parse(key);
                }
            }
            // Si el body ya es un objeto válido
            if (body && typeof body === 'object' && !Array.isArray(body)) {
                return body;
            }
            // Si el body es una cadena JSON
            if (typeof body === 'string') {
                return JSON.parse(body);
            }
            
            return body;
        } catch (error) {
            console.error('Error parsing body:', error);
            return body;
        }
    }

    generateAccessToken(user) {
        return jwt.sign({ username: user.username }, accessTokenSecret, {
            expiresIn: accessTokenExpiration,
        });
    }

    generateRefreshToken(user) {
        return jwt.sign({ username: user.username }, refreshTokenSecret, {
            expiresIn: refreshTokenExpiration,
        });
    }

    validateCredentials(credentials) {
        try {
            console.log('Validating credentials');
            return credentials && 
                   credentials.username && 
                   credentials.password;
        } catch (error) {
            console.error('Error validating credentials:', error);
            return false;
        }
    }
}

module.exports = UserController;