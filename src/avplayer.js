import CanvasRender from './render/canvasrender.js';
import Logger from './utils/logger.js';
import MediaCenter from './mediacenter/index.js';
import { PixelType } from './constant/index.js';
import AudioPlayer from './audio/audioplayer.js';
import EventEmitter from 'eventemitter3';

const DEFAULT_PLAYER_OPTIONS = {

    url:'',                 //播放地址
    container:'',           //外部容器，用于放置渲染画面

    playMode:'live',        //live 或者 playback

    renderMode:'normal', // normal:正常, green:绿幕, mask:掩码, cube:方块
    width:480,
    height:480,
    delay:500,              //缓冲时长

    retryCnt:-1,       //拉流失败重试次数
    retryDelay: 5,     //重试时延 5000

    decoderMode:"normal"
}

class AVPlayer extends EventEmitter{

    _options = undefined;

    _render = undefined;
    _logger = undefined;
    _mediacenter = undefined;
    _audioplayer = undefined;


    //统计
    _yuvframerate = 0;
    _yuvbitrate = 0;
    _pcmframerate = 0;
    _pcmbitrate = 0;
    _statsec = 2;
    _stattimer = undefined;
    _lastStatTs = undefined;


    constructor(options) {
        super();

        this._logger = new Logger();
      //  this._logger.setLogEnable(true);

        this._options = Object.assign({}, DEFAULT_PLAYER_OPTIONS, options);
        this._container = options.container;

        this._logger.info('player', `now play ${this._options.url}`);

        this._mediacenter = new MediaCenter(this); //jitterbuffer & decoder h264/h265 -> yuv aac/pcmu/pcma -> fltp
        this._render = new CanvasRender(this);  // render yuv
        this._audioplayer = new AudioPlayer(this); // play fltp

        this.registerEvents();
        this.startStatisc();
    }
    
    startStatisc() {

        this._lastStatTs = new Date().getTime();

        this._stattimer = setInterval(() => {

            let now = new Date().getTime();
            let diff = (now - this._lastStatTs)/1000;
            this._lastStatTs = now;
            
            this._logger.info('STAT', `------ STAT  ${diff} ---------
            yuv cosume framerate:${this._yuvframerate/diff} bitrate:${this._yuvbitrate*8/diff}
            pcm cosume framerate:${this._pcmframerate/diff} bitrate:${this._pcmbitrate*8/diff}
            `);

            this.emit('fps', this._yuvframerate/diff);

            this._yuvframerate = 0;
            this._yuvbitrate = 0;
            this._pcmframerate = 0;
            this._pcmbitrate = 0;


        }, this._statsec*1000);

    }

    stopStatic() {

        if (this._stattimer) {

            clearInterval(this._stattimer);
            this._stattimer = undefined;
        }

    }

    registerEvents() {

        this._mediacenter.on('inited', () => {

            this._logger.info('player', `mediacenter init success`);
     
        })

        this._mediacenter.on('videoinfo', (vtype, width, height) => {

            this._logger.info('player', `mediacenter video info vtype ${vtype} width ${width} height ${height}`);

            this.emit('videoinfo', vtype, width, height);
        })

        this._mediacenter.on('yuvdata', (yuvpacket) => {


            this._yuvframerate++;
            this._yuvbitrate += yuvpacket.data.length;
       //     this._logger.info('player', `decoder yuvdata ${yuvpacket.data.length} ts ${yuvpacket.timestamp} width:${yuvpacket.width} height:${yuvpacket.height}`);

            this._render.updateTexture(PixelType.YUV, yuvpacket.data, yuvpacket.width, yuvpacket.height);
        })

        this._mediacenter.on('audioinfo', (atype, sampleRate, channels, samplesPerPacket) => {

            this._logger.info('player', `mediacenter audio info atype ${atype} sampleRate ${sampleRate} channels ${channels}  samplesPerPacket ${samplesPerPacket}`);
            
            this._audioplayer.setAudioInfo(atype, sampleRate, channels, samplesPerPacket);

            this.emit('audioinfo', atype, sampleRate, channels);
            
        })

        this._mediacenter.on('pcmdata', (pcmpacket) => {

            this._pcmframerate++;

            for(let data of pcmpacket.datas) {
    
                this._pcmbitrate += data.length;
            }
       //     this._logger.info('player', `decoder yuvdata ${yuvpacket.data.length} ts ${yuvpacket.timestamp} width:${yuvpacket.width} height:${yuvpacket.height}`);

            this._audioplayer.pushPcmData(pcmpacket);
            
        })

    }

    destroy() {

        this.stopStatic()

        this._mediacenter.destroy();
        this._audioplayer.destroy();
        this._render.destroy();

        this._logger.info('player', `avplayer destroy`)

    }

    //public interface

    unMute() {

        this._audioplayer.unMute();
    }

    mute() {

        this._audioplayer.mute();
    }

    switchRender(renderMode) {

        this._render.switchRender(renderMode);

    }




}

window.AVPlayer = AVPlayer;

export default AVPlayer;