// Optional test for roblox detection
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"

const undici = require("undici")
const funcaptcha = require("../lib")

function continueToken(tracker, challengeId, captchaId, token) {
    undici.request("https://apis.roblox.com/challenge/v1/continue", {
        headers: {
            "user-agent": USER_AGENT,
            "content-type": "application/json",
            "cookie": tracker
        },
        method: "POST",
        body: JSON.stringify({
            challengeId,
            challengeMetadata: JSON.stringify({
                unifiedCaptchaId: captchaId,
                captchaToken: token,
                actionType: "Login"
            }),
            challengeType: "captcha"
        })
    }).then(async res => {
        console.log(res.statusCode, await res.body.text())
        if(res.statusCode == 200) {
            console.log("Token accepted by roblox :D")
        } else {
            console.log("Token rejected by roblox :(")
            console.log("Response:", await res.body.text())
        }
    })
}

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

    const fieldData = JSON.parse(Buffer.from(res2.headers["rblx-challenge-metadata"], "base64"))
    const tracker =  (Array.isArray(res2.headers["set-cookie"]) ? res2.headers["set-cookie"].find(v => v.startsWith("RBXEventTrackerV2")) : response.headers["set-cookie"])?.split(";")[0] ?? undefined;
    const challengeId = res2.headers["rblx-challenge-id"]
    const captchaId = fieldData.unifiedCaptchaId
    
    setTimeout(async () => {
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

        if(token.token.includes("sup=1")) {
            console.log("Suppressed captcha!")
            return continueToken(tracker, challengeId, captchaId, token.token)
        }

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
                    "numericalmatch"
                ].includes(challenge.variant)
            )
        ) {
            console.log("Login", "Test failed :(")
        } else {
            console.log("Login", "Test passed!")
        }

        if(challenge.variant == "colour") {
            console.log("Colour challenge")
            await challenge.answer(0)
            return continueToken(tracker, challengeId, captchaId, token.token)
        }
    }, 2500);
})

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"