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
declare class Session {
    token: string;
    tokenInfo: TokenInfo;
    private userAgent;
    constructor(token: string | GetTokenResult, userAgent?: string);
    getChallenge(): Promise<Challenge>;
}
export default Session;
