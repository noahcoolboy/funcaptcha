import { request, ProxyAgent } from "undici";
import { RequestOptions } from "undici/types/dispatcher";

async function req(url: string, options: RequestOptions, proxy?: string) {
    let dispatcher = proxy ? new ProxyAgent(proxy) : undefined;
    let req = await request(url, {
        ...options,
        dispatcher,
    });
    return {
        headers: req.headers,
        body: Buffer.from(await req.body.arrayBuffer()),
    };
}

export default req;
