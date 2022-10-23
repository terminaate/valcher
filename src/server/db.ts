import { Sequelize } from 'sequelize';
import * as path from 'path';

const db = new Sequelize({
	dialect: 'sqlite',
	storage: path.resolve(__dirname, './valcher.db'),
	logging: false
});

db.sync({ alter: true });

export default db;
