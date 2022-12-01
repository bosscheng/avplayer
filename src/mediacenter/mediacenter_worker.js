import {WORKER_SEND_TYPE, WORKER_EVENT_TYPE, AVType} from '../constant'
import EventEmitter from 'eventemitter3';
import AudioPlayer from '../audio/audioplayer.js';
import CanvasRender from '../render/canvasrender.js';
import { PixelType } from '../constant/index.js';

class MediaCenterWorker extends EventEmitter  {


    _worker = undefined;
    _player;
    _audioplayer = undefined;
    _render = undefined;

    _isDestoryed = false;

    constructor (player) {

        super()

        this._player = player;

        this._player._logger.info('mediacenter', `start worker thread ${player._options.decoderMode}`);

        this._render = new CanvasRender(player);  // render yuv
        this._audioplayer = new AudioPlayer(player); // play fltp

        this._worker = new Worker('worker.js');

        this._worker.onmessageerror = (event) => {

            this._player._logger.info('mediacenter', `start worker thread err ${event}`);
        };

        this._worker.onmessage = (event) => {

            const msg = event.data;
            switch (msg.cmd) {

                case WORKER_EVENT_TYPE.created: {

                    this._worker.postMessage({
                                                cmd: WORKER_SEND_TYPE.init,
                                                options:JSON.stringify(this._player._options)});
                    break;

                }

                case WORKER_EVENT_TYPE.inited: {
    
                    this.emit('inited');
                    break;

                }

                case WORKER_EVENT_TYPE.destroyed: {

                    this._worker.terminate();
                    break;
                }

                case WORKER_EVENT_TYPE.videoInfo: {

                    this.emit('videoinfo', msg.vtype, msg.width, msg.height);

                    break;
                }

                    
                case WORKER_EVENT_TYPE.yuvData: {

                    if(this._isDestoryed) {

                        return;
                    }

                    let packet = {

                        data:msg.data, 
                        timestamp:msg.timestamp, 
                        width:msg.width, 
                        height:msg.height
                    }

                    this._render.updateTexture(PixelType.YUV, packet.data, packet.width, packet.height);

                    this.emit('yuvdata', packet);
                    break;
                }

                case WORKER_EVENT_TYPE.audioInfo: {

                    this._audioplayer.setAudioInfo(msg.atype, msg.sampleRate, msg.channels, msg.samplesPerPacket);

                    this.emit('audioinfo', msg.atype, msg.sampleRate, msg.channels, msg.samplesPerPacket);
                    break;
                }


                case WORKER_EVENT_TYPE.pcmData: {

                    if(this._isDestoryed) {

                        return;
                    }

                    let packet = {

                        datas:msg.datas, 
                        timestamp:msg.timestamp, 
       
                    }

                    this._audioplayer.pushPcmData(packet);

                    this.emit('pcmdata', packet);
                    break;

                }

   
                default: {

                    break;
                }
                   
            }

        };


    }

    destroy() {

        this.removeAllListeners();
        this._audioplayer.destroy();
        this._render.destroy();

        this._isDestoryed = true;
        this._worker.postMessage({cmd: WORKER_SEND_TYPE.destroy});
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



export default  MediaCenterWorker;
