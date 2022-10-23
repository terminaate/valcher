import { ValorantApiCom, WebClient } from 'valorant.ts';
import ServerException from '../exceptions/server.exception';
import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';
import { exec } from 'child_process';
import JwtService from '../services/jwt.service';
import Account from '../models/user.model';

const { LocalRiotClientAPI } = require('@liamcottle/valorant.js');

// TODO
// add match tracking

// TODO
// add favorite skin for tracking a shop

class ServerService {
	private valClient: WebClient.Client;
	private valApiComClient: ValorantApiCom.Client;

	async refresh(refreshToken: string) {
		const { id: userId } = await JwtService.verify(refreshToken, true);
		const account = await Account.findByPk(userId);
		if (!account) {
			throw ServerException.WrongAuthData();
		}

		const id = account.getDataValue('id');
		const newAccessToken = await JwtService.generateToken({ id });
		const newRefreshToken = await JwtService.generateToken({ id }, true);
		const payload = {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		};
		await account.update(payload);
		return payload;
	}

	async auth(accessToken?: string, username?: string, password?: string) {
		this.valClient = new WebClient.Client({
			expiresIn: { cookie: 300000, token: 300000 },
		});
		this.valApiComClient = new ValorantApiCom.Client();
		const authData: { username: string; password: string } = {} as {
			username: string;
			password: string;
		};

		if (accessToken) {
			const { id: userId } = await JwtService.verify(accessToken);
			const account = await Account.findByPk(userId);
			if (!account) {
				throw ServerException.WrongAuthData();
			}
			await this.valClient.login(
				account.getDataValue('username'),
				account.getDataValue('password')
			);
			authData.username = account.getDataValue('username');
			authData.password = account.getDataValue('password');
		} else if (username && password) {
			await this.valClient.login(username, password);
			authData.username = username;
			authData.password = password;
		} else {
			throw ServerException.WrongAuthData();
		}

		// TODO
		// add multifactor auth (add verify method)
		if (this.valClient.isMultifactor) {
			return { puuid: null, isMultifactor: this.valClient.isMultifactor };
		}

		const { Player: PlayerService } = this.valClient;
		const userPuuid = (await PlayerService.fetchPlayerRestrictions()).data
			.Subject;

		const userInfo = await PlayerService.getUserInfo();
		if (userInfo.data.errorCode === 400) {
			throw ServerException.WrongAuthData();
		}

		let candidate = await Account.findOne({ where: { puuid: userPuuid } });
		if (!candidate) {
			const newAccount = Account.build({ puuid: userPuuid });
			const accessToken = await JwtService.generateToken({
				id: newAccount.getDataValue('id'),
			});
			const refreshToken = await JwtService.generateToken(
				{ id: newAccount.getDataValue('id') },
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

		// console.log(this.valClient.toJSON())
		return {
			puuid: userPuuid,
			accessToken: candidate.getDataValue('accessToken'),
			refreshToken: candidate.getDataValue('refreshToken'),
		};
		// TESTS OF API
		// console.log(await this.valApiComClient.Weapons.getByUuid(weaponId))
		// const {Progress: accountXp, History: accountMatches} = (await PlayerService.accountXP(puuid)).data
		// SERVICEURL_STORE: 'https://pd.eu.a.pvp.net',
		// console.log((await this.valClient.Store.getWallet(puuid)).data)
		// console.log((await PlayerService.loadout(puuid)).data)
	}

	async getUserInfo() {
		const { data } = await this.valClient.Player.getUserInfo();
		const puuid = (await this.valClient.Player.fetchPlayerRestrictions()).data.Subject;
		const { data: inventory } = await this.valClient.Player.loadout(puuid);
		const { data: playerCard } = (
			await this.valApiComClient.PlayerCards.getByUuid(
				inventory.Identity.PlayerCardID
			)
		).data;
		const { displayIcon, smallArt, wideArt, largeArt } = playerCard;
		const playerCardImages = {
			displayIcon,
			smallArt,
			wideArt,
			largeArt,
		};
		let playerTitle = null;
		const history = (await this.valClient.Player.accountXP(puuid)).data;
		// console.log(puuid)
		// const mmr = (await this.valApiComClient.CompetitiveTiers.getByUuid(puuid))
		//
		// console.log(mmr);

		try {
			playerTitle = (
				await this.valApiComClient.PlayerTitles.getByUuid(
					inventory.Identity.PlayerTitleID
				)
			).data.data.titleText as string;
		} catch (e) {
			console.log(e.message);
		}

		return {
			puuid,
			username: data.acct.game_name,
			tag: data.acct.tag_line,
			playerCard: playerCardImages,
			playerTitle: playerTitle,
			playerProgress: {
				xp: history.Progress.XP,
				level: history.Progress.Level,
			},
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
		return { image: fileBuffer, type: file.split('.')[1] };
	}

	async launch() {
		// const puuid = (await this.valClient.Player.fetchPlayerRestrictions()).data.Subject;
		// console.log(await this.valClient.App.fetchConfig())
		// console.log("hi")
		// const client = new LocalRiotClientAPI('127.0.0.1', '51835', 'LKloginking', 'Qawsed7810.1');
		// (client.login("terminaate", "LgtBzwht22", true))?.data
		// console.log(await client.login("LKloginking", "Qawsed7810.1", true))
		// const client = LocalRiotClientAPI.initFromLockFile()
		// Riot Client:20188:51835:QhhLsW3fmt8sRSVvdTiT2A:https
		// console.log(await client.getFriends())
		// console.log(await client.login("terminaate", "LgtBzwht22", true))

		//TODO
		// add account switcher
		await LocalRiotClientAPI.launch(
			null,
			'51835',
			'127.0.0.1',
			'valorant',
			'live'
		);
	}

	async getNews() {
		const { data: news } = await axios.get('https://playvalorant.com/page-data/en-us/news/page-data.json');
		return news.result.data.allContentstackNews.nodes[0].featured_news
			.selectedArticles;
	}

	async getShop(single: boolean) {
		const puuid = (await this.valClient.Player.fetchPlayerRestrictions()).data.Subject;
		const shop = (await this.valClient.Store.getStorefront(puuid)).data;
		if (single) {


			// console.log(shop.SkinsPanelLayout.SingleItemOffers[0]);

			console.log(shop)
			// console.log(await this.valApiComClient.Bundles.getByUuid(shop.FeaturedBundle.Bundle.Items[0].CurrencyID)); // набор
		}
		return {}
	}

	isRunning(query: string, cb: (status: boolean) => void) {
		const platform = process.platform;
		let cmd = '';
		switch (platform) {
			case 'win32':
				cmd = `tasklist`;
				break;
			case 'darwin':
				cmd = `ps -ax | grep ${query}`;
				break;
			case 'linux':
				cmd = `ps -A`;
				break;
			default:
				break;
		}
		exec(cmd, (err, stdout, stderr) => {
			cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
		});
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