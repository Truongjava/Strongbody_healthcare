require('dotenv').config();
let express = require('express');
let Sequelize = require('sequelize');
let session = require('express-session');

// initialize sequelize with session store
let SequelizeStore = require('connect-session-sequelize')(session.Store);

let sequelize;

// ⚡ Dùng DATABASE_URL nếu có
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            dateStrings: true,
            typeCast: true,
            timezone: "+07:00"
        },
        timezone: "+07:00"
    });
} else {
    // fallback cho local development (nếu không dùng DATABASE_URL)
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_CONNECTION || "mysql",
            logging: false,
            dialectOptions: {
                dateStrings: true,
                typeCast: true,
                timezone: "+07:00"
            },
            timezone: "+07:00"
        }
    );
}

let sessionStore = new SequelizeStore({ db: sequelize });

let configSession = (app) => {
    app.use(session({
        key: "express.sid",
        secret: "secret",
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie : { httpOnly: false, secure : false, maxAge : (24 * 60 * 60 * 1000)} // 1 day
    }))
};

sessionStore.sync();

module.exports = { configSession };
