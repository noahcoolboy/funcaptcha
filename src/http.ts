import { request } from "undici";
import { RequestOptions } from "undici/types/dispatcher";

async function req(url: string, options: RequestOptions) {
    let req = await request(url, options);
    return {
        headers: req.headers,
        body: Buffer.from(await req.body.arrayBuffer())
    };
}

export default req;