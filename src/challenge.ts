import request from "./http"
import { TokenInfo } from "./session";
import util from "./util";
import crypt from "./crypt";

interface ChallengeData {
    token: string,
    tokenInfo: TokenInfo,
    session_token: string,
    challengeID: string,
    game_data: {
        gameType: number,
        customGUI: {
            _challenge_imgs: string[],
            api_breaker: string,
        },
        waves: number,
        game_variant: string,
    }
}

interface AnswerResponse {

}

export abstract class Challenge {
    public data: ChallengeData;
    public imgs: Promise<Buffer>[];
    public wave: number = 0;
    protected key: string;
    protected userAgent: string;

    constructor(data: ChallengeData, userAgent: string) {
        this.data = data;
        this.userAgent = userAgent;

        // Preload images
        this.imgs = data.game_data.customGUI._challenge_imgs.map(async v => {
            let req = await request(v, {
                method: "GET",
                path: undefined,
            })
            return req.body
        })
    }

    async getImage(): Promise<Buffer> {
        let img = await this.imgs[this.wave]
        try {
            JSON.parse(img.toString()) // Image is encrypted
            img = Buffer.from(await crypt.decrypt(img.toString(), await this.getKey()), "base64")
        } catch (err) {
            // Image is not encrypted
            // All good!
        }
        return img
    }

    protected async getKey() {
        if (this.key) return this.key;
        let response = await request(this.data.tokenInfo.surl, {
            method: "POST",
            path: "/fc/ekey/",
            headers: {
                "User-Agent": this.userAgent,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: util.constructFormData({
                session_token: this.data.session_token,
                game_token: this.data.challengeID
            })
        })
        this.key = JSON.parse(response.body.toString()).decryption_key
        return this.key
    }

    abstract answer(answer: number): Promise<AnswerResponse>;
}

export class Challenge3 extends Challenge {
    private answerHistory = [];

    constructor(data: ChallengeData, userAgent: string) {
        super(data, userAgent);
    }

    async answer(tile: number): Promise<AnswerResponse> {
        let pos = util.tileToLoc(tile)
        this.answerHistory.push(util.apiBreakers[this.data.game_data.customGUI.api_breaker || "default"](pos))
        let encrypted = await crypt.encrypt(JSON.stringify(this.answerHistory), this.data.session_token)
        let req = await request(this.data.tokenInfo.surl, {
            method: "POST",
            path: "/fc/ca/",
            headers: {
                "User-Agent": this.userAgent,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: util.constructFormData({
                session_token: this.data.session_token,
                game_token: this.data.challengeID,
                guess: encrypted
            })
        })
        let reqData = JSON.parse(req.body.toString())
        this.key = reqData.decryption_key || ""
        this.wave++
        return reqData
    }
}