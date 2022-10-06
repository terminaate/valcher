import { Sequelize } from 'sequelize';
import * as path from 'path';

const db = new Sequelize({
	dialect: 'sqlite',
	storage: path.resolve(__dirname, './valcher.db'),
	logging: process.env.NODE_ENV === "dev"
});

db.sync({ alter: true });

export default db;
