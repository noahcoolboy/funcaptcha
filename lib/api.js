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
        options = Object.assign({ surl: "https://client-api.arkoselabs.com", data: {} }, options);
        if (!options.headers)
            options.headers = { "User-Agent": util_1.default.DEFAULT_USER_AGENT };
        else if (!Object.keys(options.headers).map(v => v.toLowerCase()).includes("user-agent"))
            options.headers["User-Agent"] = util_1.default.DEFAULT_USER_AGENT;
        options.headers["Accept-Language"] = "en-US,en;q=0.9";
        options.headers["Sec-Fetch-Site"] = "same-origin";
        options.headers["Accept"] = "*/*";
        options.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
        options.headers["sec-fetch-mode"] = "cors";
        if (options.site) {
            options.headers["Origin"] = options.surl;
            options.headers["Referer"] = `${options.surl}/v2/${options.pkey}/1.4.3/enforcement.${util_1.default.random()}.html`;
        }
        let ua = options.headers[Object.keys(options.headers).find(v => v.toLowerCase() == "user-agent")];
        let res = yield (0, http_1.default)(options.surl, {
            method: "POST",
            path: "/fc/gt2/public_key/" + options.pkey,
            body: util_1.default.constructFormData(Object.assign({ bda: util_1.default.getBda(ua, options.pkey, options.surl, options.headers["Referer"], options.location, options.canvasFp), public_key: options.pkey, site: options.site, userbrowser: ua, rnd: Math.random().toString() }, Object.fromEntries(Object.keys(options.data).map(v => ["data[" + v + "]", options.data[v]])))),
            headers: options.headers,
        }, options.proxy);
        return JSON.parse(res.body.toString());
    });
}
exports.getToken = getToken;
