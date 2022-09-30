import {ValorantApiCom, WebClient} from "valorant.ts";
import ServerException from "./exceptions/server.exception";
import DbRepository from "./db.repository";

class ServerService {
    private readonly valClient = new WebClient.Client({expiresIn: {cookie: 300000, token: 300000}});
    private readonly valApiComClient = new ValorantApiCom.Client();

    async auth(username: string, password: string) {
        await this.valClient.login(username, password);
        const {Player: PlayerService} = this.valClient;

        const userInfo = await PlayerService.getUserInfo();
        if (userInfo.data.errorCode === 400) {
            throw ServerException.WrongAuthData();
        }
        const puuid = (await PlayerService.fetchPlayerRestrictions()).data.Subject;
        DbRepository.addUser(puuid, username, password)
        return puuid
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
        const {titleText: playerTitle} = (await this.valApiComClient.PlayerTitles.getByUuid(inventory.Identity.PlayerTitleID)).data.data;

        return {puuid, username: data.acct.game_name, tag: data.acct.tag_line, playerCard: playerCardImages, playerTitle}
    }
}

export default new ServerService()