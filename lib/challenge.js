"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge3 = exports.Challenge1 = exports.Challenge = void 0;
const http_1 = require("./http");
const util_1 = require("./util");
const crypt_1 = require("./crypt");
const console_1 = require("console");
class Challenge {
    constructor(data, challengeOptions) {
        this.wave = 0;
        this.data = data;
        this.userAgent = challengeOptions.userAgent;
        this.proxy = challengeOptions.proxy;
        // Preload images
        this.imgs = data.game_data.customGUI._challenge_imgs.map((v) => __awaiter(this, void 0, void 0, function* () {
            let req = yield (0, http_1.default)(v, {
                method: "GET",
                path: undefined,
            });
            return req.body;
        }));
        if (data.game_data.customGUI.encrypted_mode) {
            // Preload decryption key
            this.getKey();
        }
    }
    getImage() {
        return __awaiter(this, void 0, void 0, function* () {
            let img = yield this.imgs[this.wave];
            try {
                JSON.parse(img.toString()); // Image is encrypted
                img = Buffer.from(yield crypt_1.default.decrypt(img.toString(), yield this.getKey()), "base64");
            }
            catch (err) {
                // Image is not encrypted
                // All good!
            }
            return img;
        });
    }
    getKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.key)
                return this.key;
            let response = yield (0, http_1.default)(this.data.tokenInfo.surl, {
                method: "POST",
                path: "/fc/ekey/",
                headers: {
                    "User-Agent": this.userAgent,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: util_1.default.constructFormData({
                    session_token: this.data.session_token,
                    game_token: this.data.challengeID,
                }),
            }, this.proxy);
            this.key = JSON.parse(response.body.toString()).decryption_key;
            return this.key;
        });
    }
}
exports.Challenge = Challenge;
class Challenge1 extends Challenge {
    constructor(data, challengeOptions) {
        super(data, challengeOptions);
        this.answerHistory = [];
        // But WHY?!
        let clr = data.game_data.customGUI._guiFontColr;
        this.increment = parseInt(clr ? clr.replace("#", "").substring(3) : "28", 16);
        this.increment = this.increment > 113 ? this.increment / 10 : this.increment;
    }
    round(num) {
        return (Math.round(num * 10) / 10).toFixed(2);
    }
    answer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (answer >= 0 && answer <= Math.round(360 / 51.4) - 1)
                this.answerHistory.push(this.round(answer * this.increment));
            else if (answer < 0)
                this.answerHistory.push(this.round(360 + answer % 360));
            else
                this.answerHistory.push(this.round(answer % 360));
            let encrypted = yield crypt_1.default.encrypt(this.answerHistory.toString(), this.data.session_token);
            let req = yield (0, http_1.default)(this.data.tokenInfo.surl, {
                method: "POST",
                path: "/fc/ca/",
                headers: {
                    "User-Agent": this.userAgent,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: util_1.default.constructFormData({
                    session_token: this.data.session_token,
                    game_token: this.data.challengeID,
                    guess: encrypted,
                }),
            }, this.proxy);
            let reqData = JSON.parse(req.body.toString());
            this.key = reqData.decryption_key || "";
            this.wave++;
            return reqData;
        });
    }
}
exports.Challenge1 = Challenge1;
class Challenge3 extends Challenge {
    constructor(data, challengeOptions) {
        super(data, challengeOptions);
        this.answerHistory = [];
    }
    answer(tile) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, console_1.assert)(tile >= 0 && tile <= 5, "Tile must be between 0 and 5");
            let pos = util_1.default.tileToLoc(tile);
            this.answerHistory.push(util_1.default.apiBreakers[this.data.game_data.customGUI.api_breaker || "default"](pos));
            let encrypted = yield crypt_1.default.encrypt(JSON.stringify(this.answerHistory), this.data.session_token);
            let req = yield (0, http_1.default)(this.data.tokenInfo.surl, {
                method: "POST",
                path: "/fc/ca/",
                headers: {
                    "User-Agent": this.userAgent,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: util_1.default.constructFormData({
                    session_token: this.data.session_token,
                    game_token: this.data.challengeID,
                    guess: encrypted,
                }),
            }, this.proxy);
            let reqData = JSON.parse(req.body.toString());
            this.key = reqData.decryption_key || "";
            this.wave++;
            return reqData;
        });
    }
}
exports.Challenge3 = Challenge3;
