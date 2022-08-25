// Optional test for roblox detection
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"

const undici = require("undici")
const funcaptcha = require("../lib")

undici.request("https://auth.roblox.com/v2/signup", {
    method: "POST",   
}).then(async res => {
    const csrf = res.headers["x-csrf-token"]
    
    const res2 = await undici.request("https://auth.roblox.com/v2/signup", {
        method: "POST",
        headers: {
            "x-csrf-token": csrf,
            "content-type": "application/json",
            "user-agent": USER_AGENT
        },
        body: JSON.stringify({
            "username": "",
            "password": "",
        })
    })
    const body = await res2.body.json()
    
    const fieldData = body.errors[0].fieldData.split(",")
    const token = await funcaptcha.getToken({
        pkey: "A2A14B1D-1AF3-C791-9BBC-EE33CC7A0A6F",
        surl: "https://roblox-api.arkoselabs.com",
        data: {
            "blob": fieldData[1],
        },
        headers: {
            "User-Agent": USER_AGENT,
        },
    })

    let session = new funcaptcha.Session(token, {
        userAgent: USER_AGENT,
    })
    let challenge = await session.getChallenge()

    console.log("Signup", challenge.data.game_data.game_variant, challenge.data.game_data.waves)

    if (
        challenge.data.game_data.game_variant && (
            challenge.data.game_data.game_variant.startsWith("dice_") ||
            challenge.data.game_data.game_variant.startsWith("dart") ||
            challenge.data.game_data.game_variant.startsWith("context-") ||
            [
                "shadow-icons",
                "penguins",
                "shadows",
                "mismatched-jigsaw",
                "stairs_walking",
                "reflection",
            ].includes(challenge.data.game_data.game_variant)
        )
    ) {
        console.log("Signup", "Test failed :(")
    } else {
        console.log("Singup", "Test passed!")
    }
})

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
    const body = await res2.body.json()
    
    const fieldData = body.errors[0].fieldData.split(",")
    const token = await funcaptcha.getToken({
        pkey: "476068BF-9607-4799-B53D-966BE98E2B81",
        surl: "https://roblox-api.arkoselabs.com",
        data: {
            "blob": fieldData[1],
        },
        headers: {
            "User-Agent": USER_AGENT,
        },
    })

    let session = new funcaptcha.Session(token, {
        userAgent: USER_AGENT,
    })
    let challenge = await session.getChallenge()

    console.log("Login", challenge.data.game_data.game_variant, challenge.data.game_data.waves)

    if (
        challenge.data.game_data.game_variant && (
            challenge.data.game_data.game_variant.startsWith("dice_") ||
            challenge.data.game_data.game_variant.startsWith("dart") ||
            challenge.data.game_data.game_variant.startsWith("context-") ||
            [
                "shadow-icons",
                "penguins",
                "shadows",
                "mismatched-jigsaw",
                "stairs_walking",
                "reflection",
            ].includes(challenge.data.game_data.game_variant)
        )
    ) {
        console.log("Login", "Test failed :(")
    } else {
        console.log("Login", "Test passed!")
    }
})