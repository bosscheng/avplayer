import EventEmitter from 'eventemitter3';
export class VideoDecoderHard extends EventEmitter {
    decoderState;
    constructor() {
        super();
        this.decoderState = 'configured';
    }
    ;
    initialize() {
        return new Promise(resolve => {
            resolve();
        });
    }
    state() {
        return this.decoderState;
    }
    configure(config) {
    }
    decode(packet) {
    }
    flush() {
    }
    reset() {
    }
    close() {
    }
}
;
