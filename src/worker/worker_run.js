
import {WORKER_SEND_TYPE, WORKER_EVENT_TYPE} from '../constant';
import WorkerCore from './worker_core';

function workerPostRun(Module) {

    console.log('avplayer: worker start');

    let workerCore = undefined;

    //recv msg from main thread
    self.onmessage = function(event) {

        var msg = event.data
        switch (msg.cmd) {

            case WORKER_SEND_TYPE.init: {

                workerCore = new WorkerCore(JSON.parse(msg.options), Module);
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

export default workerPostRun;

