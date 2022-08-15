import {WORKER_SEND_TYPE, WORKER_EVENT_TYPE, AVType} from '../constant'
import EventEmitter from 'eventemitter3';

class MediaCenter extends EventEmitter  {


    _mediacenterWorker = undefined;
    _player;

    _isDestoryed = false;

    constructor (player) {

        super()

        this._player = player;

        this._player._logger.info('mediacenter', `start worker thread ${player._options.decoderMode}`);

        let workerfile = '';

        if (player._options.decoderMode === 'normal') {

            workerfile = 'worker.js';

        } else if (player._options.decoderMode === 'simd') {

            workerfile = 'worker_simd.js';

        } else if (player._options.decoderMode === 'simd_1') {

            workerfile = 'worker_simd_1.js';
        } else if (player._options.decoderMode === 'simd_2') {

            workerfile = 'worker_simd_2.js'; 
        } else {

            this._player._logger.console.error();('mediacenter', `decoderMode not support ${player._options.decoderMode}`);
            return;
        }


        this._mediacenterWorker = new Worker(workerfile);

        this._mediacenterWorker.onmessageerror = (event) => {

            this._player._logger.info('mediacenter', `start worker thread err ${event}`);
        };

        this._mediacenterWorker.onmessage = (event) => {

            const msg = event.data;
            switch (msg.cmd) {

                case WORKER_EVENT_TYPE.created: {

                    this._mediacenterWorker.postMessage({
                                                cmd: WORKER_SEND_TYPE.init,
                                                options:JSON.stringify(this._player._options)});
                    break;

                }

                case WORKER_EVENT_TYPE.inited: {
    
                    this.emit('inited');
                    break;

                }

                case WORKER_EVENT_TYPE.reseted: {

                    break;
                }

                case WORKER_EVENT_TYPE.destroyed: {

                    this._mediacenterWorker.terminate();
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

                    this.emit('yuvdata', packet);
                    break;
                }

                case WORKER_EVENT_TYPE.audioInfo: {

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

        this.off();
        this._isDestoryed = true;
        this._mediacenterWorker.postMessage({cmd: WORKER_SEND_TYPE.destroy});
        this._player._logger.info('MediaCenter', 'MediaCenter destroy');
 
    }

}



export default  MediaCenter;
