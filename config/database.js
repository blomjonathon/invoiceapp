const { Sequelize } = require('sequelize');

// Set database URL if not in environment
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://invoice_user:47dLkMdbpVtq2CF2XUSrisT4TXddFIm7@dpg-d0d6843uibrs73bq7fl0-a/invoice_db_jjj5';
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize; 