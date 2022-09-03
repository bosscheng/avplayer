import {WORKER_SEND_TYPE, WORKER_EVENT_TYPE} from '../constant';
import StreamCore from './streamcore';
import Logger from '../utils/logger.js';

function workerRun() {

    console.log('avplayer: worker start');

    let streamCore = undefined;

    //recv msg from main thread
    self.onmessage = function(event) {

        var msg = event.data
        switch (msg.cmd) {

            case WORKER_SEND_TYPE.init: {

                let player = {

                    _options: JSON.parse(msg.options),
                    _logger: new Logger()
                }

               player._logger.setLogEnable(true);

                streamCore = new StreamCore(player);

                streamCore.on('videoInfo', (vtype, width, height) => {

                    postMessage({cmd: WORKER_EVENT_TYPE.videoInfo, vtype, width, height})
                })

                streamCore.on('yuvData', (data, width, height, timestamp) => {

                    postMessage({cmd: WORKER_EVENT_TYPE.yuvData, data, width, height, timestamp}, [data.buffer]);
                })

                streamCore.on('audioInfo', (atype, sampleRate, channels, samplesPerPacket) => {

                    postMessage({cmd: WORKER_EVENT_TYPE.audioInfo, atype, sampleRate, channels, samplesPerPacket});
                })

                streamCore.on('pcmData', (datas, timestamp) => {

                    postMessage({cmd: WORKER_EVENT_TYPE.pcmData, datas, timestamp}, datas.map(x => x.buffer));
                })

                postMessage({cmd: WORKER_EVENT_TYPE.inited});

                break;
            }

            case WORKER_SEND_TYPE.destroy: {

                streamCore.destroy();
                streamCore = undefined;

                postMessage({cmd: WORKER_EVENT_TYPE.destroyed});
                
                break;
            }

        }

    }

    // notify main thread after worker thread  init completely
    postMessage({cmd: WORKER_EVENT_TYPE.created});
}


workerRun();