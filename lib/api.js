"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const http_1 = require("./http");
const util_1 = require("./util");
async function getToken(options) {
    options = {
        surl: "https://client-api.arkoselabs.com",
        data: {},
        headers: {
            "User-Agent": util_1.default.DEFAULT_USER_AGENT,
            //"Content-Type": "application/x-www-form-urlencoded"
        },
        ...options,
    };
    let res = await (0, http_1.default)(options.surl, {
        method: "POST",
        path: "/fc/gt2/public_key/?public_key=" + options.pkey,
        body: util_1.default.constructFormData({
            public_key: options.pkey,
            site: options.site,
            userbrowser: options.headers["User-Agent"],
            rnd: Math.random().toString(),
            bda: util_1.default.getBda(options.headers["User-Agent"]),
            ...Object.fromEntries(Object.keys(options.data).map(v => ["data[" + v + "]", options.data[v]]))
        }),
        headers: options.headers,
    }, options.proxy);
    return JSON.parse(res.body.toString());
}
exports.getToken = getToken;
