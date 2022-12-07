import { FaceDetectorBase } from './face_detector_base';
import CreateModule from '../../wasm/out/facedetector';
export class FaceDetectorSoft extends FaceDetectorBase {
    constructor() {
        super(CreateModule);
    }
    ;
}
;
