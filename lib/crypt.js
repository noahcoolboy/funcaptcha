"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var md5 = crypto_1.createHash("md5");
function encrypt(data, key) {
    var salt = "";
    var salted = "";
    var dx = Buffer.alloc(0);
    salt = Array(8).fill(0).map(function (v) { return alphabet[Math.floor(Math.random() * alphabet.length)]; }).join(""); // 8 random letters
    data = data + Array(17 - data.length % 16).join(String.fromCharCode(16 - data.length % 16)); // Padding (pkcs7?)
    for (var x = 0; x < 3; x++) {
        dx = md5.update(Buffer.concat([
            Buffer.from(dx),
            Buffer.from(key),
            Buffer.from(salt)
        ])).digest();
        salted += dx.toString("hex");
        md5 = crypto_1.createHash("md5");
    }
    var aes = crypto_1.createCipheriv("aes-256-cbc", Buffer.from(salted, "hex").slice(0, 32), Buffer.from(salted, "hex").slice(32, 32 + 16));
    aes.setAutoPadding(false);
    return JSON.stringify({
        ct: aes.update(data, null, "base64") + aes.final("base64"),
        iv: salted.substring(64, 64 + 32),
        s: Buffer.from(salt).toString("hex")
    });
}
function decrypt(rawData, key) {
    var data = JSON.parse(rawData);
    var dk = Buffer.concat([
        Buffer.from(key),
        Buffer.from(data.s, "hex")
    ]);
    var md5 = crypto_1.createHash("md5");
    var arr = [Buffer.from(md5.update(dk).digest()).toString("hex")];
    var result = arr[0];
    for (var x = 1; x < 3; x++) {
        md5 = crypto_1.createHash("md5");
        arr.push(Buffer.from(md5.update(Buffer.concat([Buffer.from(arr[x - 1], "hex"), dk])).digest()).toString("hex"));
        result += arr[x];
    }
    var aes = crypto_1.createDecipheriv("aes-256-cbc", Buffer.from(result, "hex").slice(0, 32), Buffer.from(data.iv, "hex"));
    return aes.update(data.ct, "base64", "utf8") + aes.final("utf8");
}
exports.default = {
    encrypt: encrypt,
    decrypt: decrypt
};
