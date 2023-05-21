interface TimestampData {
    cookie: string;
    value: string;
}
declare function breakerValue(values: any, breakers: any): Array<Function>;
declare function tileToLoc(tile: number): number[];
declare function constructFormData(data: {}): string;
declare function random(): string;
declare function getTimestamp(): TimestampData;
declare function getBda(userAgent: string, surl: string, referer?: string, location?: string, canvasFp?: string): string;
declare const _default: {
    DEFAULT_USER_AGENT: string;
    tileToLoc: typeof tileToLoc;
    constructFormData: typeof constructFormData;
    getBda: typeof getBda;
    apiBreakers: {
        default: (c: any) => {
            px: string;
            py: string;
            x: any;
            y: any;
        };
        method_1: (c: any) => {
            x: any;
            y: any;
        };
        method_2: (c: any) => {
            x: any;
            y: number;
        };
        method_3: (c: any) => {
            a: any;
            b: any;
        };
        method_4: (c: any) => any[];
        method_5: (c: any) => number[];
    };
    apiBreakers2: {
        type_3: {
            value: {
                alpha: (c: any) => {
                    x: any;
                    y: number;
                    px: any;
                    py: any;
                };
                beta: (c: any) => {
                    x: any;
                    y: any;
                    px: any;
                    py: any;
                };
                gamma: (c: any) => {
                    x: any;
                    y: number;
                    px: any;
                    py: any;
                };
                delta: (c: any) => {
                    x: any;
                    y: any;
                    px: any;
                    py: any;
                };
                epsilon: (c: any) => {
                    x: number;
                    y: number;
                    px: any;
                    py: any;
                };
                zeta: (c: any) => {
                    x: any;
                    y: any;
                    px: any;
                    py: any;
                };
            };
            key: {
                alpha: (c: any) => any[];
                beta: (c: any) => string;
                gamma: (c: any) => string;
                delta: (c: any) => any[];
                epsilon: (c: any) => {
                    answer: {
                        x: any;
                        y: any;
                        px: any;
                        py: any;
                    };
                };
                zeta: (c: any) => any[];
            };
        };
        type_4: {
            value: {
                alpha: (c: any) => {
                    index: number;
                };
                beta: (c: any) => {
                    index: number;
                };
                gamma: (c: any) => {
                    index: number;
                };
                delta: (c: any) => {
                    index: number;
                };
                epsilon: (c: any) => {
                    index: number;
                };
                zeta: (c: any) => {
                    index: any;
                };
            };
            key: {
                alpha: (c: any) => any[];
                beta: (c: any) => {
                    size: number;
                    id: any;
                    limit: number;
                    req_timestamp: number;
                };
                gamma: (c: any) => any;
                delta: (c: any) => {
                    index: any;
                };
                epsilon: (c: any) => any[];
                zeta: (c: any) => any[];
            };
        };
    };
    breakerValue: typeof breakerValue;
    getTimestamp: typeof getTimestamp;
    random: typeof random;
};
export default _default;
