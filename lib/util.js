"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fingerprint_1 = require("./fingerprint");
const murmur_1 = require("./murmur");
const crypt_1 = require("./crypt");
const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36";
let apiBreakers = {
    default: (c) => {
        return {
            px: (c[0] / 300).toFixed(2),
            py: (c[1] / 200).toFixed(2),
            x: c[0],
            y: c[1],
        };
    },
    method_1: (c) => {
        return { x: c[1], y: c[0] };
    },
    method_2: (c) => {
        return { x: c[0], y: (c[1] + c[0]) * c[0] };
    },
    method_3: (c) => {
        return { a: c[0], b: c[1] };
    },
    method_4: (c) => {
        return [c[0], c[1]];
    },
    method_5: (c) => {
        return [c[1], c[0]].map((v) => Math.sqrt(v));
    },
};
let apiBreakers2 = {
    type_3: {
        value: {
            alpha: function (c) {
                return {
                    x: c.x,
                    y: (c.y + c.x) * c.x,
                    px: c.px,
                    py: c.py,
                };
            },
            beta: function (c) {
                return {
                    x: c.y,
                    y: c.x,
                    px: c.py,
                    py: c.px,
                };
            },
            gamma: function (c) {
                return {
                    x: c.y + 1,
                    y: -c.x,
                    px: c.px,
                    py: c.py,
                };
            },
            delta: function (c) {
                return {
                    x: c.y + 0.25,
                    y: c.x + 0.5,
                    px: c.px,
                    py: c.py,
                };
            },
            epsilon: function (c) {
                return {
                    x: 0.5 * c.x,
                    y: 5 * c.y,
                    px: c.px,
                    py: c.py,
                };
            },
            zeta: function (c) {
                return {
                    x: c.x + 1,
                    y: c.y + 2,
                    px: c.px,
                    py: c.py,
                };
            },
        },
        key: {
            alpha: function (c) {
                return [c.y, c.px, c.py, c.x];
            },
            beta: function (c) {
                return JSON.stringify({
                    x: c.x,
                    y: c.y,
                    px: c.px,
                    py: c.py,
                });
            },
            gamma: function (c) {
                return [c.x, c.y, c.px, c.py].join(' ');
            },
            delta: function (c) {
                return [1, c.x, 2, c.y, 3, c.px, 4, c.py];
            },
            epsilon: function (c) {
                return {
                    answer: {
                        x: c.x,
                        y: c.y,
                        px: c.px,
                        py: c.py,
                    },
                };
            },
            zeta: function (c) {
                return [c.x, [c.y, [c.px, [c.py]]]];
            },
        },
    },
    type_4: {
        'value': {
            'alpha': function (c) {
                return {
                    // @ts-ignore
                    'index': String(c.index) + 0x1 - 0x2
                };
            },
            'beta': function (c) {
                return {
                    'index': -c.index
                };
            },
            'gamma': function (c) {
                return {
                    'index': 0x3 * (0x3 - c.index)
                };
            },
            'delta': function (c) {
                return {
                    'index': 0x7 * c.index
                };
            },
            'epsilon': function (c) {
                return {
                    'index': 0x2 * c.index
                };
            },
            'zeta': function (c) {
                return {
                    'index': Number(c.index) !== 0 ? 100 / Number(c.index) : Number(c.index) //c.index ? 0x64 / c.index : c.index
                };
            }
        },
        'key': {
            'alpha': function (c) {
                return [Math.round(0x64 * Math.random()), c.index, Math.round(0x64 * Math.random())];
            },
            'beta': function (c) {
                return {
                    'size': 0x32 - c.index,
                    'id': c.index,
                    'limit': 0xa * c.index,
                    'req_timestamp': Date.now()
                };
            },
            'gamma': function (c) {
                return c.index;
            },
            'delta': function (c) {
                return {
                    'index': c.index
                };
            },
            'epsilon': function (c) {
                for (var c1 = c.index, c2 = [], c3 = Math['round'](0x5 * Math['random']()) + 0x1, c4 = Math.floor(Math['random']() * c3), c5 = 0x0; c5 < c3; c5++)
                    c2.push(c5 == c4 ? c1 : Math.round(0xa * Math['random']()));
                return c2.push(c4),
                    c2;
            },
            'zeta': function (c) {
                return Array(Math.round(0x5 * Math.random()) + 0x1).concat([c.index]);
            }
        }
    }
};
// let apiBreakers2 = {
//     type_3: {
//         value: {
//             alpha: function (c) {
//               return {
//                 x: c.x,
//                 y: (c.y + c.x) * c.x,
//                 px: c.px,
//                 py: c.py,
//               }
//             },
//             beta: function (c) {
//               return {
//                 x: c.y,
//                 y: c.x,
//                 px: c.py,
//                 py: c.px,
//               }
//             },
//             gamma: function (c) {
//               return {
//                 x: c.y + 1,
//                 y: -c.x,
//                 px: c.px,
//                 py: c.py,
//               }
//             },
//             delta: function (c) {
//               return {
//                 x: c.y + 0.25,
//                 y: c.x + 0.5,
//                 px: c.px,
//                 py: c.py,
//               }
//             },
//             epsilon: function (c) {
//               return {
//                 x: 0.5 * c.x,
//                 y: 5 * c.y,
//                 px: c.px,
//                 py: c.py,
//               }
//             },
//             zeta: function (c) {
//               return {
//                 x: c.x + 1,
//                 y: c.y + 2,
//                 px: c.px,
//                 py: c.py,
//               }
//             },
//           },
//           key: {
//             alpha: function (c) {
//               return [c.y, c.px, c.py, c.x]
//             },
//             beta: function (c) {
//               return JSON.stringify({
//                 x: c.x,
//                 y: c.y,
//                 px: c.px,
//                 py: c.py,
//               })
//             },
//             gamma: function (c) {
//               return [c.x, c.y, c.px, c.py].join(' ')
//             },
//             delta: function (c) {
//               return [1, c.x, 2, c.y, 3, c.px, 4, c.py]
//             },
//             epsilon: function (c) {
//               return {
//                 answer: {
//                   x: c.x,
//                   y: c.y,
//                   px: c.px,
//                   py: c.py,
//                 },
//               }
//             },
//             zeta: function (c) {
//               return [c.x, [c.y, [c.px, [c.py]]]]
//             },
//           },
//     },
//     type_4: {
//         value: {
//             alpha: function (c) {
//               // @ts-ignore
//               return { index: String(c.index) + 0x1 - 0x2 }
//             },
//             beta: function (c) {
//               return { index: -c.index }
//             },
//             gamma: function (c) {
//               return { index: 0x3 * (0x3 - c.index) };
//             },
//             delta: function (c) {
//               return { index: 7 * c.index }
//             },
//             epsilon: function (c) {
//               return { index: 2 * c.index }
//             },
//             zeta: function (c) {
//               return { index: c.index ? 100 / c.index : c.index }
//             },
//           },
//         key: {
//             alpha: function (c) {
//                 return [
//                     Math.round(100 * Math.random()),
//                     c.index,
//                     Math.round(100 * Math.random()),
//                 ]
//             },
//             beta: function (c) {
//                 return {
//                     size: 50 - c.index,
//                     id: c.index,
//                     limit: 10 * c.index,
//                     req_timestamp: Date.now(),
//                 }
//             },
//             gamma: function (c) {
//                 return c.index
//             },
//             delta: function (c) {
//                 return { index: c.index }
//             },
//             epsilon: function (c) {
//                 for (
//                     var
//                         arr = [],
//                         r1 = Math.round(5 * Math.random()) + 1,
//                         r2 = Math.floor(Math.random() * r1),
//                         i = 0;
//                     i < r1;
//                     i++
//                 ) {
//                     arr.push(i == r2 ? c.index : Math.round(10 * Math.random()))
//                 }
//                 return arr.push(r2), arr
//             },
//             zeta: function (c) {
//                 return Array(Math.round(5 * Math.random()) + 1).concat([ c.index ])
//             },
//         },
//     }
// };
function breakerValue(values, breakers) {
    return values.reduce((currentFunc, value) => {
        return breakers[value] ? (answer) => breakers[value](currentFunc(answer)) : currentFunc;
    }, (val) => val);
}
function tileToLoc(tile) {
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
function constructFormData(data) {
    return Object.keys(data)
        .filter((v) => data[v] !== undefined)
        .map((k) => `${k}=${encodeURIComponent(data[k])}`)
        .join("&");
}
function random() {
    return Array(32)
        .fill(0)
        .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
        .join("");
}
function getTimestamp() {
    const time = (new Date()).getTime().toString();
    const value = `${time.substring(0, 7)}00${time.substring(7, 13)}`;
    return { cookie: `timestamp=${value};path=/;secure;samesite=none`, value };
}
function getEmbedUrl(tokenData) {
    return `${tokenData.surl}/fc/assets/ec-game-core/game-core/1.12.1/standard/index.html?session=${tokenData.token}&r=${tokenData.r}&meta=${tokenData.meta}&metabgclr=${tokenData.metabgclr}&metaiconclr=${encodeURIComponent(tokenData.metaiconclr)}&maintxtclr=${encodeURIComponent(tokenData.maintxtclr)}&guitextcolor=${encodeURIComponent(tokenData.guitextcolor)}&pk=${tokenData.pk}&at=${tokenData.at}${tokenData.rid ? '&rid=' + tokenData.rid : ''}&ag=${tokenData.ag}&cdn_url=${encodeURIComponent(tokenData.cdn_url)}&lurl=${encodeURIComponent(tokenData.lurl)}&surl=${encodeURIComponent(tokenData.surl)}&smurl=${encodeURIComponent(tokenData.smurl)}&theme=default`;
}
function getBda(userAgent, pkey, surl, referer, location, canvasFp) {
    var _a;
    let fp = fingerprint_1.default.getFingerprint(canvasFp);
    let fe = fingerprint_1.default.prepareFe(fp);
    let bda = [
        { key: "api_type", value: "js" },
        { key: "p", value: 1 },
        { key: "f", value: (0, murmur_1.default)(fingerprint_1.default.prepareF(fingerprint_1.default), 31) },
        {
            key: "n",
            value: Buffer.from(Math.round(Date.now() / (1000 - 0)).toString()).toString("base64"),
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
                    "value": "58a5a04a5bef1a78fa88d5c5098bd237"
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
                    "value": "Google Chrome,Chromium,Not-A.Brand"
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
                    "value": "en-US"
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
                    "value": 1921
                },
                {
                    "key": "window_outer_height",
                    "value": 1060 - (Math.round(Math.random() * 10))
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
                    "value": false
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
                        "https://www.roblox.com",
                        "https://www.roblox.com"
                    ]
                },
                {
                    "key": "window__tree_index",
                    "value": []
                },
                {
                    "key": "window__tree_structure",
                    "value": "[[[]]]"
                },
                {
                    "key": "window__location_href",
                    "value": `${surl}/v2/${pkey}/1.4.3/enforcement.${random()}.html`
                },
                {
                    "key": "client_config__surl",
                    "value": surl || null
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
        { key: "ife_hash", value: (0, murmur_1.default)(fe.join(", "), 38) },
        { key: "cs", value: 1 },
        {
            key: "jsbd",
            value: JSON.stringify({
                HL: 3,
                DT: "",
                NWD: "false",
                DOTO: 1,
                DMTO: 1,
            }),
        },
    ];
    const enhanced_fp = (_a = bda.find((val) => val.key === "enhanced_fp")) === null || _a === void 0 ? void 0 : _a.value;
    if (enhanced_fp instanceof Array) {
        if (referer)
            enhanced_fp.push({
                "key": "document__referrer",
                "value": referer
            });
        if (location) {
            // enhanced_fp.push({
            //     "key": "window__location_href",
            //     "value": location
            // })
            enhanced_fp.push({
                "key": "client_config__sitedata_location_href",
                "value": location
            });
        }
    }
    let time = new Date().getTime() / 1000;
    let key = userAgent + Math.round(time - (time % 21600));
    let s = JSON.stringify(bda);
    let encrypted = crypt_1.default.encrypt(s, key);
    return Buffer.from(encrypted).toString("base64");
}
exports.default = {
    DEFAULT_USER_AGENT,
    tileToLoc,
    constructFormData,
    getBda,
    apiBreakers,
    apiBreakers2,
    breakerValue,
    getTimestamp,
    random,
    getEmbedUrl,
};
