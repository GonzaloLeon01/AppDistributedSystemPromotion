const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
class UserController {
    async login(req, res) {
        try {
            const credentials = req.body;
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
            res.status(500).json({ error: 'Falla en el servidor' });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
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
                    res.status(500).json({ error: 'Falla en el servidor' });
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Falla en el servidor' });
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
        return credentials.username && credentials.password;
    }
}
module.exports = UserController;