// Optional test for roblox detection
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"

const undici = require("undici")
const funcaptcha = require("../lib")

undici.request("https://auth.roblox.com/v2/login", {
    method: "POST",
}).then(async res => {
    const csrf = res.headers["x-csrf-token"]

    const res2 = await undici.request("https://auth.roblox.com/v2/login", {
        method: "POST",
        headers: {
            "x-csrf-token": csrf,
            "content-type": "application/json",
            "user-agent": USER_AGENT
        },
        body: JSON.stringify({
            "ctype": "Username",
            "cvalue": "Test",
            "password": "Test",
        })
    })
    
    setTimeout(async () => {
        const fieldData = JSON.parse(Buffer.from(res2.headers["rblx-challenge-metadata"], "base64"))

        const token = await funcaptcha.getToken({
            pkey: "476068BF-9607-4799-B53D-966BE98E2B81",
            surl: "https://roblox-api.arkoselabs.com",
            data: {
                "blob": fieldData.dataExchangeBlob,
            },
            headers: {
                "User-Agent": USER_AGENT,
            },
            site: "https://www.roblox.com/login",
        })

        if(token.token.includes("sup=1"))
            return console.log("Suppressed captcha!")

        let session = new funcaptcha.Session(token, {
            userAgent: USER_AGENT,
        })
        let challenge = await session.getChallenge().catch((err) => console.log('login fail', err))

        console.log("Login", challenge.variant, challenge.waves)

        if (
            challenge.variant && (
                challenge.variant.startsWith("dice_") ||
                challenge.variant.startsWith("dart") ||
                challenge.variant.startsWith("context-") ||
                [
                    "shadow-icons",
                    "penguins",
                    "shadows",
                    "mismatched-jigsaw",
                    "stairs_walking",
                    "reflection",
                ].includes(challenge.variant)
            )
        ) {
            console.log("Login", "Test failed :(")
        } else {
            console.log("Login", "Test passed!")
        }
    }, 2500);
})

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"