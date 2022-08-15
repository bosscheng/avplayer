import Module from '../decoder/decoder_simd_2'
import workerPostRun from './worker_run'

Module.postRun = ()=>{

    workerPostRun(Module);

};