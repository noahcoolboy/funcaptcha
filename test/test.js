const fc = require("../index.js")
const fs = require("fs")
fc.getToken({
    pkey: "476068BF-9607-4799-B53D-966BE98E2B81",
    surl: "https://roblox-api.arkoselabs.com"
}).then(async res => {
    let a = new fc.Session(res.token)
    let challenge = await a.getChallenge()
    fs.writeFileSync("test.gif", await challenge.getImage())
    console.log(await challenge.answer(2))
})