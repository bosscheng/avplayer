import Module from '../decoder/decoder'
import workerPostRun from './worker_run'

Module.postRun = ()=>{

    workerPostRun(Module);

};
