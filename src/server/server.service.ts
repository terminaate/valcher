import { ValorantApiCom, WebClient } from 'valorant.ts';
import ServerException from './exceptions/server.exception';
import DbRepository from './db.repository';
import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';

const { LocalRiotClientAPI } = require('@liamcottle/valorant.js');

class ServerService {
	private valClient: WebClient.Client;
	private valApiComClient: ValorantApiCom.Client;

	async auth(puuid?, username?: string, password?: string) {
		this.valClient = new WebClient.Client({
			expiresIn: { cookie: 300000, token: 300000 },
		});
		this.valApiComClient = new ValorantApiCom.Client();

		if (puuid) {
			const user = DbRepository.db.find((u) => u.puuid === puuid);
			if (!user) {
				throw ServerException.WrongAuthData();
			}
			await this.valClient.login(user.username, user.password);
		} else if (username && password) {
			await this.valClient.login(username, password);
		} else {
			console.log('Has no puuid and no username, password');
			throw ServerException.WrongAuthData();
		}

		// TODO
		// add multifactor auth
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

		if (!DbRepository.db.find((u) => u.puuid === userPuuid)) {
			DbRepository.addUser(userPuuid, username, password);
		}

		// console.log(this.valClient.toJSON())
		return { puuid: userPuuid };
		// TESTS OF API
		// const weaponId = (await this.valClient.Store.getStorefront(puuid)).data.BonusStore.BonusStoreOffers[0].BonusOfferID
		// console.log(await this.valApiComClient.Weapons.getByUuid(weaponId))
		// const {Progress: accountXp, History: accountMatches} = (await PlayerService.accountXP(puuid)).data
		// SERVICEURL_STORE: 'https://pd.eu.a.pvp.net',
		// console.log((await this.valClient.Store.getWallet(puuid)).data)
		// console.log((await PlayerService.loadout(puuid)).data)
	}

	async getUserInfo() {
		const { data } = await this.valClient.Player.getUserInfo();
		const puuid = (await this.valClient.Player.fetchPlayerRestrictions()).data
			.Subject;
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

		// Todo
		// add Mmr

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
				level: history.Progress.Level
			}
		};
	}

	async getBackgroundImage() {
		const staticFiles = await fs.readdir(path.resolve(__dirname, './static'));
		// console.log(staticFiles)
		const file: string = staticFiles.find((u) => u.startsWith('background'));
		// if (staticFiles.find(u => u.startsWith("custom_background"))) {
		//     file = staticFiles.find(u => u.startsWith("custom_background"))
		// }
		const filePath = path.resolve(__dirname, './static/' + file);
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
		const { data: news } = await axios.get(
			'https://playvalorant.com/page-data/en-us/news/page-data.json'
		);
		return news.result.data.allContentstackNews.nodes[0].featured_news
			.selectedArticles;
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
// Add logs of exceptions

export default new ServerService();
