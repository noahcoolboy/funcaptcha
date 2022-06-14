"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fingerprint_1 = require("./fingerprint");
var murmur_1 = require("./murmur");
var crypt_1 = require("./crypt");
var DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
var apiBreakers = {
    default: function (c) { return { px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2), x: c[0], y: c[1] }; },
    method_1: function (c) { return { x: c[1], y: c[0] }; },
    method_2: function (c) { return { x: c[0], y: (c[1] + c[0]) * c[0] }; },
    method_3: function (c) { return { a: c[0], b: c[1] }; },
    method_4: function (c) { return [c[0], c[1]]; },
    method_5: function (c) { return [c[1], c[0]].map(function (v) { return Math.sqrt(v); }); }
};
function tileToLoc(tile) {
    return [
        tile % 3 * 100 + tile % 3 * 3 + 3 + 10 + Math.floor(Math.random() * 80),
        Math.floor(tile / 3) * 100 + Math.floor(tile / 3) * 3 + 3 + 10 + Math.floor(Math.random() * 80)
    ];
}
function constructFormData(data) {
    return Object.keys(data).filter(function (v) { return data[v] !== undefined; }).map(function (k) { return k + "=" + encodeURIComponent(data[k]); }).join("&");
}
function random() {
    return Array(32).fill(0).map(function () { return "0123456789abcdef"[Math.floor(Math.random() * 16)]; }).join("");
}
function getBda(userAgent) {
    var fp = fingerprint_1.default.getFingerprint();
    var fe = fingerprint_1.default.prepareFe(fp);
    var bda = [
        { "key": "fe", "value": fe },
        { "key": "ife_hash", "value": murmur_1.default(fe.join(", "), 38) },
        { "key": "api_type", "value": "js" },
        { "key": "p", "value": 1 },
        { "key": "f", "value": murmur_1.default(fingerprint_1.default.prepareF(fingerprint_1.default), 31) },
        { "key": "n", "value": Buffer.from(Math.round(Date.now() / (1000 - 0)).toString()).toString("base64") },
        { "key": "wh", "value": random() + "|" + random() },
        { "key": "cs", "value": 1 },
        {
            "key": "jsbd", "value": JSON.stringify({
                "HL": 3,
                "NCE": true,
                "DT": "Roblox",
                "NWD": "false",
                "DA": null,
                "DR": null,
                "DMT": 19,
                "DO": null,
                "DOT": 19
            })
        },
        {
            "key": "enhanced_fp",
            "value": [{
                    "key": "webgl_hash_webgl",
                    "value": random()
                }]
        }
    ];
    var time = new Date().getTime() / 1000;
    var key = userAgent + Math.round(time - time % 21600);
    var encrypted = crypt_1.default.encrypt(JSON.stringify(bda), key);
    return Buffer.from(JSON.stringify(encrypted)).toString("base64");
}
exports.default = {
    DEFAULT_USER_AGENT: DEFAULT_USER_AGENT,
    tileToLoc: tileToLoc,
    constructFormData: constructFormData,
    getBda: getBda,
    apiBreakers: apiBreakers
};
