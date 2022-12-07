import EventEmitter from 'eventemitter3';
import { FaceDetectorSoft } from './face_detector_soft';
import { FaceDetectorSoftSIMD } from './face_detector_soft_simd';
import { FaceDetectorSoftSIMDMT } from './face_detector_soft_simd_mt';

export class FaceDetector extends EventEmitter {
    detector;
    constructor(type) {
        super();
        if (type === 'soft') {
            this.detector = new FaceDetectorSoft();
        }else if (type === 'soft-simd') {
            this.detector = new FaceDetectorSoftSIMD();
        }
        else if (type === 'soft-simd-mt') {
            this.detector = new FaceDetectorSoftSIMDMT();
        }
        else if (type === 'auto') {
            this.detector = new FaceDetectorSoft();
        }
        else {
            throw new Error(`detector type [${type}] not support`);
        }
    }
    ;
    initialize() {
        return this.detector.initialize();
    }
    state() {
        return this.detector.state();
    }

    detect(frame) {
       return this.detector.detect(frame);
    }
    close() {
        this.detector.close();
        this.removeAllListeners();
    }
}
;
