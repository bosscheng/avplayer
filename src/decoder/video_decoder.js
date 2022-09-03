import EventEmitter from 'eventemitter3';
import { VideoDecoderSoft } from './video_decoder_soft';
import { VideoDecoderSoftSIMD } from './video_decoder_soft_simd';
import { VideoDecoderHard } from './video_decoder_hard';
export class VideoDecoder extends EventEmitter {
    decoder;
    constructor(vdtype) {
        super();
        if (vdtype === 'soft') {
            this.decoder = new VideoDecoderSoft();
        }
        else if (vdtype === 'soft-simd') {
            this.decoder = new VideoDecoderSoftSIMD();
        }
        else if (vdtype === 'hard') {
            this.decoder = new VideoDecoderHard();
        }
        else if (vdtype === 'auto') {
            this.decoder = new VideoDecoderSoft();
        }
        else {
            throw new Error(`video type [${vdtype}] not support`);
        }
        this.decoder.on("videoCodecInfo" /* VideoCodecInfo */, (codecinfo) => {
            this.emit("videoCodecInfo" /* VideoCodecInfo */, codecinfo);
        });
        this.decoder.on("videoFrame" /* VideoFrame */, (videoFrame) => {
            this.emit("videoFrame" /* VideoFrame */, videoFrame);
        });
        this.decoder.on("error" /* Error */, (error) => {
            this.emit("error" /* Error */, error);
        });
    }
    ;
    initialize() {
        return this.decoder.initialize();
    }
    state() {
        return this.decoder.state();
    }
    configure(config) {
        this.decoder.configure(config);
    }
    decode(packet) {
        this.decoder.decode(packet);
    }
    flush() {
        this.decoder.flush();
    }
    reset() {
        this.decoder.reset();
    }
    close() {
        this.decoder.close();
        this.removeAllListeners();
    }
}
;
