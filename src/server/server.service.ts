import {WebClient, ValorantApiCom} from "valorant.ts";
import ServerException from "./exceptions/server.exception";
import DbRepository from "./db.repository";

class ServerService {
    private readonly valClient = new WebClient.Client();
    private readonly valApiComClient = new ValorantApiCom.Client()

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
        console.log((await this.valClient.Player.getUserInfo()).data)
        return {}
    }

}

export default new ServerService()