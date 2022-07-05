/// <reference types="node" />
import { TokenInfo } from "./session";
interface ChallengeOptions {
    userAgent?: string;
    proxy?: string;
}
interface ChallengeData {
    token: string;
    tokenInfo: TokenInfo;
    session_token: string;
    challengeID: string;
    game_data: {
        gameType: number;
        customGUI: {
            _guiFontColr: string;
            _challenge_imgs: string[];
            api_breaker: string;
            encrypted_mode: number;
        };
        waves: number;
        game_variant: string;
    };
}
interface AnswerResponse {
    response: "not answered" | "answered";
    solved?: boolean;
    incorrect_guess?: number;
    score?: number;
    decryption_key?: string;
    time_end?: number;
    time_end_seconds?: number;
}
export declare abstract class Challenge {
    data: ChallengeData;
    imgs: Promise<Buffer>[];
    wave: number;
    protected key: string;
    protected userAgent: string;
    protected proxy: string;
    constructor(data: ChallengeData, challengeOptions: ChallengeOptions);
    getImage(): Promise<Buffer>;
    protected getKey(): Promise<string>;
    abstract answer(answer: number): Promise<AnswerResponse>;
}
export declare class Challenge1 extends Challenge {
    private answerHistory;
    increment: any;
    constructor(data: ChallengeData, challengeOptions: ChallengeOptions);
    private round;
    answer(answer: number): Promise<AnswerResponse>;
}
export declare class Challenge3 extends Challenge {
    private answerHistory;
    constructor(data: ChallengeData, challengeOptions: ChallengeOptions);
    answer(tile: number): Promise<AnswerResponse>;
}
export {};
