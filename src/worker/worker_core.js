
// import decModule from './decoder/decoder'
// import decSIMDModule from './decoder/decoder_simd'

import {WORKER_SEND_TYPE, WORKER_EVENT_TYPE} from '../constant';
import { AVPacket } from '../utils/av';
import { AVType } from '../constant';
import SpliteBuffer from '../utils/splitebuffer';
import { caculateSamplesPerPacket } from '../utils';
import Logger from '../utils/logger.js';
import FLVDemuxer from '../demuxer/flvdemuxer.js';
import FetchStream from '../stream/fetchstream.js';
import JitterBuffer from './jitterbuffer';


class WorkerCore {

    _vDecoder = undefined;
    _aDecoder = undefined;

    _width = 0;
    _height = 0;

    _sampleRate = 0;
    _channels = 0;
    _samplesPerPacket = 0;

    _options = undefined;

    _gop = [];

    _lastStatTs = undefined;

    _useSpliteBuffer = false;
    _spliteBuffer = undefined;

    _logger = undefined;

    _demuxer = undefined;
    _stream = undefined;

    _vframerate = 0;
    _vbitrate = 0;
    _aframerate = 0;
    _abitrate = 0;
    _yuvframerate = 0;
    _yuvbitrate = 0;
    _pcmframerate = 0;
    _pcmbitrate = 0;


    _statsec = 1;

    _lastts;
    _curpts;

    _Module = undefined;

    _jitterBuffer = undefined;


    constructor(options, Module) {

        this._Module = Module;

        this._vDecoder = new this._Module.VideoDecoder(this);
        this._aDecoder = new this._Module.AudioDecoder(this);

        this._options = options;

        this._logger = new Logger();
    //    this._logger.setLogEnable(true);

        this._demuxer = new FLVDemuxer(this);     // demux stream to h264/h265 aac/pcmu/pcma
        this._stream = new FetchStream(this); //get strem from remote
        this._jitterBuffer = new JitterBuffer(this);

        this.registerEvents();

        this._stream.start();


        this._lastStatTs = new Date().getTime();
        this._stattimer = setInterval(() => {
                let now = new Date().getTime();
                let diff = (now - this._lastStatTs)/1000;
                this._lastStatTs = now;
                    
                this._logger.info('WCSTAT', `------ WORKER CORE STAT ${diff} ---------
                video gen framerate:${this._vframerate/diff} bitrate:${this._vbitrate*8/diff/1024/1024}M
                audio gen framerate:${this._aframerate/diff} bitrate:${this._abitrate*8/diff}
                yuv   gen framerate:${this._yuvframerate/diff} bitrate:${this._yuvbitrate*8/diff}
                pcm   gen framerate:${this._pcmframerate/diff} bitrate:${this._pcmbitrate*8/diff}
                `);

                this._vframerate = 0;
                this._vbitrate = 0;
                this._aframerate = 0;
                this._abitrate = 0;

                this._yuvframerate = 0;
                this._yuvbitrate = 0;
                this._pcmframerate = 0;
                this._pcmbitrate = 0;

            }, this._statsec*1000);



    }

    registerEvents() {

        this._logger.info('WorkerCore', `now play ${this._options.url}`);

        this._stream.on('finish', () => {

        });

        this._stream.on('retry', () => {

            this.reset();
            postMessage({cmd: WORKER_EVENT_TYPE.reseted});

        });

        this._stream.on('data', (data) => {

            this._demuxer.dispatch(data);

        });

        this._demuxer.on('videoinfo', (videoinfo) => {

            this._logger.info('WorkerCore', `demux video info vtype:${videoinfo.vtype} width:${videoinfo.width} hight:${videoinfo.height}`);


            this._vDecoder.setCodec(videoinfo.vtype, videoinfo.extradata);
        })

        this._demuxer.on('audioinfo', (audioinfo) => {


            this._logger.info('WorkerCore', `demux audio info atype:${audioinfo.atype} sample:${audioinfo.sample} channels:${audioinfo.channels} depth:${audioinfo.depth} aacprofile:${audioinfo.profile}`);

            this._aDecoder.setCodec(audioinfo.atype, audioinfo.extradata);

        })

        this._demuxer.on('videodata', (packet) => {

            this._vframerate++;
            this._vbitrate += packet.payload.length;


            packet.timestamp = this.adjustTime(packet.timestamp);

            this._jitterBuffer.pushVideo(packet);

        })

        this._demuxer.on('audiodata', (packet) => {

            this._aframerate++;
            this._abitrate += packet.payload.length;

            packet.timestamp = this.adjustTime(packet.timestamp);

            this._jitterBuffer.pushAudio(packet);
        })

        this._jitterBuffer.on('videopacket', (packet) => {

            this._vDecoder.decode(packet.payload, packet.iskeyframe ? 1 : 0, packet.timestamp);
        })

        this._jitterBuffer.on('audiopacket', (packet) => {

            this._aDecoder.decode(packet.payload, packet.timestamp);
        })

    }

    
    destroy() {

        this.reset();

        this._aDecoder.clear();
        this._vDecoder.clear();

        this._aDecoder = undefined;
        this._vDecoder = undefined;


        this._stream.destroy();

        this._demuxer.destroy();
        this._jitterBuffer.destroy();
        
        clearInterval(this._stattimer);

        this._logger.info('WorkerCore', `WorkerCore destroy`);

    }
    


