import SpliteBuffer from '../utils/splitebuffer';
import { caculateSamplesPerPacket } from '../utils';
import Logger from '../utils/logger.js';
import FLVDemuxer from '../demuxer/flvdemuxer.js';
import FetchStream from '../stream/fetchstream.js';
import JitterBuffer from './jitterbuffer';
import {AudioDecoder, VideoDecoder} from '../decoder/index';
import EventEmitter from 'eventemitter3';


const DecodePacketType = {

    VideoInfo: 0x1,
    VideoData: 0x2,
    AudioInfo: 0x3,
    AudioData: 0x4

};


class WorkerCore extends EventEmitter {

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


    _jitterBuffer = undefined;


    _deocodeList = [];
    _decodeStart = false;


    constructor(options) {

        super()

        this._options = options;

        this._logger = new Logger();
       this._logger.setLogEnable(true);

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


    decodePacket(dpacket) {

        this._deocodeList.push(dpacket);

        this.tryDecode()

    }

    async createVideoDecoder() {

        if (!this._vDecoder) {

            this._vDecoder = new VideoDecoder(this._options.decoderMode);
            await this._vDecoder.initialize();

            this._vDecoder.on("videoCodecInfo", (videoCodecInfo) => {
                this.handleVideoCodecInfo(videoCodecInfo);
            });
            this._vDecoder.on("videoFrame", (videoFrame) => {

                this.handleVideoFrame(videoFrame);
            });
        }

    }

    async createAudioDecoder() {

        if (!this._aDecoder) {

            this._aDecoder = new AudioDecoder("soft");
            await this._aDecoder.initialize();
            
            this._aDecoder.on("audioCodecInfo", (audioCodecInfo) => {
                this.handleAudioCodecInfo(audioCodecInfo);
            });
            this._aDecoder.on("audioFrame", (audioFrame) => {
                this.handleAudioFrame(audioFrame);
            })
        }

    }

   async tryDecode() {

        if (this._decodeStart) {

            return;
        }

        if (this._deocodeList.length == 0) {

            return;
        }

        this._decodeStart = true;

        let dpacket = this._deocodeList.shift();

        if (dpacket.dptype == DecodePacketType.VideoInfo) {

            await this.createVideoDecoder();

            let config = {videoType:dpacket.vtype, extraData:dpacket.extradata};

            this._vDecoder.configure(config);

        } else if (dpacket.dptype == DecodePacketType.AudioInfo) {

            await this.createAudioDecoder();

            let config = {audioType:dpacket.atype, extraData:dpacket.extradata};

            this._aDecoder.configure(config);


        } else if (dpacket.dptype == DecodePacketType.VideoData) {

            let packet = {

                data:dpacket.payload,
                keyFrame:dpacket.iskeyframe ? 1 : 0,
                pts:dpacket.timestamp

            }

            this._vDecoder.decode(packet);

            
        } else if (dpacket.dptype == DecodePacketType.AudioData) {

            let packet = {

                data:dpacket.payload,
                pts:dpacket.timestamp
            }

            this._aDecoder.decode(packet);

            
        } else {

            this._logger.error('WorkerCore', `decode error invalid decodetype ${dpacket.dptype}`);
        }

        this._decodeStart = false;

        this.tryDecode();

    }

    registerEvents() {

        this._logger.info('WorkerCore', `now play ${this._options.url}`);

        this._stream.on('finish', () => {

        });

        this._stream.on('retry', () => {

            this.reset();

        });

        this._stream.on('data', (data) => {

            this._demuxer.dispatch(data);

        });

        this._demuxer.on('videoinfo', (videoinfo) => {

            this._logger.info('WorkerCore', `demux video info vtype:${videoinfo.vtype} width:${videoinfo.width} hight:${videoinfo.height}`);

           let dpacket = {dptype: DecodePacketType.VideoInfo, vtype:videoinfo.vtype, extradata: videoinfo.extradata};

           this.decodePacket(dpacket);
        })

        this._demuxer.on('audioinfo', (audioinfo) => {


            this._logger.info('WorkerCore', `demux audio info atype:${audioinfo.atype} sample:${audioinfo.sample} channels:${audioinfo.channels} depth:${audioinfo.depth} aacprofile:${audioinfo.profile}`);

          let dpacket = {dptype: DecodePacketType.AudioInfo, atype:audioinfo.atype, extradata: audioinfo.extradata};

          this.decodePacket(dpacket);

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

            packet.dptype = DecodePacketType.VideoData;

            this.decodePacket(packet);

        })

        this._jitterBuffer.on('audiopacket', (packet) => {

           packet.dptype = DecodePacketType.AudioData;

           this.decodePacket(packet);
        })

    }

    
    destroy() {

        this.removeAllListeners();

        this.reset();

        this._aDecoder.close();
        this._vDecoder.close();

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


    //callback
    handleVideoCodecInfo(videoCodeInfo) {

        this._width = videoCodeInfo.width;
        this._height = videoCodeInfo.height;

        this._logger.info('WorkerCore', `videoInfo width ${videoCodeInfo.width} height ${videoCodeInfo.height}`);

        this.emit('videoInfo', videoCodeInfo.videoType, videoCodeInfo.width, videoCodeInfo.height);

    }

    handleVideoFrame(videoFrame) {

        this._yuvframerate++;
    
        this.emit('yuvData', videoFrame.data, videoFrame.width, videoFrame.height, videoFrame.pts);
    }

    handleAudioCodecInfo(audioCodeInfo) {

        this._sampleRate = audioCodeInfo.sampleRate;
        this._channels = audioCodeInfo.channels;
        this._samplesPerPacket = caculateSamplesPerPacket(audioCodeInfo.sampleRate);


        this.emit('audioInfo', audioCodeInfo.audioType, audioCodeInfo.sampleRate, audioCodeInfo.channels, this._samplesPerPacket);

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

    handleAudioFrame(audioFrame) {

    //     this._logger.info('WorkerCore', `pcmData samples ${samples} timestamp${timestamp}`);

        this._pcmframerate++;

        for (let i = 0; i < this._channels; i++) {

            this._pcmbitrate += audioFrame.datas[i].length*4;
        }

        if (!this._useSpliteBuffer) {

            if(audioFrame.sampleNum === this._samplesPerPacket) {

                this.emit('pcmData', audioFrame.datas, audioFrame.pts);
                return;
            }

            this._spliteBuffer = new SpliteBuffer(this._sampleRate, this._channels, this._samplesPerPacket);
            this._useSpliteBuffer = true;
        } 

        this._spliteBuffer.addBuffer(audioFrame.datas, timestamp);

        this._spliteBuffer.splite((buffers, ts) => {

            this.emit('pcmData', buffers, ts);

        });

    }

}

export default WorkerCore;
