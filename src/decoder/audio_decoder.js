import EventEmitter from 'eventemitter3';
import { AudioDecoderSoft } from './audio_decoder_soft';
export class AudioDecoder extends EventEmitter {
    decoder;
    constructor(adtype) {
        super();
        if (adtype === 'soft') {
            this.decoder = new AudioDecoderSoft();
        }
        else if (adtype === 'auto') {
            this.decoder = new AudioDecoderSoft();
        }
        else {
            throw new Error(`Audio type [${adtype}] not support`);
        }
        this.decoder.on("audioCodecInfo" /* AudioCodecInfo */, (codecinfo) => {
            this.emit("audioCodecInfo" /* AudioCodecInfo */, codecinfo);
        });
        this.decoder.on("audioFrame" /* AudioFrame */, (AudioFrame) => {
            this.emit("audioFrame" /* AudioFrame */, AudioFrame);
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
