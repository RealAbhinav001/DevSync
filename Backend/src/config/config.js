const dotenv = require('dotenv');

dotenv.config();

const isProd = process.env.NODE_ENV === "production"

const config = {
    PORT:process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    CLIENT_URL:process.env.CLIENT_URL,
    SECURE:isProd,
    SAMESITE:isProd?"none":"strict"
}

module.exports=config;