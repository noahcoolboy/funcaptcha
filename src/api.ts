import request from "./http";
import util from "./util";

interface GetTokenOptions {
    pkey: string,
    // Service URL
    surl?: string,
    data?: { [key: string]: string },
    headers?: { [key: string]: string },
    site?: string
}

export interface GetTokenResult {
    challenge_url: string,
    challenge_url_cdn: string,
    challenge_url_cdn_sri: string,
    disable_default_styling: boolean | null,
    iframe_height: number | null,
    iframe_width: number | null,
    // Enable keyboard biometrics
    kbio: boolean,
    // Enable mouse biometrics
    mbio: boolean,
    noscript: string,
    // Enable touch biometrics
    tbio: boolean,
    // The token for the funcaptcha. Can be used 10 times before having to get a new token.
    token: string,
}

async function getToken(options: GetTokenOptions): Promise<GetTokenResult> {
    options = {
        surl: "https://client-api.arkoselabs.com",
        data: {},
        headers: {
            "User-Agent": util.DEFAULT_USER_AGENT
        },
        ...options
    }

    let res = await request(options.surl, {
        method: "POST",
        path: "/fc/gt2/public_key/" + options.pkey,
        body: util.constructFormData({
            public_key: options.pkey,
            site: options.site,
            userbrowser: options.headers["User-Agent"],
            rnd: Math.random().toString(),
            bda: util.getBda(options.headers["User-Agent"]),
        }),
        headers: options.headers
    })

    return JSON.parse(res.body.toString())
}

export default {
    getToken
}