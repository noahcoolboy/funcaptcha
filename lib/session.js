"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const challenge_1 = require("./challenge");
const http_1 = require("./http");
const util_1 = require("./util");
let parseToken = (token) => Object.fromEntries(token
    .split("|")
    .map((v) => v.split("=").map((v) => decodeURIComponent(v))));
class Session {
    constructor(token, sessionOptions) {
        if (typeof token === "string") {
            this.token = token;
        }
        else {
            this.token = token.token;
        }
        if (!this.token.startsWith("token="))
            this.token = "token=" + this.token;
        this.tokenInfo = parseToken(this.token);
        this.userAgent = (sessionOptions === null || sessionOptions === void 0 ? void 0 : sessionOptions.userAgent) || util_1.default.DEFAULT_USER_AGENT;
        this.proxy = sessionOptions === null || sessionOptions === void 0 ? void 0 : sessionOptions.proxy;
    }
    async getChallenge() {
        let res = await (0, http_1.default)(this.tokenInfo.surl, {
            path: "/fc/gfct/",
            method: "POST",
            body: util_1.default.constructFormData({
                sid: this.tokenInfo.r,
                render_type: "canvas",
                token: this.tokenInfo.token,
                analytics_tier: this.tokenInfo.at,
                "data%5Bstatus%5D": "init",
                lang: "en",
            }),
            headers: {
                "User-Agent": this.userAgent,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }, this.proxy);
        let data = JSON.parse(res.body.toString());
        data.token = this.token;
        data.tokenInfo = this.tokenInfo;
        if (data.game_data.gameType == 1) {
            return new challenge_1.Challenge1(data, {
                proxy: this.proxy,
                userAgent: this.userAgent,
            });
        }
        else if (data.game_data.gameType == 3) {
            return new challenge_1.Challenge3(data, {
                proxy: this.proxy,
                userAgent: this.userAgent,
            });
        }
        else {
            throw new Error("Unsupported game type: " + data.game_data.gameType);
        }
        //return res.body.toString()
    }
    getEmbedUrl() {
        return `${this.tokenInfo.surl}/fc/gc/?${util_1.default.constructFormData(this.tokenInfo)}`;
    }
}
exports.Session = Session;
