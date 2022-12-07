import { FaceDetectorBase } from './face_detector_base';
import CreateModule from '../../wasm/out/facedetector_simd_mt';
export class FaceDetectorSoftSIMDMT extends FaceDetectorBase {
    constructor() {
        super(CreateModule);
    }
    ;
}
;
