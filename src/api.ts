import request from "./http";
import util from "./util";

export interface GetTokenOptions {
    pkey: string;
    // Service URL
    surl?: string;
    data?: { [key: string]: string };
    headers?: { [key: string]: string };
    site?: string;
    proxy?: string;
}

export interface GetTokenResult {
    challenge_url: string;
    challenge_url_cdn: string;
    challenge_url_cdn_sri: string;
    disable_default_styling: boolean | null;
    iframe_height: number | null;
    iframe_width: number | null;
    // Enable keyboard biometrics
    kbio: boolean;
    // Enable mouse biometrics
    mbio: boolean;
    noscript: string;
    // Enable touch biometrics
    tbio: boolean;
    // The token for the funcaptcha. Can be used 10 times before having to get a new token.
    token: string;
}

export async function getToken(
    options: GetTokenOptions
): Promise<GetTokenResult> {
    options = {
        surl: "https://client-api.arkoselabs.com",
        data: {},
        ...options,
    };

    if (!options.headers)
        options.headers = { "User-Agent": util.DEFAULT_USER_AGENT };
    else if (!Object.keys(options.headers).map(v => v.toLowerCase()).includes("user-agent"))
        options.headers["User-Agent"] = util.DEFAULT_USER_AGENT;

    options.headers["Accept-Language"] = "en-US,en;q=0.9";
    options.headers["Sec-Fetch-Site"] = "cross-site";

    let ua = options.headers[Object.keys(options.headers).find(v => v.toLowerCase() == "user-agent")]
    let res = await request(
        options.surl,
        {
            method: "POST",
            path: "/fc/gt2/public_key/?public_key=" + options.pkey,
            body: util.constructFormData({
                public_key: options.pkey,
                site: options.site,
                userbrowser: ua,
                rnd: Math.random().toString(),
                bda: util.getBda(ua),
                ...Object.fromEntries(Object.keys(options.data).map(v => ["data[" + v + "]", options.data[v]]))
            }),
            headers: options.headers,
        },
        options.proxy
    );

    return JSON.parse(res.body.toString());
}
