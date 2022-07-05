import Module from './decoder/decoder'
import {WORKER_SEND_TYPE, WORKER_EVENT_TYPE} from './constant'
import { AVPacket } from './utils/av';
import { AVType } from './constant';


const JitterBufferStatus = {
    notstart: 'notstart',      //未开始
    bufferring : 'bufferring',  //开始，等待缓冲满
    decoding: 'decoding'        //开始解码
}



// 核心类，处理jitterbuffer, 播放控制，音画同步
class MediaCenterInternal {

    _vDecoder = undefined;
    _aDecoder = undefined;

    _vDecoder = undefined;
    _aDecoder = undefined;

    _width = 0;
    _height = 0;

    _sampleRate = 0;
    _channels = 0;
    _samplesPerPacket = 0;

    _options = undefined;

    _gop = [];
    _status = JitterBufferStatus.notstart;
    _firstts = 0;
    _firstpacketts = 0;

    _timer = undefined;
    _statistic = undefined;


    constructor() {

        this._vDecoder = new Module.VideoDecoder(this);
        this._aDecoder = new Module.AudioDecoder(this);


      this._timer = setInterval(() => {

        this.handleTicket();
        
      }, 10);

      this._statistic = setInterval(() => {

        console.log(`jitter buffer count ${this._gop.length}`);
        
      }, 1000);
    }

    setOptions(options) {

        console.log(`work thiread recv options, delay ${options.delay}`);

        this._options = options;

    }

    handleTicket() {


        let next = true;

        while (next) {

            next = this.tryDecode()
        }

    }

    tryDecode() {

        if (this._status === JitterBufferStatus.notstart) {

            if (this._gop.length < 1) {

                return false;
            }

            this._status = JitterBufferStatus.bufferring;
            return true;

        } else if (this._status === JitterBufferStatus.bufferring) {

            if (this._gop.length < 2) {
                
                return false;
            }

            if (this._gop[this._gop.length-1].timestamp - this._gop[0].timestamp > this._options.delay) {

                this._status = JitterBufferStatus.decoding;
                this._firstpacketts = this._gop[0].timestamp;
                this._firstts = this.caculateFirstTS();

                console.log(`gop buffer ok, delay ${this._options.delay}, last[${this._gop[this._gop.length-1].timestamp}] first[${ this._gop[0].timestamp}] factfirst[${this._firstts}]`);

                return true;
            }

            return false;

        } else if (this._status === JitterBufferStatus.decoding) {

            if (this._gop.length < 1) {

                console.log(`gop buffer is empty, restart buffering`);
                this._status = JitterBufferStatus.bufferring;
                return false;
            }

            let now = new Date().getTime();
            let packet = this._gop[0];

            if (now - this._firstts >= packet.timestamp - this._firstpacketts) {

                this.decodePacket(packet);
                this._gop.shift();
                return true;
            }
            
            return false

        } else {


            console.error(`jittbuffer status [${this._status}]  error !!!`);
        }

        return false;

    }


    caculateFirstTS() {

        let now = new Date().getTime();

        if (this._options.playmode === 'playback') {

            return now;
        }

        if (this._gop.length < 1) {

            return now 
        }

        let lastpackts = this._gop[this._gop.length-1];

        let bf = false;
        let i = this._gop.length - 2
        for(; i >= 0; i--) {

            // console.log(`buffer check, lastpacketts ${lastpackts.timestamp} i ${i} ts ${this._gop[i].timestamp} delay ${this._options.delay} `);

            if(lastpackts.timestamp - this._gop[i].timestamp >= this._options.delay) {
                bf = true;
                break;
            }

        }

        // console.log(`buffer check foud ${bf}`)

        if (bf) {

            let diff = this._gop[i].timestamp - this._gop[0].timestamp;

            console.log(`buffering too much, gop cnt ${this._gop.length}, so just firsts ${now - diff}, now ${now}, diff ${diff}`)

            return now - diff;

        }

        console.log(`buffering normal, gop cnt ${this._gop.length}, so firsts ${now}`)

        return now


    }

    decodePacket(avpacket) {

        if (avpacket.avtype === AVType.Video) {

            this._vDecoder.decode(avpacket.payload, avpacket.timestamp);

        } else {

            this._aDecoder.decode(avpacket.payload, avpacket.timestamp);
        }

    }

