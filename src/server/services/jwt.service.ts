import Config from '../models/config.model';
import * as jwt from 'jsonwebtoken';

class JwtService {
    async init() {
        const refreshSecret = await Config.findOne({
            where: {key: 'JWT_REFRESH_SECRET'},
        });
        if (!refreshSecret) {
            await Config.create({
                key: 'JWT_REFRESH_SECRET',
                value: JwtService.generateSecret(),
            });
        }

        const accessSecret = await Config.findOne({
            where: {key: 'JWT_ACCESS_SECRET'},
        });
        if (!accessSecret) {
            await Config.create({
                key: 'JWT_ACCESS_SECRET',
                value: JwtService.generateSecret(),
            });
        }
    }

    private static generateSecret(length = 24) {
        let result = ' ';
        for (let i = 0; i < length; i++) {
            result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        }
        return result;
    }

    async verify(token: string, isRefresh = false): Promise<{ id: string }> {
        if (!isRefresh) {
            const accessSecret = (
                await Config.findOne({where: {key: 'JWT_ACCESS_SECRET'}})
            ).getDataValue('value');
            return jwt.verify(token, accessSecret) as { id: string };
        } else {
            const refreshSecret = (
                await Config.findOne({where: {key: 'JWT_ACCESS_SECRET'}})
            ).getDataValue('value');
            return jwt.verify(token, refreshSecret) as { id: string };
        }
    }

    async generateToken(payload: { id: string }, isRefresh = false) {
        if (!isRefresh) {
            const accessSecret = (
                await Config.findOne({where: {key: 'JWT_ACCESS_SECRET'}})
            ).getDataValue('value');
            return jwt.sign(payload, accessSecret, {expiresIn: '1d'});
        } else {
            const refreshSecret = (
                await Config.findOne({where: {key: 'JWT_REFRESH_SECRET'}})
            ).getDataValue('value');
            return jwt.sign(payload, refreshSecret, {expiresIn: '30d'});
        }
    }
}

export default new JwtService();
