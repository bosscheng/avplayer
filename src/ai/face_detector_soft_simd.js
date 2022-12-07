import { FaceDetectorBase } from './face_detector_base';
import CreateModule from '../../wasm/out/facedetector_simd';
export class FaceDetectorSoftSIMD extends FaceDetectorBase {
    constructor() {
        super(CreateModule);
    }
    ;
}
;
