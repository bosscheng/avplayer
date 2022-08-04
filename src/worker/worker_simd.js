import Module from '../decoder/decoder_simd'
import workerPostRun from './worker_run'

Module.postRun = ()=>{

    workerPostRun(Module);

};