    reset() {

        this._logger.info('WorkerCore', `work thiread reset, clear gop buffer & reset all Params`);

        this._gop = [];
        this._lastts = 0;

        this._useSpliteBuffer = false;
        this._spliteBuffer = undefined;

        this._width = 0;
        this._height = 0;
    
        this._sampleRate = 0;
        this._channels = 0;
        this.samplesPerPacket = 0;

        this._demuxer.reset();
        this._jitterBuffer.reset();
        
    }

    setVideoCodec(vtype, extradata) {

        this._vDecoder.setCodec(vtype, extradata);
    }

    setAudioCodec(atype, extradata) {

        this._aDecoder.setCodec(atype, extradata);
    }

    //callback
    videoInfo(vtype, width, height) {

        this._width = width;
        this._height = height;

        this._logger.info('WorkerCore', `videoInfo width ${width} height ${height}`);

        postMessage({cmd: WORKER_EVENT_TYPE.videoInfo, vtype, width, height})
    }

    yuvData(yuv, timestamp) {

    //    this._logger.info('WorkerCore', `yuvdata timestamp ${timestamp}`);

        let size = this._width*this._height*3/2;
        let out = this._Module.HEAPU8.subarray(yuv, yuv+size);

        let data = Uint8Array.from(out);

        this._yuvframerate++;
        this._yuvbitrate += data.length;

        
        postMessage({cmd: WORKER_EVENT_TYPE.yuvData, data, width:this._width, height:this._height, timestamp}, [data.buffer]);

    }

    audioInfo(atype, sampleRate, channels) {

        this._sampleRate = sampleRate;
        this._channels = channels;
        this._samplesPerPacket = caculateSamplesPerPacket(sampleRate);

        postMessage({cmd: WORKER_EVENT_TYPE.audioInfo, atype, sampleRate, channels, samplesPerPacket:this._samplesPerPacket });
    }


    adjustTime(timestamp) {

        if (!this._lastts) {

            this._lastts = timestamp;
            this._curpts = 10000;

        } else {

            let diff = timestamp - this._lastts;

            if (diff < -3000) {

                this._logger.warn('WorkerCore', `now ts ${timestamp}  - lastts ${this._lastts} < -1000, adjust now pts ${this._curpts}`);

                this._curpts -= 25;
                this._lastts = timestamp;



            } else if (diff > 3000) {

               this._logger.warn('WorkerCore', `now ts ${timestamp}  - lastts ${this._lastts} > 1000, now pts ${this._curpts}`);

                this._curpts += diff;
                this._lastts = timestamp;


            } else {

                this._curpts += diff;
                this._lastts = timestamp;

            }

        }

        return this._curpts;

    }

    pcmData(pcmDataArray, samples, timestamp) {

    //     this._logger.info('WorkerCore', `pcmData samples ${samples} timestamp${timestamp}`);
        let datas = [];

        this._pcmframerate++;


        for (let i = 0; i < this._channels; i++) {
            var fp = this._Module.HEAPU32[(pcmDataArray >> 2) + i] >> 2;
            datas.push(Float32Array.of(...this._Module.HEAPF32.subarray(fp, fp + samples)));

            this._pcmbitrate += datas[i].length*4;
        }

        if (!this._useSpliteBuffer) {

            if(samples === this._samplesPerPacket) {

                postMessage({cmd: WORKER_EVENT_TYPE.pcmData, datas, timestamp}, datas.map(x => x.buffer));

                return;
            }

            this._spliteBuffer = new SpliteBuffer(this._sampleRate, this._channels, this._samplesPerPacket);
            this._useSpliteBuffer = true;
        } 

        this._spliteBuffer.addBuffer(datas, timestamp);

        this._spliteBuffer.splite((buffers, ts) => {

            postMessage({cmd: WORKER_EVENT_TYPE.pcmData, datas:buffers, timestamp:ts}, buffers.map(x => x.buffer));

        });

    }

}

export default WorkerCore;
