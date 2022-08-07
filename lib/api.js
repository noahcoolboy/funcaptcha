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
exports.getToken = void 0;
const http_1 = require("./http");
const util_1 = require("./util");
function getToken(options) {
    return __awaiter(this, void 0, void 0, function* () {
        options = Object.assign({ surl: "https://client-api.arkoselabs.com", data: {}, headers: {
                "User-Agent": util_1.default.DEFAULT_USER_AGENT,
                //"Content-Type": "application/x-www-form-urlencoded"
            } }, options);
        let res = yield (0, http_1.default)(options.surl, {
            method: "POST",
            path: "/fc/gt2/public_key/?public_key=" + options.pkey,
            body: util_1.default.constructFormData(Object.assign({ public_key: options.pkey, site: options.site, userbrowser: options.headers["User-Agent"], rnd: Math.random().toString(), bda: util_1.default.getBda(options.headers["User-Agent"]) }, Object.fromEntries(Object.keys(options.data).map(v => ["data[" + v + "]", options.data[v]])))),
            headers: options.headers,
        }, options.proxy);
        return JSON.parse(res.body.toString());
    });
}
exports.getToken = getToken;
