"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fingerprint_1 = require("./fingerprint");
const murmur_1 = require("./murmur");
const crypt_1 = require("./crypt");
const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";
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
function getBda(userAgent) {
    let fp = fingerprint_1.default.getFingerprint();
    let fe = fingerprint_1.default.prepareFe(fp);
    let bda = [
        { key: "fe", value: fe },
        { key: "ife_hash", value: (0, murmur_1.default)(fe.join(", "), 38) },
        { key: "api_type", value: "js" },
        { key: "p", value: 1 },
        { key: "f", value: (0, murmur_1.default)(fingerprint_1.default.prepareF(fingerprint_1.default), 31) },
        {
            key: "n",
            value: Buffer.from(Math.round(Date.now() / (1000 - 0)).toString()).toString("base64"),
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
                    "value": "c96a5728a321427881c51f4c17406cc2"
                },
                {
                    "key": "user_agent_data_brands",
                    "value": "Google Chrome,Not)A;Brand,Chromium"
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
                    "value": 1920
                },
                {
                    "key": "window_inner_height",
                    "value": 1089
                },
                {
                    "key": "window_outer_width",
                    "value": 1912
                },
                {
                    "key": "window_outer_height",
                    "value": 1152
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
                    "value": true,
                    "key": "navigator_battery_charging"
                },
                {
                    "key": "audio_fingerprint",
                    "value": "124.04347527516074"
                }
            ]
        },
    ];
    let time = new Date().getTime() / 1000;
    let key = userAgent + Math.round(time - (time % 21600));
    let s = JSON.stringify(bda);
    return "eyJjdCI6InMxYnNWd08rYWxPK1lzNGtPM2hIbWMybFFNL2NTNWlLUEFwRUdRMVVxUjNIdFVqRitOR3duOTVBdmlFT0h5dy9mbHllR1NodnZKalJ4YXhmSXVRSHo5QktPeXZXNDA4a3p4azRpTnJyQVc4WUczckpzMlptOWRWbjY0dDh2aW0rTzJrNHZzOEpiVG9nc2s1VmN5WlUrenZZU0R2bEdSYmNNdkcxTXFkWmpQZWxBWmVMYWFzejlBT21ySUdrMW5reCtuM2JrSW9GejBDSWk5UDZTcEV2MW1KbVBHNWN2MExoNGdSMFJaZlVQK01Hcmc4NHdqNGcxNHZqMTVSUGc4ZTJLeUNuYUlpdnpKSDQ3OHQzMFJlUzRzenBSdGtqRGxJZnRhMERWNzRuSllWM2lXMENkZnRFYlRJQlk0YzErcnFicitiY0pBMlFTN0pFOHhZVDl2SUZORW9SSHJsV0UydTVEeW4rZUNwVnMvSUdNeUhxcXpnZWpKVG85NGFoYTg2T2FGeU1Gb3hMV3ZhKzlLU3JkOWNBRzAxOFlHS20zQXAvSXhOTktBM2Rvb1p1RWJKR0ZocGJrMWQ3bFovY0xadW5rWE1LMmxra1p6K3BMQ2F0NFF4bW81NnBtUk0xa2VoUmE4WmtxWUx2dW5EYUJBRWtXOEJJaTMxbnNTRnBEdUVVQWdmTGVkNXQwUVk1V1lsQ3gzaWt1cXdkMGhsbFVvTExSc0tWUGkzb2w3QVRrdXdDOWRvczJOcTdkb3Y1Vk1kME9xN2J2YXBOVWhIbkh6aytId0ptMG84SmVwSW5XcnB6cmhkUTZkemk3T2x1ZURlSmZnUTY0OTVqOGRHa0ZFYUhnOUl0ZVRGMkR6dVFtZmhPUEIzWFNrUjhtZ0NpcjluM1pjYXBnalhKSWFncXNBMGdzYU81K1dicDE4d2xvWUxZeG1tVm9sR3MydmI5TkNPR0VuNHpnWmpXSlJFTUtnamo3SVVHU01mZU15RXBRS21oRkdKTjZ0ZWxXQ0toNzR5WGZwU1VGbkluajEzZmpHNWY4aTYxVnZDOGw4Y2lZcjdXL3ZQVVYrazJ3YWVuNVpSeHNKWFNNbkVqR1B6OWhrQkZUZWp5Mi90TUcrS3V2MFplandubXE0NVNrYkVkM3NqTzRZbWh6SHhkcVNSODIwOVlVZ3ovL0pKTkJFUUhlL2ZMT3AzZUdSbjJOSjZjY2Vnc25lOUl5dkx6SnM1aVpkQ09iVTNqKzFOSmRLMzNldVlWT2Z3TEJOVDQ1TzQ5cW82KzFOQTZLbWVLWm0vYTJkQjNDeGIxV3VBUFdwSnFWdFVQRVN1M0xRMnl0dzl2bFRUU1p2U3p4dlBFQmY2aExnZklMT0kxeDF6SEN4ZHM0bWJRV0NrLzZPa2kyMk9qcHBST1VOOEcyZWRlVGF0UnJlNXNDVWdFNjlKTDdtSGc2SklHK2JOSkJma3YyN3dBUzJxekVtZHhBSHhML2hvSkRnV3Vmanh6ZFdDTHk3RUY3dGs5TkJ2RXEyb2hpQXV5SWRQZEl4UlIwUjQxS3pKeFZPaHlyWHVyNFhsN3BlOGljZTFtL01jS0N0Ty9VSlJzY2QvSmZVVWdzMG1BdWQzVE1DNGdpTVMvU0RYS0tUeUxzM3ZGZ0pkR0lTcXFiOHduVjNxOHFzenZ0Q3dJOXFpZGF2VWdtUnhHUWFEaERIMWVBSW5yVXdsNW1rMk9uZ1VlWDBXb3dXbU9UdGpQZkhPN2lBVjhHQXNyZ1ZEQ3JYa0g0WWdpR0wxdU9meSs0eE03T0ZVbmlQRncyTEJXZS9EdE5SMjcvRkNwR0VXZ2JONDhib0FlMDc2Z2JmSk1EdjN5QWZNNDM4Q2lkT2ovb1Z1UHBuNmdmVWdDRitCRmFWSys0cW40S1RCMkhkVys4NkQyOGpxQ096enpjMEpWMVp1TTFmZWJUR2srYkhRU2VYZWNIMld5SDBFYW5acTE5YmVsWEwyeTZxaFpwSGtRbDNHZmh0algzVVZ3dGVjQjJlL1NJR0FybVUvWHppazluNFhUWWtkcTFaOTJzZ2czc2h3UVpkT0tiMEpwTGNPOEl0VnUxLzNPZVovUU1GTjJNcnE5MkY3dm05VUQ2bHJBRnYyVC9Rd3JkVTRpQVVDelRKR2tqU2p2WlBDOWYwbE1jYVAvZ3NJWFpCcFR0UjY5VU9VcWtKS2NWMFFHV0RFRzZqYlRHVXVrcGhEOVIwVUtVc3IxN2VWaDBDenE3bTNpZjVWdHYzZFB4ZFpGamtmM1FHc2o4RUt4Z0N2cXFPZlIxU2dwVmFFQ2RpSW5KUnNINVgzcjc2a2UxdHVsQUJwVkhMVFcveEphbWFmYTdCWGFxdVVJcitXWGhRTXB1eUVFQkRXYVFwVWdpZ2lvUlFKQk1sOW5oREhtb0lNOCtDMmp5OEpFaUFwNGtTdmNPTThOZUVpaU9zWVRJS0o1aDRZQVdza3l2NlluelVLSnkreW5VMzQ1ZlgzSzhjMlFlUEhncTRmQkQxaW1ZS2FGaENBb1NVNGF0YTc5NnZtcGh1UjIwblZ2S2FoRHlyM2VtZUkxbzdDbEhzYVR1ejRyczJLMjBuZjVYQnVQVVZuZjY5dGhpVVRLUHpwWXVoR1JNZjBDNStVaGJQb1diekJoaTV4Ty8vbTdDSWxpQWYzdUc5Tm53M2pwMWdwZWd2TXNUdzNTZGIzcWNDc2h1MVpUYXJxS2pkVUdZU0JORGlsZ1ZWRkZnRUcwMFhCYkdZOHFJekNrY2J0MUJIMWxUeXV5ODZPNFdsUjB6VW9lVDg5YVh5S08yQnhZNXdsaWM1bFZmVE5nNmticU1iOGxGR01iNjBicE03cUhLU080bmRiZ3FYbWVOWEZIcmNzTXpsWURvUmJBRVVpa3c0M0xERHlMMUhIS1VUVm9DVVEzNjZXQm9URmdoK1p4VDZ5THpwODhYMkM0Z1JIcnhuRGk0d1ZScm1Kajl5Zk5PNTZYczg5azEyck4ySlArNmFuZ21oYXJmRDJCaERSU0RUYjE4YjBXeWt1M3ZyQks0RVorOW9sT3BXS1YzVmtnVE9qMVpHbTRhNk4vK0hpL21CeEtjeEx5UXBFMDVDTTE2WW9vOVR5bTFGeFAvRWVMWmsyV3pkZVpreFBmMkJ4STl1S1NUcWVrckFZdG5tMWR6NVBmMU4wSG4vUWtVMlgzdWtOODNxSE1YNkJFYTFPQzIyem1ZMm12S0NrWVpMNFV0cUw1MFhOQUUxZVZzeUZDWlpvUnlETVU5anlpZVZrWlFwRDFJL3AxTVFzREZETjVNWk1JWno5K1YzUlNzUG9lVkIrNDBIeDhONmpUUkpjY2owd0t3OVRQNlNZWUdyakV0UDJqdVZMUWVob3pFTVBjdGVjdGFZajRTL0xuVFMyYWNvanhBdFpvTTU3UnIxUkRvY3ZNeGdHNXU2V1F6NzE1a3Z1S2V5SmZaNUJGc1lmak9qYnFndlY3RmFjbDVkaDU1OEtrR1ZJb3kwemRmd2NuU3NvYWkrR1RmWTRiUDVhanFKdHRYdk5hNUF1cXcrbjZZazJPY0x2elZlTkJIeFFtQ0lxZTNWYjM1cjFPWElVek9FdURka3pHRWdJMmhuK1JTbFNtWFg4QkRIL3E4aUJBTVRqQjhzQVJLb3hLem13cjFhbU5iR3pPdjVJdk9ucUdMVzl0ZTdLZEFkbW5vRE1sSm5sQ2p4S1BMbkMvMytKd3NqQ2FzZ1llMUtjV0hRQzdnMUZoL2MvelBJN0xyd0JQRXFLTkloZWZlMXJrZVl1RStXbFpScE5hZlhJZ3U4ekw2WE55N3pyOWh1cWZXTTluVXRwN1hkV2t1aTF6VlpOelgwRTlCaUVMdkhCaDFXVGRlZ0ZzakVBUnpjNWtaYlNyd0dkK21sZGhQOXZmSlA4OEsvd0x5WnpLVEVMVklhK3RVcVZuZlZRV3hXWVhsNTJiYTcwM1Nod2NuMm12YlByU2QvbkNxL1AwUHozdzBjKysyN2RUK2x5QVVrSC9yZUt2c0VocmM0WVVKRnlCcmZaRDl1L0dhenRjaHFJZDZuNTJidkJzbmRCaHJ3elNMQzhmS3U0b2xrc05vdVAzSnhkQ0dLVXpQYTRoVFE0OVIvbzZoVS9XbjY5VVFocU52NGwvTi82d3FpZGcrRWlWa2MySkk2dWVWajZzRGdGSzZZUXVsNkF4N0FjOUV6SFg5UmpRSThRYVlzRFVERWlYZ3Yrd1YyWmtzaS8rMkM0Sm5xaHpJZjJ2Ym9hUU9IeitwSi9QZ01EZ1czZG5WQnFqNW83WnRGcHJ4VWFTeVVOaG1pNlVNcGtCVG5reTVLTG1ESldiVFhDSEc5N2lVTm9jMWpnblpTSS9ZU2NCUmhENE9hRDA0YUlpbjZQWEJlYmg4VGFjOVVWcnZZdjZ5VlFocmJRdlJjK2tiNHlFV1pXZi9yOXlGY0lmdmRkZmlJcHIwS3V2OHpZOFBLVmY4USsrcHFRT0RHTWgwVkkybytLVy9td2QzVHdEdzdhVG1jUnFvcWZjSG0vNXI3dUU0UFp0Nm0rN3hjMWdoa2Q0RjBIQWVsTVh6SENiZnZUUElIU1BpRXFWdjFmeW5iU1Vsd0VJcDJIc3lqUklySGt4TkxtQTM3TFBVR1BGYmtDWVhWMnZhSUI4dC8xQXpJMGRMdFpNeUxKUnpuL3pZMVZVWFZjZy9hY1dzVEVveDNSUzhOdHhGTndiSHJObmcwcEc4TnIzZ3JCVWhhdm50d1V0UW5GWklPMHp4VXhkOW1aaGhUSEVKOVgvKzJTYmkzTDlwZ3NnUzhjOGpWMU5IYlQ4ZENxQXBOSCtUVmkvQ3BXY3FoRWI4TmUvbzl0UzNpb2lGN2E3QXVZV0kwWXAvVTlvUENxaGpHNUNmSzBXamJhQXFJSms2Qkcvblo4cDBFbGRBZkZ6QkhGYW5HMTFlZVc5K0dDc1RCV21MT015MXZvakdTYUE2bitGbEZqQjhndjY3WmM1UUZZK0wrdHdZQmphVjAyN2w1ZHdaeWlnUkYxNDFBOEhyRnVsNWdsUlh0ZGp2R2xwcXRsWEcrYXVraERmVEgxOHF1aGU0NFh0T1JQUW43MXFHUHJEdytmMFgwMXFZcjVKRzZkbytWdzJHbkdxcmhiTkZrOUgzcWdncmdjQTBOY2pBYkNkd3I5UHV0Y1dDNWpvZ3ZPVzZvZVpwRVRNcUNNek9jcDJxS2tsUzdER0o2eGlhUWNndjFpMmkrc0VwbFZvS0hhZUNuYmZZaEp4V3RMSFMrOVduK0JLS095a2ZveHEyZkR2d1o5ZUE0WFZnYjBtbnVuSjMzNXQ3UVMwYnAzMzJjd2RHSU5vWmJvMGltdWV4Sk1obk5vOVl1Z0NiQVpjS1FmZ1VFeVRLd2ZjVUtHMTBqeW1TTXlQNnRnSWREbzRQR0RSeUgvc2NObDduL0J6VFVQU0NsMmNYU2svOXhSckVDclkrNzNJSUxIV21sRTZpSHNxTzc0NFJQOWxkWFlYNlpwaUlRVGphZXh2WGh3MjVyRUQxQjJOc1hBZmplckZBdGQrcUlnU21JZWJ3ODJjb3VYNXlPd0NDbmYzTzhtZ054VURTcVRyczNXZnpEcVRSZXcrZ0tYSzhIR01TaTNNazE0dlpBcTNVYzhZdTBzWW1aNXRHL0JoUXJYVThJWWFmYlpmVGI4OXdhODQxeTk0ZHdlZURicHZhTW5Pa0hoa0NRZHBCVzZFLzc3dFZncVYySGR4QmphQ1E5c3V3dGFuUDJTYm05dW1pZTU0eHRQdVA2ekcwWjY1OW4wbTNPQncwdTdOaEtBbnVZY3dPTWdZd1F0ODhKWi9EbEF0M1JvMy9wdklxTTNkaXRjT2cwbm1tOGhaSWJDckRvWVp3M093a2VPMHpUR0FxM0s4NGFYQ1NWSTJpREZrZ3pYOGw2UTRUT1F0SWpVMGViTWsxSkVyZkdjVVVZSEUwN3V4YWpKRHBucDBjMjZvRkxmcDE0VndpYkNHeDQ1Si84MjE0SDI3b0g2cnk4QWRZM090RjBGLytqRzRNbzBaTXhjWTNmK2RQNUtDeThoQ3lVUUNYU08yRUw5UVNlWmNhYlQ3aWc3OUZvVis3N3doclVoV0FFQmk5TU0zdFlYc29KeWJicnkwQ25PT1NEV2RoMVhwWGhTeEpaemh6TjFjUlNCbnhBQUNpeldkU0tBcms0bGZBTEpiMGpwLzJBOTRXYUdESkFZbU1vQnhKdExFMG1wd3N1RkNUOVd3UVMwdU1KNWQ3Y1gralkwR3RYcVNibDdnQ0wxK1lMUkRycFR3Um5OVXpxMFBVMzNCaDBZazdCRnJNSTVSZVVmRFBXMjZRNnFZUjZNS0FlWHRsNi94WDJQWXcydHlkR0lEdjRIRVh4dWo0cmp5MlgwcVU0L01ZT2t6Y3VoN0FlQnZMZlB4UDNsRzhFUWlrYXVrRVE1N0JmUm96Y2pNU3c1b29FTjJ3UkxnRGI2NzVtNDBrWHNoVktTUnh5bjByUVNBdDRseUZydnV5T1FobGU5M25IY2NBK0NjL3VObm1SKys2UCtDK2M5YjZTMm5wdEpRYkxLM0ZoakJxWWRFN0p1QXhrRjhMb0xRdHc5OXYxYjVNYXI3UGF6YjBHV2ZqOURjczBnRmU1RTV1VlJxc2QxcGNTcGVPemkyeDk4Y2JXSnZ5amVCSE9NSTh0T093K0lnUTR0SlJQclNheFFrRzduRmV4WjFEeUdKdEQzcjlQWVZOSGdSTDFBK0Ftd3d6R1FqWTAwbnRjYlNNMXBSME1iaGk5OERRTVZDSXJVNTlzeU9BdGhEcE1vNGlMc21xVkFqUTVxaE5QWlBNdWMrRFZxRTlOSkJvRzBkOEdkMVVnOFZMeGxXRE8wdFdzK3hGZW5GV21vSUhUWStkWGJZVC9RMDA3U3ZUQWRNMmhqWmJDRnVEd1d2OXlwbDNrM213dEI2Zm5yS0x2MWdVTGkybTk4YTJ5NVRpdDMwUmR4d093RUhXQ0NCdk5BbWtYU3g1QktCUUJHL0VUVHgvVEF6d3VDQTVlYitRQjM2WTd6QUpyWkZRSjFwR0ttOGRwY1ZrSVdNL2xNUWZFNDBVRzYyVFdLVGU1akpLU2lCQUZoYk1SM0JNNWdUQ2Z2VUVEQTFFdFNDVkcvcXhzZm5ZZG95RnNBQVc0eFhrc0p4eUdlRTNqd2x4aTRVV0doTDU3WGpoampETi80Z3VLb0tCOEFHOWhNZnlTenZHWWxYenRtT3FLREs0bktqalB4V2ZQOTIrL1MyS2ZDY1UzekkxLzhCWXdaQ2luM0p4S25TUE9oeHJvbmNzdmNZcFNTSDZCaWFKcDM3OGE0UzJ1TGZ2bzl5ZktqNzFtL0k0TGMzMVJqNkhaTkRMNTVUUEtmM0puWE5mS1FRK0M3dHpUK2NaVStSc1VsYWJkVEg4ZXozTGJjZ2pCZURxUUc3QmJKaGpvbzhlcU1lazJGdk5laS9ScXpjVzBQN2dDRW5BTlovYWl3Zm15Ry95bHltNHNNNi9ydjFXbXVPZ2JvZFAzM3NjUjBmNFdZSmczWWUyWm4rK0xnUFovd3ZlZGVVVGh4TVFlTTg2dklYQjlTWTVveXI1MzNpRVpKM3YxbkRYSi9ON0E5TytwYi9qUGtYOWhJSER2WnMzaUFsaUFXWHZEUWNxV3F5K1JHNUJ1RmllWS80NFRSVjdJNE5lUXpiNHlEZTBmeitCRW5KU3lzbTlmUkNtazlnakw5cGNiMEtvYUZMcUdlamxlSHNxNlhhNnNDbHVHaGI4Q0xtYWY0Y3FiZVAyZzYwUTFEbUNJUkEyamZhVFYvSGFrRFlyV245K3cvbS9RSXRUMlJ5MHBWVGpySUUyaStQcUNtTW1LclV0WnlmKzFLUGJQK0hWcGZPeVBQbnAvOCtVcC9ydis1d3NDVWRPQ1l4YXRLUHl4cnA5SGxzbmcydzljYWI2U2N3TFgya2JlcmRrblNUb2F3NEp2V3pic240M2pNUjZIbjdCNExiVUlkTEpTUmlCcHhWSUdaNmJEd2Q5V0dCTnZMQUFXN01OSUhwcGcrMndkek9vWnhIY3dIOEhEQXJ1NkF6elpsNEppbzFiNURGUlFJWllVZjhPaThNa05SWlF5ZkNoMUpQeUZvOXNkNWJPdW9mM2FsSHQ0em5OcGJIRTBEdmttV3k0d3BGKzNTOE0vOG9ZbjUvd0VONEJQNlhGME1SNExxQU9zNzlZOXdmY3lBQU5BclVUTHlhWUw5Vm1QYkFrQkdxeHpiZEhsU2NDeEJ3RHg1UGYyc2RuSjdrYmpRdm1uUHZleGxNa3lPcjVKeTdBSU5DS1NzSjhnLzE1K004OTZPeVUzSjgyWHVjVFR1QUpPVUlhRWNJYWV1Wml5c0JWMHNQVzVlc2dZT1VDUzR5b0w2eXdLK1MxRjlBMGFjS3JoQ3Bqa2hMMlpaV29rbjVta2ZQdmdOeG1jalpsc1FoVHl6WW0xYllaYTg9IiwiaXYiOiJjMjUwODU4YjY1ODFlMjFiNTk4Y2MzNzQxZGY0OGEwYiIsInMiOiJiZDJhNDgwYzcwMmY2NGE4In0==";
    let encrypted = crypt_1.default.encrypt(s, key);
    return Buffer.from(encrypted).toString("base64");
}
exports.default = {
    DEFAULT_USER_AGENT,
    tileToLoc,
    constructFormData,
    getBda,
    apiBreakers,
};
