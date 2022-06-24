import { GetTokenResult } from "./api";
import { Challenge } from "./challenge";
export interface TokenInfo {
    token: string;
    r: string;
    metabgclr: string;
    mainbgclr: string;
    guitextcolor: string;
    metaiconclr: string;
    meta_height: string;
    meta_width: string;
    meta: string;
    pk: string;
    dc: string;
    at: string;
    cdn_url: string;
    lurl: string;
    surl: string;
    smurl: string;
}
interface SessionOptions {
    userAgent?: string;
    proxy?: string;
}
declare class Session {
    token: string;
    tokenInfo: TokenInfo;
    private userAgent;
    private proxy;
    constructor(token: string | GetTokenResult, sessionOptions?: SessionOptions);
    getChallenge(): Promise<Challenge>;
}
export default Session;
