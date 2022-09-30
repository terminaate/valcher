import {ValorantApiCom, WebClient} from "valorant.ts";
import ServerException from "./exceptions/server.exception";
import DbRepository from "./db.repository";

class ServerService {
    private valClient: WebClient.Client;
    private valApiComClient: ValorantApiCom.Client;

    async auth(puuid?, username?: string, password?: string) {
        this.valClient = new WebClient.Client({expiresIn: {cookie: 300000, token: 300000}});
        this.valApiComClient = new ValorantApiCom.Client();

        if (puuid) {
            const user = DbRepository.db.find(u => u.puuid === puuid);
            if (!user) {
                throw ServerException.WrongAuthData();
            }
            await this.valClient.login(user.username, user.password)
        } else if (username && password) {
            await this.valClient.login(username, password);
        } else {
            throw ServerException.WrongAuthData();
        }

        // TODO
        // add multifactor auth
        if (this.valClient.isMultifactor) {
            return {puuid: null, isMultifactor: this.valClient.isMultifactor}
        }

        const {Player: PlayerService} = this.valClient;
        const userPuuid = (await PlayerService.fetchPlayerRestrictions()).data.Subject;

        if (!DbRepository.db.find(u => u.puuid === userPuuid)) {
            DbRepository.addUser(userPuuid, username, password)
        }

        const userInfo = await PlayerService.getUserInfo();
        if (userInfo.data.errorCode === 400) {
            throw ServerException.WrongAuthData();
        }
        return {puuid: userPuuid}
        // TESTS OF API
        // const weaponId = (await this.valClient.Store.getStorefront(puuid)).data.BonusStore.BonusStoreOffers[0].BonusOfferID
        // console.log(await this.valApiComClient.Weapons.getByUuid(weaponId))
        // const {Progress: accountXp, History: accountMatches} = (await PlayerService.accountXP(puuid)).data
        // SERVICEURL_STORE: 'https://pd.eu.a.pvp.net',
        // console.log((await this.valClient.Store.getWallet(puuid)).data)
        // console.log((await PlayerService.loadout(puuid)).data)
    }

    async getUserInfo() {
        const {data} = await this.valClient.Player.getUserInfo();
        const puuid = (await this.valClient.Player.fetchPlayerRestrictions()).data.Subject;
        const {data: inventory} = await this.valClient.Player.loadout(puuid);
        const {data: playerCard} = (await this.valApiComClient.PlayerCards.getByUuid(inventory.Identity.PlayerCardID)).data
        const {displayIcon, smallArt, wideArt, largeArt} = playerCard;
        const playerCardImages = {
            displayIcon,
            smallArt,
            wideArt,
            largeArt
        }
        // const {titleText: playerTitle} = (await this.valApiComClient.PlayerTitles.getByUuid(inventory.Identity.PlayerTitleID)).data.data;
        console.log(inventory.Identity)

        return {
            puuid,
            username: data.acct.game_name,
            tag: data.acct.tag_line,
            playerCard: playerCardImages,
            playerTitle: ""
        }
    }
}

export default new ServerService()