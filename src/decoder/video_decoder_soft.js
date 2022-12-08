import { VideoDecoderSoftBase } from './video_decoder_soft_base';
import CreateModule from '../../wasm/out/videodec';
export class VideoDecoderSoft extends VideoDecoderSoftBase {
    constructor() {
        super(CreateModule);
    }
    ;
}
;
