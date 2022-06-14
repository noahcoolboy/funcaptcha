"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge3 = exports.Challenge = void 0;
var http_1 = require("./http");
var util_1 = require("./util");
var crypt_1 = require("./crypt");
var Challenge = /** @class */ (function () {
    function Challenge(data, userAgent) {
        var _this = this;
        this.wave = 0;
        this.data = data;
        this.userAgent = userAgent;
        // Preload images
        this.imgs = data.game_data.customGUI._challenge_imgs.map(function (v) { return __awaiter(_this, void 0, void 0, function () {
            var req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, http_1.default(v, {
                            method: "GET",
                            path: undefined,
                        })];
                    case 1:
                        req = _a.sent();
                        return [2 /*return*/, req.body];
                }
            });
        }); });
    }
    Challenge.prototype.getImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var img, _a, _b, _c, _d, _e, err_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.imgs[this.wave]];
                    case 1:
                        img = _f.sent();
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 5, , 6]);
                        JSON.parse(img.toString()); // Image is encrypted
                        _b = (_a = Buffer).from;
                        _d = (_c = crypt_1.default).decrypt;
                        _e = [img.toString()];
                        return [4 /*yield*/, this.getKey()];
                    case 3: return [4 /*yield*/, _d.apply(_c, _e.concat([_f.sent()]))];
                    case 4:
                        img = _b.apply(_a, [_f.sent(), "base64"]);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _f.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, img];
                }
            });
        });
    };
    Challenge.prototype.getKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.key)
                            return [2 /*return*/, this.key];
                        return [4 /*yield*/, http_1.default(this.data.tokenInfo.surl, {
                                method: "POST",
                                path: "/fc/ekey/",
                                headers: {
                                    "User-Agent": this.userAgent,
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: util_1.default.constructFormData({
                                    session_token: this.data.session_token,
                                    game_token: this.data.challengeID
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        this.key = JSON.parse(response.body.toString()).decryption_key;
                        return [2 /*return*/, this.key];
                }
            });
        });
    };
    return Challenge;
}());
exports.Challenge = Challenge;
var Challenge3 = /** @class */ (function (_super) {
    __extends(Challenge3, _super);
    function Challenge3(data, userAgent) {
        var _this = _super.call(this, data, userAgent) || this;
        _this.answerHistory = [];
        return _this;
    }
    Challenge3.prototype.answer = function (tile) {
        return __awaiter(this, void 0, void 0, function () {
            var pos, encrypted, req, reqData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pos = util_1.default.tileToLoc(tile);
                        this.answerHistory.push(util_1.default.apiBreakers[this.data.game_data.customGUI.api_breaker || "default"](pos));
                        return [4 /*yield*/, crypt_1.default.encrypt(JSON.stringify(this.answerHistory), this.data.session_token)];
                    case 1:
                        encrypted = _a.sent();
                        return [4 /*yield*/, http_1.default(this.data.tokenInfo.surl, {
                                method: "POST",
                                path: "/fc/ca/",
                                headers: {
                                    "User-Agent": this.userAgent,
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: util_1.default.constructFormData({
                                    session_token: this.data.session_token,
                                    game_token: this.data.challengeID,
                                    guess: encrypted
                                })
                            })];
                    case 2:
                        req = _a.sent();
                        reqData = JSON.parse(req.body.toString());
                        this.key = reqData.decryption_key || "";
                        this.wave++;
                        return [2 /*return*/, reqData];
                }
            });
        });
    };
    return Challenge3;
}(Challenge));
exports.Challenge3 = Challenge3;
