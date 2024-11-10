require("dotenv").config();

module.exports = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || "ignacio",
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "cantando",
  accessTokenExpiration: "2m", // 15 minutos //15m
  refreshTokenExpiration: "7d", // 7 dias
};
