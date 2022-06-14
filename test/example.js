let fs = require("fs")
let fun = require("../index")
let readline = require("readline")
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function ask(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer)
        })
    })
}

fun.getToken({
    pkey: "476068BF-9607-4799-B53D-966BE98E2B81",
    surl: "https://roblox-api.arkoselabs.com"
}).then(async token => { 
    let session = new fun.Session(token)
    let challenge = await session.getChallenge()
    console.log(challenge.data.game_data.game_variant)
    console.log(challenge.data.game_data.customGUI.api_breaker)
    
    for(let x = 0; x < challenge.data.game_data.waves; x++) {
        fs.writeFileSync(`${x}.gif`, await challenge.getImage())
        console.log(await challenge.answer(parseInt(await ask("Answer: "))))
    }
    console.log("Done!")
})