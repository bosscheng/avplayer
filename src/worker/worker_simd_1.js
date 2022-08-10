import Module from '../decoder/decoder_simd_1'
import workerPostRun from './worker_run'

Module.postRun = ()=>{

    workerPostRun(Module);

};