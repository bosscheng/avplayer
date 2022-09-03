import EventEmitter from 'eventemitter3';
export class VideoDecoderSoftBase extends EventEmitter {
    decoderState;
    decoder;
    config;
    module;
    createModule;
    width;
    height;
    constructor(createModule) {
        super();
        this.decoderState = 'uninitialized';
        this.width = 0;
        this.height = 0;
        this.createModule = createModule;
    }
    ;
    initialize() {
        return new Promise(resolve => {
            this.createModule().then((m) => {
                this.module = m;
                this.decoder = new this.module.VideoDecoder(this);
                this.decoderState = 'initialized';
                console.log(`new video soft decoder initialize success`);
                resolve();
            });
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
        this.decoder.setCodec(this.config.videoType, this.config.extraData);
        this.decoderState = 'configured';
    }
    decode(packet) {
        if (this.decoderState !== 'configured') {
            console.warn(`the decoder not configured`);
            return;
        }
        this.decoder.decode(packet.data, packet.keyFrame, packet.pts);
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
    videoInfo(videoType, width, height) {
        this.width = width;
        this.height = height;
        let videoCodeInfo = {
            videoType,
            width: width,
            height: height
        };
        this.emit("videoCodecInfo" /* VideoCodecInfo */, videoCodeInfo);
    }
    yuvData(yuvArray, pts) {
        if (!this.module) {
            return;
        }
        let size = this.width * this.height;

        let yuvBuf = this.module.HEAPU8.subarray(yuvArray, yuvArray + size*3/2);

        let vFrame = {
            pixelType: 'I420',
            data: yuvBuf, //new Uint8Array(yuvBuf),
            width: this.width,
            height: this.height,
            pts: pts
        };
        this.emit("videoFrame" /* VideoFrame */, vFrame);
    }
    errorInfo(errormsg) {
        let err = {
            errMsg: errormsg
        };
        this.emit("error" /* Error */, err);
    }
}
;
