import {WORKER_SEND_TYPE, WORKER_EVENT_TYPE} from '../constant';
import WorkerCore from './worker_core';

function workerRun() {

    console.log('avplayer: worker start');

    let workerCore = undefined;

    //recv msg from main thread
    self.onmessage = function(event) {

        var msg = event.data
        switch (msg.cmd) {

            case WORKER_SEND_TYPE.init: {

                workerCore = new WorkerCore(JSON.parse(msg.options));

                workerCore.on('videoInfo', (vtype, width, height) => {

                    postMessage({cmd: WORKER_EVENT_TYPE.videoInfo, vtype, width, height})
                })

                workerCore.on('yuvData', (data, width, height, timestamp) => {

                    postMessage({cmd: WORKER_EVENT_TYPE.yuvData, data, width, height, timestamp}, [data.buffer]);
                })

                workerCore.on('audioInfo', (atype, sampleRate, channels, samplesPerPacket) => {

                    postMessage({cmd: WORKER_EVENT_TYPE.audioInfo, atype, sampleRate, channels, samplesPerPacket});
                })

                workerCore.on('pcmData', (datas, timestamp) => {

                    postMessage({cmd: WORKER_EVENT_TYPE.pcmData, datas, timestamp}, datas.map(x => x.buffer));
                })

                postMessage({cmd: WORKER_EVENT_TYPE.inited});

                break;
            }

            case WORKER_SEND_TYPE.destroy: {

                workerCore.destroy();
                workerCore = undefined;

                postMessage({cmd: WORKER_EVENT_TYPE.destroyed});
                
                break;
            }

        }

    }

    // notify main thread after worker thread  init completely
    postMessage({cmd: WORKER_EVENT_TYPE.created});
}


workerRun();