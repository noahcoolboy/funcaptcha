"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fingerprint_1 = require("./fingerprint");
const murmur_1 = require("./murmur");
const crypt_1 = require("./crypt");
const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";
let apiBreakers = {
    v1: {
        3: {
            default: (c) => ({ px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2), x: c[0], y: c[1] }),
            method_1: (c) => ({ x: c[1], y: c[0] }),
            method_2: (c) => ({ x: c[0], y: (c[1] + c[0]) * c[0] }),
            method_3: (c) => ({ a: c[0], b: c[1] }),
            method_4: (c) => [c[0], c[1]],
            method_5: (c) => [c[1], c[0]].map((v) => Math.sqrt(v)),
        },
        4: {
            default: (c) => c
        }
    },
    v2: {
        3: {
            value: {
                alpha: (c) => ({ x: c[0], y: (c[1] + c[0]) * c[0], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                beta: (c) => ({ x: c[1], y: c[0], py: (c[0] / 300).toFixed(2), px: (c[1] / 200).toFixed(2) }),
                gamma: (c) => ({ x: c[1] + 1, y: -c[0], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                delta: (c) => ({ x: c[1] + 0.25, y: c[0] + 0.5, px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                epsilon: (c) => ({ x: c[0] * 0.5, y: c[1] * 5, px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                zeta: (c) => ({ x: c[0] + 1, y: c[1] + 2, px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                method_1: (c) => ({ x: c[0], y: c[1], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                method_2: (c) => ({ x: c[1], y: (c[1] + c[0]) * c[0], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                method_3: (c) => ({ x: Math.sqrt(c[0]), y: Math.sqrt(c[1]), px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
            },
            key: {
                alpha: (c) => [c[1], (c[0] / 300).toFixed(2), (c[1] / 200).toFixed(2), c[0]],
                beta: (c) => JSON.stringify({ x: c[0], y: c[1], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                gamma: (c) => [c[0], c[1], (c[0] / 300).toFixed(2), (c[1] / 200).toFixed(2)].join(" "),
                delta: (c) => [1, c[0], 2, c[1], 3, (c[0] / 300).toFixed(2), 4, (c[1] / 200).toFixed(2)],
                epsilon: (c) => ({ answer: { x: c[0], y: c[1], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) } }),
                zeta: (c) => [c[0], [c[1], [(c[0] / 300).toFixed(2), [(c[1] / 200).toFixed(2)]]]],
                method_1: (c) => ({ a: c[0], b: c[1], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                method_2: (c) => [c[0], c[1]],
                method_3: (c) => [c[1], c[0]],
            }
        },
        4: {
            value: {
                // @ts-ignore
                alpha: (c) => ({ index: String(c.index) + 1 - 2 }),
                beta: (c) => ({ index: -c.index }),
                gamma: (c) => ({ index: 3 * (3 - c.index) }),
                delta: (c) => ({ index: 7 * c.index }),
                epsilon: (c) => ({ index: 2 * c.index }),
                zeta: (c) => ({ index: c.index ? 100 / c.index : c.index }),
                va: (c) => ({ index: c.index + 3 }),
                vb: (c) => ({ index: -c.index }),
                vc: (c) => ({ index: 10 - c.index }),
                vd: (c) => ({ index: 3 * c.index }),
            },
            key: {
                alpha: (c) => [Math.round(100 * Math.random()), c.index, Math.round(100 * Math.random())],
                beta: (c) => ({ size: 50 - c.index, id: c.index, limit: 10 * c.index, req_timestamp: Date.now() }),
                gamma: (c) => c.index,
                delta: (c) => ({ index: c.index }),
                epsilon: (c) => {
                    const arr = [];
                    const len = Math.round(5 * Math.random()) + 1;
                    const rand = Math.round(Math.random() * len);
                    for (let i = 0; i < len; i++) {
                        arr.push(i === rand ? c.index : Math.round(10 * Math.random()));
                    }
                    arr.push(rand);
                    return arr;
                },
                zeta: (c) => Array(Math.round(5 * Math.random()) + 1).concat(c.index),
                ka: (c) => c.index,
                kb: (c) => [c.index],
                kc: (c) => ({ guess: c.index }),
            }
        }
    }
};
function tileToLoc(tile) {
    return [
        (tile % 3) * 100 +
            (tile % 3) * 3 +
            3 +
            10 +
            Math.floor(Math.random() * 80),
        Math.floor(tile / 3) * 100 +
            Math.floor(tile / 3) * 3 +
            3 +
            10 +
            Math.floor(Math.random() * 80),
    ];
}
function constructFormData(data) {
    return Object.keys(data)
        .filter((v) => data[v] !== undefined)
        .map((k) => `${k}=${encodeURIComponent(data[k])}`)
        .join("&");
}
function random() {
    return Array(32)
        .fill(0)
        .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
        .join("");
}
function getTimestamp() {
    const time = (new Date()).getTime().toString();
    const value = `${time.substring(0, 7)}00${time.substring(7, 13)}`;
    return { cookie: `timestamp=${value};path=/;secure;samesite=none`, value };
}
function getBda(userAgent, opts) {
    let fp = fingerprint_1.default.getFingerprint();
    let fe = fingerprint_1.default.prepareFe(fp);
    let bda = [
        { key: "api_type", value: "js" },
        { key: "p", value: 1 },
        { key: "f", value: (0, murmur_1.default)(fingerprint_1.default.prepareF(fingerprint_1.default), 31) },
        {
            key: "n",
            value: Buffer.from(Math.round(Date.now() / (1000 - 0)).toString()).toString("base64"),
        },
        { key: "wh", value: `${random()}|${random()}` },
        {
            "key": "enhanced_fp",
            "value": fingerprint_1.default.getEnhancedFingerprint(fp, userAgent, opts)
        },
        { key: "fe", value: fe },
        { key: "ife_hash", value: (0, murmur_1.default)(fe.join(", "), 38) },
        { key: "cs", value: 1 },
        {
            key: "jsbd",
            value: JSON.stringify({
                HL: 4,
                DT: "",
                NWD: "false",
                DOTO: 1,
                DMTO: 1,
            }),
        },
    ];
    let time = new Date().getTime() / 1000;
    let key = userAgent + Math.round(time - (time % 21600));
    let s = JSON.stringify(bda);
    let encrypted = crypt_1.default.encrypt(s, key);
    return Buffer.from(encrypted).toString("base64");
}
function solveBreaker(v2, breaker = "default", gameType, value) {
    if (!v2 && typeof breaker === "string")
        return apiBreakers.v1[gameType][breaker || "default"](value);
    if (typeof breaker !== "string") {
        let b = apiBreakers.v2[gameType];
        let v = breaker.value.reduce((acc, cur) => {
            if (b.value[cur])
                return b.value[cur](acc);
            else
                return cur;
        }, value);
        return b.key[breaker.key](v);
    }
    else {
        return value;
    }
}
exports.default = {
    DEFAULT_USER_AGENT,
    tileToLoc,
    constructFormData,
    getBda,
    apiBreakers,
    getTimestamp,
    random,
    solveBreaker
};
