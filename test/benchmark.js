let fun = require("../lib");

console.time("Full captcha");
console.time("Get token");
fun.getToken({
    pkey: "476068BF-9607-4799-B53D-966BE98E2B81",
    surl: "https://roblox-api.arkoselabs.com",
}).then(async (token) => {
    console.timeEnd("Get token");
    console.time("Get challenge");
    let session = new fun.Session(token);
    let captcha = await session.getChallenge();
    console.timeEnd("Get challenge");

    for (let x = 0; x < captcha.data.game_data.waves; x++) {
        console.time(`Wave ${x}`);
        console.time("Get image");
        let image = await captcha.getImage();
        console.timeEnd("Get image");
        console.time("Answer");
        let answer = await captcha.answer(Math.floor(Math.random() * 6));
        console.timeEnd("Answer");
        console.timeEnd(`Wave ${x}`);
    }
    console.timeEnd("Full captcha");
});
