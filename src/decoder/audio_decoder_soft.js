import EventEmitter from 'eventemitter3';
import CreateModule from '../../wasm/out/audiodec';
export class AudioDecoderSoft extends EventEmitter {
    decoderState;
    decoder;
    config;
    module;
    sampleRate;
    channels;
    constructor() {
        super();
        this.decoderState = 'uninitialized';
        this.sampleRate = 0;
        this.channels = 0;
    }
    ;
    initialize() {
        return new Promise(resolve => {
            const opts = {};
            opts.print = ((text) => console.log(text));
            opts.printErr = ((text) => console.log(`[JS] ERROR: ${text}`));
            opts.onAbort = (() => console.log("[JS] FATAL: WASM ABORTED"));
            opts.postRun = ((m) => {
                this.module = m;
                this.decoder = new this.module.AudioDecoder(this);
                this.decoderState = 'initialized';
                resolve();
            });
            console.log(`audio soft decoder initialize call`);
            CreateModule(opts);
        });
    }
    state() {
        return this.decoderState;
    }
    configure(config) {
        if (this.decoderState !== 'initialized') {
            console.warn(`the decoder not initialized`);
            return;
        }
        this.config = config;
        this.decoder.setCodec(this.config.audioType, this.config.extraData);
        this.decoderState = 'configured';
    }
    decode(packet) {
        if (this.decoderState !== 'configured') {
            console.warn(`the decoder not configured`);
            return;
        }
        this.decoder.decode(packet.data, packet.pts);
    }
    flush() {
    }
    reset() {
        if (this.decoderState === 'uninitialized' || this.decoderState === 'closed') {
            return;
        }
        this.config = undefined;
        if (this.decoder) {
            this.decoder.clear();
        }
        this.decoderState = 'initialized';
    }
    close() {
        this.removeAllListeners();
        if (this.decoder) {
            this.decoder.clear();
            this.decoder.delete();
        }
        this.decoderState = 'closed';
    }
    // wasm callback function
    audioInfo(audioType, sampleRate, channels) {
        this.sampleRate = sampleRate;
        this.channels = channels;
        let audioCodeInfo = {
            audioType,
            sampleRate,
            channels,
            depth: 16
        };
        this.emit("audioCodecInfo" /* AudioCodecInfo */, audioCodeInfo);
    }
    pcmData(pcmDataArray, samples, pts) {
        if (!this.module) {
            return;
        }
        let pcmDatas = [];
        for (let i = 0; i < this.channels; i++) {
            let fp = this.module.HEAPU32[(pcmDataArray >> 2) + i] >> 2;
            pcmDatas.push(Float32Array.of(...this.module.HEAPF32.subarray(fp, fp + samples)));
        }
        let aFrame = {
            datas: pcmDatas,
            sampleNum: samples,
            channles: this.channels,
            pts: pts,
        };
        this.emit("audioFrame" /* AudioFrame */, aFrame);
    }
    errorInfo(errormsg) {
        let err = {
            errMsg: errormsg
        };
        this.emit("error" /* Error */, err);
    }
}
;
