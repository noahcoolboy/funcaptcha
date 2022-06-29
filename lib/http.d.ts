/// <reference types="node" />
/// <reference types="node" />
import { RequestOptions } from "undici/types/dispatcher";
declare function req(url: string, options: RequestOptions, proxy?: string): Promise<{
    headers: import("http").IncomingHttpHeaders;
    body: Buffer;
}>;
export default req;
