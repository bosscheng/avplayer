import {WORKER_SEND_TYPE, WORKER_EVENT_TYPE, AVType} from '../constant'
import EventEmitter from 'eventemitter3';
import AudioPlayer from '../audio/audioplayer.js';
import CanvasRender from '../render/canvasrender.js';
import { PixelType } from '../constant/index.js';
import StreamCore from './streamcore';

class MediaCenter extends EventEmitter  {


    _worker = undefined;
    _player;
    _audioplayer = undefined;
    _render = undefined;
    _streamCore = undefined;

    constructor (player) {

        super()

        this._player = player;

        this._player._logger.info('mediacenter', `start main thread ${player._options.decoderMode}`);

        this._render = new CanvasRender(player);  // render yuv
        this._audioplayer = new AudioPlayer(player); // play fltp


        this._streamCore = new StreamCore(player);

        this._streamCore.on('videoInfo', (vtype, width, height) => {

            this.emit('videoinfo', vtype, width, height);
        })

        this._streamCore.on('yuvData', (data, width, height, timestamp) => {

            let packet = {

                data:data, 
                timestamp:timestamp, 
                width, 
                height
            }

            this._render.updateTexture(PixelType.YUV, packet.data, packet.width, packet.height);

            this.emit('yuvdata', packet);

        })

        this._streamCore.on('audioInfo', (atype, sampleRate, channels, samplesPerPacket) => {

            this._audioplayer.setAudioInfo(atype, sampleRate, channels, samplesPerPacket);

            this.emit('audioinfo', atype, sampleRate, channels, samplesPerPacket);
        })

        this._streamCore.on('pcmData', (datas, timestamp) => {

            let packet = {

                datas:datas, 
                timestamp:timestamp, 

            }

            this._audioplayer.pushPcmData(packet);

            this.emit('pcmdata', packet);
        })


    }

    destroy() {

        this.removeAllListeners();
        this._streamCore.destroy();
        this._audioplayer.destroy();
        this._render.destroy();

        this._player._logger.info('MediaCenter', 'MediaCenter destroy');
 
    }

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



export default  MediaCenter;
