import fingerprint from "./fingerprint";
import murmur from "./murmur"
import crypt from "./crypt"

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36';

let apiBreakers = {
    default: (c) => { return { px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2), x: c[0], y: c[1] } },
    method_1: (c) => { return { x: c[1], y: c[0] } },
    method_2: (c) => { return { x: c[0], y: (c[1] + c[0]) * c[0] } },
    method_3: (c) => { return { a: c[0], b: c[1] } },
    method_4: (c) => { return [c[0], c[1]] },
    method_5: (c) => { return [c[1], c[0]].map(v => Math.sqrt(v)) }
}

function tileToLoc(tile: number): number[] {
    return [
        tile % 3 * 100 + tile % 3 * 3 + 3 + 10 + Math.floor(Math.random() * 80),
        Math.floor(tile / 3) * 100 + Math.floor(tile / 3) * 3 + 3 + 10 + Math.floor(Math.random() * 80)
    ]
}

function constructFormData(data: { [key: string]: string }): string {
    return Object.keys(data).filter(v => data[v] !== undefined).map(k => `${k}=${encodeURIComponent(data[k])}`).join("&")
}

function random(): string {
    return Array(32).fill(0).map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")
}

function getBda(userAgent: string): string {
    let fp = fingerprint.getFingerprint()
    let fe = fingerprint.prepareFe(fp)

    let bda = [
        { "key": "fe", "value": fe },
        { "key": "ife_hash", "value": murmur(fe.join(", "), 38) },
        { "key": "api_type", "value": "js" },
        { "key": "p", "value": 1 },
        { "key": "f", "value": murmur(fingerprint.prepareF(fingerprint), 31) },
        { "key": "n", "value": Buffer.from(Math.round(Date.now() / (1000 - 0)).toString()).toString("base64") },
        { "key": "wh", "value": `${random()}|${random()}` },
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
    ]
    
    let time = new Date().getTime() / 1000;
    let key = userAgent + Math.round(time - time % 21600)

    let s = JSON.stringify(bda)
    let encrypted = crypt.encrypt(s, key)
    return Buffer.from(JSON.stringify(encrypted)).toString("base64")
}

export default {
    DEFAULT_USER_AGENT,
    tileToLoc,
    constructFormData,
    getBda,
    apiBreakers
}