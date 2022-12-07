import EventEmitter from 'eventemitter3';
export class FaceDetectorBase extends EventEmitter {
    state;
    detector;
    module;
    createModule;
    constructor(createModule) {
        super();
        this.state = 'uninitialized';
        this.width = 0;
        this.height = 0;
        this.createModule = createModule;
    }
    
    initialize() {
        return new Promise(resolve => {
            this.createModule().then((m) => {
                console.log(`new face detector initialize start`);
                this.module = m;
                this.detector = new this.module.FaceDetector(this);
                this.state = 'initialized';
                console.log(`new face detector initialize success`);
                resolve();
            });
        });
    }
    state() {
        return this.state;
    }

    detect(frame) {
        if (this.state !== 'initialized') {
            console.warn(`the detector not initialized`);
            return;
        }
       
        let yuvArray = this.detector.detect(frame.data, frame.width, frame.height);
        let size = frame.width* frame.height;
        let yuvBuf = this.module.HEAPU8.subarray(yuvArray, yuvArray + size*3/2);

       return  yuvBuf
    }

    close() {
        this.removeAllListeners();
        if (this.detector) {
            this.detector.clear();
            this.detector.delete();
        }
        this.state = 'closed';
    }

}
;
