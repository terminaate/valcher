import ServerException from '../exceptions/server.exception';
import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';
import JwtService from '../services/jwt.service';
import Account from '../models/user.model';
import ValorantService from "./valorant.service";

// TODO
// remove this lib and move copy LocalRiotClientAPI from this lib;
const {LocalRiotClientAPI} = require('@liamcottle/valorant.js');

// TODO
// add match tracking

// TODO
// add favorite skin for tracking a shop

class ServerService {
    async refresh(refreshToken: string) {
        const {id: userId} = await JwtService.verify(refreshToken, true);
        const account = await Account.findByPk(userId);
        if (!account) {
            throw ServerException.WrongAuthData();
        }

        const id = account.getDataValue('id');
        const newAccessToken = await JwtService.generateToken({id});
        const newRefreshToken = await JwtService.generateToken({id}, true);
        const payload = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
        await account.update(payload);
        return payload;
    }

    async auth(accessToken?: string, username?: string, password?: string): Promise<{
        puuid: string;
        isMultifactor?: boolean;
        accessToken?: string;
        refreshToken?: string;
    }> {
        await ValorantService.recreateSessions();
        const authData: { username: string; password: string } = {} as {
            username: string;
            password: string;
        };

        if (accessToken) {
            const {id: userId} = await JwtService.verify(accessToken);
            const account = await Account.findByPk(userId);
            if (!account) {
                throw ServerException.WrongAuthData();
            }
            await ValorantService.login(
                account.getDataValue('username'),
                account.getDataValue('password')
            );
            authData.username = account.getDataValue('username');
            authData.password = account.getDataValue('password');
        } else if (username && password) {
            await ValorantService.login(username, password);
            authData.username = username;
            authData.password = password;
        } else {
            throw ServerException.WrongAuthData();
        }

        // TODO
        // add multifactor auth (add verify method)
        if (ValorantService.isMultifactor) {
            return {puuid: null, isMultifactor: ValorantService.isMultifactor};
        }

        const userPuuid = await ValorantService.getPlayerUuid();

        const userInfo = await ValorantService.getUserInfo();
        if (userInfo.errorCode === 400) {
            throw ServerException.WrongAuthData();
        }

        let candidate = await Account.findOne({where: {puuid: userPuuid}});
        if (!candidate) {
            const newAccount = Account.build({puuid: userPuuid});
            const accessToken = await JwtService.generateToken({
                id: newAccount.getDataValue('id'),
            });
            const refreshToken = await JwtService.generateToken(
                {id: newAccount.getDataValue('id')},
                true
            );
            newAccount.set({
                accessToken,
                refreshToken,
                username: authData.username,
                password: authData.password,
            });
            await newAccount.save();
            candidate = newAccount;
        }
        return {
            puuid: userPuuid,
            accessToken: candidate.getDataValue('accessToken'),
            refreshToken: candidate.getDataValue('refreshToken'),
        };
    }

    async getUserInfo() {
        const userInfo = await ValorantService.getUserInfo();
        const puuid = await ValorantService.getPlayerUuid();
        const inventory = await ValorantService.getPlayerInventory(puuid);
        const playerCardImages = await ValorantService.getPlayerCard(inventory);
        const playerProgress = await ValorantService.getPlayerProgress(puuid);
        const playerTitle = await ValorantService.getPlayerTitle();

        return {
            puuid,
            username: userInfo.acct.game_name,
            tag: userInfo.acct.tag_line,
            playerCard: playerCardImages,
            playerTitle: playerTitle,
            playerProgress
        };
    }

    async getBackgroundImage() {
        // TODO
        // complete of editing and getting background image
        const staticPath = "../static/";
        const staticFiles = await fs.readdir(path.resolve(__dirname, staticPath));
        // console.log(staticFiles)
        const file: string = staticFiles.find((u) => u.startsWith('background'));
        // if (staticFiles.find(u => u.startsWith("custom_background"))) {
        //     file = staticFiles.find(u => u.startsWith("custom_background"))
        // }
        const filePath = path.resolve(__dirname, staticPath + file);
        const fileBuffer = await fs.readFile(filePath);
        return {image: fileBuffer, type: file.split('.')[1]};
    }

    async launch() {
        //TODO
        // add account switcher and move this to valorant service
        await LocalRiotClientAPI.launch(
            null,
            '51835',
            '127.0.0.1',
            'valorant',
            'live'
        );
    }

    async getNews() {
        const {data: news} = await axios.get('https://playvalorant.com/page-data/en-us/news/page-data.json');
        return news.result.data.allContentstackNews.nodes[0].featured_news
            .selectedArticles;
    }

    async getShop(single: boolean) {
        const shop = ValorantService.getPlayerShop(undefined, single);
        console.log(shop)
        return {}
    }

    // async patchBackgroundImage(newImage: string) {
    //     const file = (await fs.readdir(path.resolve(__dirname, "./static"))).find(u => u.startsWith("custom_background"))
    //     if (file) {
    //         await fs.rm(path.resolve(__dirname, "./static/" + file))
    //     }
    //
    //     console.log("Triggered")
    //
    //     if (!newImage) {
    //         // let oldImage: {image: Buffer, type: string};
    //         try {
    //             if (file) {
    //                 await fs.rm(path.resolve(__dirname, "./static/" + file))
    //             }
    //         } catch(e) {
    //             console.log(e)
    //         }
    //         return this.getBackgroundImage();
    //     }
    //
    //     const fileExt = newImage.substring("data:image/".length, newImage.indexOf(";base64"))
    //
    //     const matches = newImage.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
    //     let buffer = null
    //
    //     if (matches.length !== 3) {
    //         return new Error('Invalid base64 image');
    //     }
    //
    //     buffer = new Buffer(matches[2], 'base64');
    //
    //     await fs.writeFile(path.resolve(__dirname, "./static/custom_background." + fileExt), buffer)
    //     return this.getBackgroundImage();
    // }
}

// TODO
// Add file of logs of exceptions

export default new ServerService();
