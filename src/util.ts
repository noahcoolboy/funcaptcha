import fingerprint from "./fingerprint";
import murmur from "./murmur";
import crypt from "./crypt";

interface TimestampData {
    cookie: string;
    value: string;
}

const DEFAULT_USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";

let apiBreakers = {
    v1: {
        3: {
            default: (c) => ({ px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2), x: c[0], y: c[1] }),
            method_1: (c) => ({ x: c[1], y: c[0] }),
            method_2: (c) => ({ x: c[0], y: (c[1] + c[0]) * c[0] }),
            method_3: (c) => ({ a: c[0], b: c[1] }),
            method_4: (c) => [c[0], c[1]],
            method_5: (c) => [c[1], c[0]].map((v) => Math.sqrt(v)),
        },
        4: {
            default: (c) => c
        }
    },
    v2: {
        3: {
            value: {
                alpha: (c) => ({ x: c[0], y: (c[1] + c[0]) * c[0], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                beta: (c) => ({ x: c[1], y: c[0], py: (c[0] / 300).toFixed(2), px: (c[1] / 200).toFixed(2) }),
                gamma: (c) => ({ x: c[1] + 1, y: -c[0], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                delta: (c) => ({ x: c[1] + 0.25, y: c[0] + 0.5, px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                epsilon: (c) => ({ x: c[0] * 0.5, y: c[1] * 5, px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                zeta: (c) => ({ x: c[0] + 1, y: c[1] + 2, px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                method_1: (c) => ({ x: c[0], y: c[1], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                method_2: (c) => ({ x: c[1], y: (c[1] + c[0]) * c[0], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                method_3: (c) => ({ x: Math.sqrt(c[0]), y: Math.sqrt(c[1]), px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
            },
            key: {
                alpha: (c) => [c[1], (c[0] / 300).toFixed(2), (c[1] / 200).toFixed(2), c[0]],
                beta: (c) => JSON.stringify({ x: c[0], y: c[1], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                gamma: (c) => [c[0], c[1], (c[0] / 300).toFixed(2), (c[1] / 200).toFixed(2)].join(" "),
                delta: (c) => [1, c[0], 2, c[1], 3, (c[0] / 300).toFixed(2), 4, (c[1] / 200).toFixed(2)],
                epsilon: (c) => ({ answer: { x: c[0], y: c[1], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) } }),
                zeta: (c) => [c[0], [c[1], [(c[0] / 300).toFixed(2), [(c[1] / 200).toFixed(2)]]]],
                method_1: (c) => ({ a: c[0], b: c[1], px: (c[0] / 300).toFixed(2), py: (c[1] / 200).toFixed(2) }),
                method_2: (c) => [c[0], c[1]],
                method_3: (c) => [c[1], c[0]],
            }
        },
        4: {
            value: {
                // @ts-ignore
                alpha: (c) => ({ index: String(c.index) + 1 - 2 }),
                beta: (c) => ({ index: -c.index }),
                gamma: (c) => ({ index: 3 * (3 - c.index) }),
                delta: (c) => ({ index: 7 * c.index }),
                epsilon: (c) => ({ index: 2 * c.index }),
                zeta: (c) => ({ index: c.index ? 100 / c.index : c.index }),
                va: (c) => ({ index: c.index + 3 }),
                vb: (c) => ({ index: -c.index }),
                vc: (c) => ({ index: 10 - c.index }),
                vd: (c) => ({ index: 3 * c.index }),
            },
            key: {
                alpha: (c) => [Math.round(100 * Math.random()), c.index, Math.round(100 * Math.random())],
                beta: (c) => ({ size: 50 - c.index, id: c.index, limit: 10 * c.index, req_timestamp: Date.now() }),
                gamma: (c) => c.index,
                delta: (c) => ({ index: c.index }),
                epsilon: (c) => {
                    const arr: any = [];
                    const len = Math.round(5 * Math.random()) + 1;
                    const rand = Math.round(Math.random() * len);
                    for (let i = 0; i < len; i++) {
                        arr.push(i === rand ? c.index : Math.round(10 * Math.random()));
                    }
                    arr.push(rand);
                    return arr;
                },
                zeta: (c) => Array(Math.round(5 * Math.random()) + 1).concat(c.index),
                ka: (c) => c.index,
                kb: (c) => [c.index],
                kc: (c) => ({ guess: c.index }),
            }
        }
    }
}

function tileToLoc(tile: number): number[] {
    return [
        (tile % 3) * 100 +
        (tile % 3) * 3 +
        3 +
        10 +
        Math.floor(Math.random() * 80),
        Math.floor(tile / 3) * 100 +
        Math.floor(tile / 3) * 3 +
        3 +
        10 +
        Math.floor(Math.random() * 80),
    ];
}

function constructFormData(data: {}): string {
    return Object.keys(data)
        .filter((v) => data[v] !== undefined)
        .map((k) => `${k}=${encodeURIComponent(data[k])}`)
        .join("&");
}

function random(): string {
    return Array(32)
        .fill(0)
        .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
        .join("");
}

function getTimestamp(): TimestampData {
    const time = (new Date()).getTime().toString()
    const value = `${time.substring(0, 7)}00${time.substring(7, 13)}`

    return { cookie: `timestamp=${value};path=/;secure;samesite=none`, value }
}

function getBda(userAgent: string, publicKey: string, referer?: string, location?: string): string {
    let fp = fingerprint.getFingerprint();
    let fe = fingerprint.prepareFe(fp);

    let bda = [
        { key: "api_type", value: "js" },
        { key: "p", value: 1 },
        { key: "f", value: murmur(fingerprint.prepareF(fingerprint), 31) },
        {
            key: "n",
            value: Buffer.from(
                Math.round(Date.now() / (1000 - 0)).toString()
            ).toString("base64"),
        },
        { key: "wh", value: `${random()}|${random()}` },
        {
            "key": "enhanced_fp",
            "value": [
                {
                    "key": "webgl_extensions",
                    "value": "ANGLE_instanced_arrays;EXT_blend_minmax;EXT_color_buffer_half_float;EXT_disjoint_timer_query;EXT_float_blend;EXT_frag_depth;EXT_shader_texture_lod;EXT_texture_compression_bptc;EXT_texture_compression_rgtc;EXT_texture_filter_anisotropic;EXT_sRGB;KHR_parallel_shader_compile;OES_element_index_uint;OES_fbo_render_mipmap;OES_standard_derivatives;OES_texture_float;OES_texture_float_linear;OES_texture_half_float;OES_texture_half_float_linear;OES_vertex_array_object;WEBGL_color_buffer_float;WEBGL_compressed_texture_s3tc;WEBGL_compressed_texture_s3tc_srgb;WEBGL_debug_renderer_info;WEBGL_debug_shaders;WEBGL_depth_texture;WEBGL_draw_buffers;WEBGL_lose_context;WEBGL_multi_draw"
                },
                {
                    "key": "webgl_extensions_hash",
                    "value": random()
                },
                {
                    "key": "webgl_renderer",
                    "value": "WebKit WebGL"
                },
                {
                    "key": "webgl_vendor",
                    "value": "WebKit"
                },
                {
                    "key": "webgl_version",
                    "value": "WebGL 1.0 (OpenGL ES 2.0 Chromium)"
                },
                {
                    "key": "webgl_shading_language_version",
                    "value": "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)"
                },
                {
                    "key": "webgl_aliased_line_width_range",
                    "value": "[1, 1]"
                },
                {
                    "key": "webgl_aliased_point_size_range",
                    "value": "[1, 1024]"
                },
                {
                    "key": "webgl_antialiasing",
                    "value": "yes"
                },
                {
                    "key": "webgl_bits",
                    "value": "8,8,24,8,8,0"
                },
                {
                    "key": "webgl_max_params",
                    "value": "16,32,16384,1024,16384,16,16384,30,16,16,4095"
                },
                {
                    "key": "webgl_max_viewport_dims",
                    "value": "[32767, 32767]"
                },
                {
                    "key": "webgl_unmasked_vendor",
                    "value": "Google Inc. (NVIDIA)"
                },
                {
                    "key": "webgl_unmasked_renderer",
                    "value": "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)"
                },
                {
                    "key": "webgl_vsf_params",
                    "value": "23,127,127,23,127,127,23,127,127"
                },
                {
                    "key": "webgl_vsi_params",
                    "value": "0,31,30,0,31,30,0,31,30"
                },
                {
                    "key": "webgl_fsf_params",
                    "value": "23,127,127,23,127,127,23,127,127"
                },
                {
                    "key": "webgl_fsi_params",
                    "value": "0,31,30,0,31,30,0,31,30"
                },
                {
                    "key": "webgl_hash_webgl",
                    "value": random()
                },
                {
                    "key": "user_agent_data_brands",
                    "value": "Chromium,Google Chrome,Not:A-Brand"
                },
                {
                    "key": "user_agent_data_mobile",
                    "value": false
                },
                {
                    "key": "navigator_connection_downlink",
                    "value": 10
                },
                {
                    "key": "navigator_connection_downlink_max",
                    "value": null
                },
                {
                    "key": "network_info_rtt",
                    "value": 50
                },
                {
                    "key": "network_info_save_data",
                    "value": false
                },
                {
                    "key": "network_info_rtt_type",
                    "value": null
                },
                {
                    "key": "screen_pixel_depth",
                    "value": 24
                },
                {
                    "key": "navigator_device_memory",
                    "value": 8
                },
                {
                    "key": "navigator_languages",
                    "value": "en-US,fr,fr-FR,en,nl"
                },
                {
                    "key": "window_inner_width",
                    "value": 0
                },
                {
                    "key": "window_inner_height",
                    "value": 0
                },
                {
                    "key": "window_outer_width",
                    "value": 1920
                },
                {
                    "key": "window_outer_height",
                    "value": 1080
                },
                {
                    "key": "browser_detection_firefox",
                    "value": false
                },
                {
                    "key": "browser_detection_brave",
                    "value": false
                },
                {
                    "key": "audio_codecs",
                    "value": "{\"ogg\":\"probably\",\"mp3\":\"probably\",\"wav\":\"probably\",\"m4a\":\"maybe\",\"aac\":\"probably\"}"
                },
                {
                    "key": "video_codecs",
                    "value": "{\"ogg\":\"probably\",\"h264\":\"probably\",\"webm\":\"probably\",\"mpeg4v\":\"\",\"mpeg4a\":\"\",\"theora\":\"\"}"
                },
                {
                    "key": "media_query_dark_mode",
                    "value": true
                },
                {
                    "key": "headless_browser_phantom",
                    "value": false
                },
                {
                    "key": "headless_browser_selenium",
                    "value": false
                },
                {
                    "key": "headless_browser_nightmare_js",
                    "value": false
                },
                {
                    "key": "window__ancestor_origins",
                    "value": [

                    ]
                },
                {
                    "key": "window__tree_index",
                    "value": [

                    ]
                },
                {
                    "key": "window__tree_structure",
                    "value": "[[],[[]]]"
                },
                {
                    "key": "client_config__surl",
                    "value": null
                },
                {
                    "key": "client_config__language",
                    "value": null
                },
                {
                    "key": "navigator_battery_charging",
                    "value": true
                },
                {
                    "key": "audio_fingerprint",
                    "value": "124.04347527516074"
                },
                {
                    "key": "mobile_sdk__is_sdk"
                }
            ]
        },
        { key: "fe", value: fe },
        { key: "ife_hash", value: murmur(fe.join(", "), 38) },
        { key: "cs", value: 1 },
        {
            key: "jsbd",
            value: JSON.stringify({
                HL: 4,
                DT: "",
                NWD: "false",
                DOTO: 1,
                DMTO: 1,
            }),
        },
    ];

    const enhanced_fp = bda.find((val) => val.key === "enhanced_fp")?.value

    if (enhanced_fp instanceof Array) {
        if (referer)
            enhanced_fp.push({
                "key": "document__referrer",
                "value": referer
            })

        if (location) {
            enhanced_fp.push({
                "key": "window__location_href",
                "value": location
            })
            enhanced_fp.push({
                "key": "client_config__sitedata_location_href",
                "value": location
            })
        }
    }

    let time = new Date().getTime() / 1000;
    let key = userAgent + Math.round(time - (time % 21600));

    let s = JSON.stringify(bda);
    let encrypted = crypt.encrypt(s, key);
    return Buffer.from(encrypted).toString("base64");
}

export default {
    DEFAULT_USER_AGENT,
    tileToLoc,
    constructFormData,
    getBda,
    apiBreakers,
    getTimestamp,
    random
};
