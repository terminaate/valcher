import {ValorantApiCom, WebClient} from "valorant.ts";

class ValorantService {
    private valClient: WebClient.Client;
    private valApiComClient: ValorantApiCom.Client;
    isMultifactor: boolean;

    constructor() {
        this.recreateSessions()
    }

    async recreateSessions() {
        this.valClient = new WebClient.Client({
            expiresIn: {cookie: 300000, token: 300000},
        });
        this.valApiComClient = new ValorantApiCom.Client();
    }

    async login(username: string, password: string) {
        await this.valClient.login(
            username,
            password
        );
        this.isMultifactor = this.valClient.isMultifactor
    }

    async getPlayerUuid(): Promise<string> {
        return (await this.valClient.Player.fetchPlayerRestrictions()).data.Subject;
    }

    async getUserInfo() {
        return (await this.valClient.Player.getUserInfo()).data;
    }

    async getPlayerInventory(puuid?: string) {
        const {data: inventory} = await this.valClient.Player.loadout(puuid ?? (await this.getPlayerUuid()));
        return inventory;
    }

    async getPlayerCard(inventory?: any) {
        const playerInventory = inventory ?? (await this.getPlayerInventory())
        const {data: playerCard} = (
            await this.valApiComClient.PlayerCards.getByUuid(
                playerInventory.Identity.PlayerCardID
            )
        ).data;
        const {displayIcon, smallArt, wideArt, largeArt} = playerCard;
        return {
            displayIcon,
            smallArt,
            wideArt,
            largeArt,
        };
    }

    async getPlayerProgress(puuid?: string) {
        const playerPuuid = puuid ?? (await this.getPlayerUuid());
        const history = (await this.valClient.Player.accountXP(playerPuuid)).data;
        return {
            xp: history.Progress.XP,
            level: history.Progress.Level,
        }
    }

    async getPlayerTitle(inventory?: any): Promise<string | null> {
        const playerInventory = inventory ?? (await this.getPlayerInventory())
        try {
            return (
                await this.valApiComClient.PlayerTitles.getByUuid(
                    playerInventory.Identity.PlayerTitleID
                )
            ).data.data.titleText as string;
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

    async getPlayerShop(puuid?: string, single = true) {
        const userPuuid = puuid ?? (await this.getPlayerUuid());
        const shop = (await this.valClient.Store.getStorefront(userPuuid)).data;
        // if (single) {
        //     console.log(shop)
        // }
        return shop;
    }
}

export default new ValorantService();