    setVideoCodec(vtype, extradata) {

        this._vDecoder.setCodec(vtype, extradata);
    }

    decodeVideo(videodata, timestamp, keyframe) {

        let avpacket = new AVPacket();
        avpacket.avtype = AVType.Video;
        avpacket.payload = videodata;
        avpacket.timestamp = timestamp;
        avpacket.iskeyframe = keyframe;

        this._gop.push(avpacket);
        this._gop.sort((a, b) => a.timestamp - b.timestamp);

     //    this._vDecoder.decode(videodata, timestamp);
    }


    setAudioCodec(atype, extradata) {

        this._aDecoder.setCodec(atype, extradata);
    }

    decodeAudio(audiodata, timestamp) {

        let avpacket = new AVPacket();
        avpacket.avtype = AVType.Audio;
        avpacket.payload = audiodata;
        avpacket.timestamp = timestamp;

        this._gop.push(avpacket);
        this._gop.sort((a, b) => a.timestamp - b.timestamp);

        // this._aDecoder.decode(audiodata, timestamp);
    }

    //callback
    videoInfo(vtype, width, height) {

        this._width = width;
        this._height = height;

        postMessage({cmd: WORKER_EVENT_TYPE.videoInfo, vtype, width, height})
    }

    yuvData(yuv, timestamp) {

        let size = this._width*this._height*3/2;
        let out = Module.HEAPU8.subarray(yuv, yuv+size);

        let data = Uint8Array.from(out);

      //  console.log(`worker yuv[0-5] ${data[0]} ${data[1]} ${data[2]} ${data[3]} ${data[4]} ${data[5]}`);

        postMessage({cmd: WORKER_EVENT_TYPE.yuvData, data, width:this._width, height:this._height, timestamp}, [data.buffer]);
    }

    audioInfo(atype, sampleRate, channels, samplesPerPacket) {

        this._sampleRate = sampleRate;
        this._channels = channels;
        this._samplesPerPacket = samplesPerPacket;

        postMessage({cmd: WORKER_EVENT_TYPE.audioInfo, atype, sampleRate, channels, samplesPerPacket});
    }

    pcmData(pcmDataArray, samples, timestamp) {

        if (samples !== this._samplesPerPacket) {

            console.warn(`pcm data samplesPerChannel ${samples} not equal samplesPerPacket ${this._samplesPerPacket}`)
        }

        let datas = [];

        for (let i = 0; i < this._channels; i++) {
            var fp = Module.HEAPU32[(pcmDataArray >> 2) + i] >> 2;
            datas.push(Float32Array.of(...Module.HEAPF32.subarray(fp, fp + samples)));

           // console.log(`worker thread pcm data[${i}] length ${datas[i].length} samples ${samples}`);
        }

        postMessage({cmd: WORKER_EVENT_TYPE.pcmData, datas, timestamp}, datas.map(x => x.buffer));

    }


    destory() {


        clearInterval(this._timer);

        clearInterval(this._statistic);
        

    }
    

}


Module.postRun = function() {


    console.log('avplayer: mediacenter worker start');


    let mcinternal = new MediaCenterInternal();

    //recv msg from main thread
    self.onmessage = function(event) {

        var msg = event.data
        switch (msg.cmd) {

            case WORKER_SEND_TYPE.init: {

               mcinternal.setOptions(JSON.parse(msg.options));
               postMessage({cmd: WORKER_EVENT_TYPE.inited});

                break;
            }

            case WORKER_SEND_TYPE.setVideoCodec: {

                mcinternal.setVideoCodec(msg.vtype, msg.extradata)
                break;
            }

            case WORKER_SEND_TYPE.decodeVideo: {

                mcinternal.decodeVideo(msg.videodata, msg.timestamp)
                break;
            }

            case WORKER_SEND_TYPE.setAudioCodec: {

                mcinternal.setAudioCodec(msg.atype, msg.extradata)
                break;

            }

            case WORKER_SEND_TYPE.decodeAudio: {

                mcinternal.decodeAudio(msg.audiodata, msg.timestamp)
                break;
            }

            case WORKER_SEND_TYPE.close: {

                mcinternal.destory();
                
                break;
            }

        }

    }

    // notify main thread after worker thread  init completely
    postMessage({cmd: WORKER_EVENT_TYPE.created});


}

