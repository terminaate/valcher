import { DataTypes } from 'sequelize';
import db from '../db';

const Account = db.define('account', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	puuid: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	username: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	password: {
		allowNull: false,
		type: DataTypes.STRING,
	},
	accessToken: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
	},
	refreshToken: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
	},
});

export default Account;
