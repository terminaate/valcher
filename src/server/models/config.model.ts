import { DataTypes } from 'sequelize';
import db from '../db';

const Config = db.define('config', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	key: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	value: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Config;
