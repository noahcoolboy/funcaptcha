import { GetTokenResult } from "./api";
import { Challenge, Challenge3 } from "./challenge";
import http from "./http";
import util from "./util";

export interface TokenInfo {
    token: string,
    r: string,
    metabgclr: string,
    mainbgclr: string,
    guitextcolor: string,
    metaiconclr: string,
    meta_height: string,
    meta_width: string,
    meta: string,
    pk: string,
    dc: string,
    at: string,
    cdn_url: string,
    lurl: string,
    surl: string,
    smurl: string,
}

let parseToken = (token: string): TokenInfo => Object.fromEntries(token.split("|").map(v => v.split("=").map(v => decodeURIComponent(v))))

class Session {
    public token: string;
    public tokenInfo: TokenInfo;
    private userAgent: string;

    constructor(token: string | GetTokenResult, userAgent?: string) {
        if(typeof token === "string") {
            this.token = token
        } else {
            this.token = token.token
        }
        if(!this.token.startsWith("token="))
            this.token = "token=" + this.token
        
        this.tokenInfo = parseToken(this.token)
        this.userAgent = userAgent || util.DEFAULT_USER_AGENT
    }

    async getChallenge(): Promise<Challenge> {
        let res = await http(this.tokenInfo.surl, {
            path: "/fc/gfct/",
            method: "POST",
            body: util.constructFormData({
                sid: this.tokenInfo.r,
                render_type: "canvas",
                token: this.tokenInfo.token,
                analytics_tier: this.tokenInfo.at,
                "data%5Bstatus%5D": "init",
                lang: ""
            }),
            headers: {
                "User-Agent": this.userAgent,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        let data = JSON.parse(res.body.toString())
        data.token = this.token
        data.tokenInfo = this.tokenInfo

        if(data.game_data.gameType == 3) {
            return new Challenge3(data, this.userAgent)
        } else {
            throw new Error("Unknown game type")
        }
        //return res.body.toString()
    }
}

export default Session