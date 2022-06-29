import fingerprint from "./fingerprint";
import murmur from "./murmur";
import crypt from "./crypt";

const DEFAULT_USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

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

function getBda(userAgent: string): string {
    let fp = fingerprint.getFingerprint();
    let fe = fingerprint.prepareFe(fp);

    let bda = [
        { key: "fe", value: fe },
        { key: "ife_hash", value: murmur(fe.join(", "), 38) },
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
        { key: "cs", value: 1 },
        {
            key: "jsbd",
            value: JSON.stringify({
                HL: 3,
                NCE: true,
                DT: "Roblox",
                NWD: "false",
                DA: null,
                DR: null,
                DMT: 19,
                DO: null,
                DOT: 19,
            }),
        },
        {
            key: "enhanced_fp",
            value: [
                {
                    key: "webgl_extensions",
                    value: "ANGLE_instanced_arrays;EXT_blend_minmax;EXT_color_buffer_half_float;EXT_disjoint_timer_query;EXT_float_blend;EXT_frag_depth;EXT_shader_texture_lod;EXT_texture_compression_bptc;EXT_texture_compression_rgtc;EXT_texture_filter_anisotropic;WEBKIT_EXT_texture_filter_anisotropic;EXT_sRGB;KHR_parallel_shader_compile;OES_element_index_uint;OES_fbo_render_mipmap;OES_standard_derivatives;OES_texture_float;OES_texture_float_linear;OES_texture_half_float;OES_texture_half_float_linear;OES_vertex_array_object;WEBGL_color_buffer_float;WEBGL_compressed_texture_s3tc;WEBKIT_WEBGL_compressed_texture_s3tc;WEBGL_compressed_texture_s3tc_srgb;WEBGL_debug_renderer_info;WEBGL_debug_shaders;WEBGL_depth_texture;WEBKIT_WEBGL_depth_texture;WEBGL_draw_buffers;WEBGL_lose_context;WEBKIT_WEBGL_lose_context;WEBGL_multi_draw",
                },
                {
                    key: "webgl_extensions_hash",
                    value: "5e287cfa20ad57f8652f0b2320f0de21",
                },
                {
                    key: "webgl_renderer",
                    value: "WebKit WebGL",
                },
                {
                    key: "webgl_vendor",
                    value: "WebKit",
                },
                {
                    key: "webgl_version",
                    value: "WebGL 1.0 (OpenGL ES 2.0 Chromium)",
                },
                {
                    key: "webgl_shading_language_version",
                    value: "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)",
                },
                {
                    key: "webgl_aliased_line_width_range",
                    value: "[1, 1]",
                },
                {
                    key: "webgl_aliased_point_size_range",
                    value: "[1, 1024]",
                },
                {
                    key: "webgl_antialiasing",
                    value: "yes",
                },
                {
                    key: "webgl_bits",
                    value: "8,8,24,8,8,0",
                },
                {
                    key: "webgl_max_params",
                    value: "16,32,16384,1024,16384,16,16384,30,16,16,4095",
                },
                {
                    key: "webgl_max_viewport_dims",
                    value: "[32767, 32767]",
                },
                {
                    key: "webgl_unmasked_vendor",
                    value: "Google Inc. (NVIDIA)",
                },
                {
                    key: "webgl_unmasked_renderer",
                    value: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)",
                },
                {
                    key: "webgl_vsf_params",
                    value: "23,127,127,23,127,127,23,127,127",
                },
                {
                    key: "webgl_vsi_params",
                    value: "0,31,30,0,31,30,0,31,30",
                },
                {
                    key: "webgl_fsf_params",
                    value: "23,127,127,23,127,127,23,127,127",
                },
                {
                    key: "webgl_fsi_params",
                    value: "0,31,30,0,31,30,0,31,30",
                },
                {
                    key: "webgl_hash_webgl",
                    value: "65a254f1dbbdf598c0cb879b6d679648",
                },
                {
                    key: "user_agent_data_brands",
                    value: " Not A;Brand,Chromium,Google Chrome",
                },
                {
                    key: "user_agent_data_mobile",
                    value: false,
                },
                {
                    key: "navigator_connection_downlink",
                    value: 10,
                },
                {
                    key: "navigator_connection_downlink_max",
                    value: null,
                },
                {
                    key: "network_info_rtt",
                    value: 50,
                },
                {
                    key: "network_info_save_data",
                    value: false,
                },
                {
                    key: "network_info_rtt_type",
                    value: null,
                },
                {
                    key: "screen_pixel_depth",
                    value: 24,
                },
                {
                    key: "navigator_device_memory",
                    value: 8,
                },
                {
                    key: "navigator_languages",
                    value: "en-US,fr,fr-FR,en,nl",
                },
                {
                    key: "window_inner_width",
                    value: 2195,
                },
                {
                    key: "window_inner_height",
                    value: 1124,
                },
                {
                    key: "window_outer_width",
                    value: 2195,
                },
                {
                    key: "window_outer_height",
                    value: 1195,
                },
                {
                    key: "browser_detection_firefox",
                    value: false,
                },
                {
                    key: "browser_detection_brave",
                    value: false,
                },
                {
                    key: "audio_codecs",
                    value: '{"ogg":"probably","mp3":"probably","wav":"probably","m4a":"maybe","aac":"probably"}',
                },
                {
                    key: "video_codecs",
                    value: '{"ogg":"probably","h264":"probably","webm":"probably","mpeg4v":"","mpeg4a":"","theora":""}',
                },
                {
                    key: "media_query_dark_mode",
                    value: true,
                },
                {
                    key: "headless_browser_phantom",
                    value: false,
                },
                {
                    key: "headless_browser_selenium",
                    value: false,
                },
                {
                    key: "headless_browser_nightmare_js",
                    value: false,
                },
                {
                    key: "navigator_battery_charging",
                    value: true,
                },
                {
                    key: "audio_fingerprint",
                    value: "124.04347527516074",
                },
            ],
        },
    ];

    let time = new Date().getTime() / 1000;
    let key = userAgent + Math.round(time - (time % 21600));

    let s = JSON.stringify(bda);
    let encrypted = crypt.encrypt(s, key);
    return Buffer.from(JSON.stringify(encrypted)).toString("base64");
}

export default {
    DEFAULT_USER_AGENT,
    tileToLoc,
    constructFormData,
    getBda,
    apiBreakers,
};
