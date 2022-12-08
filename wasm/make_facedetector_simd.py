
#!/usr/bin/python

# import tools.shared as emscripten
import os
import sys
import getopt
from subprocess import Popen, PIPE, STDOUT
args = {'-o': './out/facedetector_simd'}

sargs = {
    'WASM': 1,
    'TOTAL_MEMORY': 128*1024*1024,
    'ASSERTIONS': 0,
    'ERROR_ON_UNDEFINED_SYMBOLS': 0,
    'DISABLE_EXCEPTION_CATCHING': 1,
    'INVOKE_RUN':0,
    'USE_PTHREADS': 0,
    'MODULARIZE' : 1,
    'EXPORT_ES6' : 1
}

emcc_args = [
    '-O3',
    '--memory-init-file', '0',
    '-lembind',
    '-msimd128',
    '-Ithirdparty/opencv/include/opencv4',
    '--embed-file thirdparty/opencv/share/opencv4/face_detection_yunet_2022mar.onnx',
    '--embed-file thirdparty/opencv/share/opencv4/face_detection_yunet_2022mar-act_int8-wt_int8-quantized.onnx',
]+["-s "+k+"="+str(v) for k, v in sargs.items()]

print ('building...')

emcc_args = ['thirdparty/opencv/lib-simd/libopencv_objdetect.a', 
            'thirdparty/opencv/lib-simd/libopencv_core.a',  
            'thirdparty/opencv/lib-simd/libopencv_dnn.a', 
            'thirdparty/opencv/lib-simd/libopencv_calib3d.a', 
            'thirdparty/opencv/lib-simd/libopencv_features2d.a', 
            'thirdparty/opencv/lib-simd/libopencv_flann.a', 
            'thirdparty/opencv/lib-simd/libopencv_imgproc.a', 
            'thirdparty/opencv/lib-simd/libopencv_photo.a', 
            'thirdparty/opencv/lib-simd/libopencv_video.a', 
            'thirdparty/opencv/lib-simd/opencv4/3rdparty/liblibprotobuf.a',
            'thirdparty/opencv/lib-simd/opencv4/3rdparty/libzlib.a',
            'thirdparty/opencv/lib-simd/opencv4/3rdparty/liblibopenjp2.a',
            'thirdparty/opencv/lib-simd/opencv4/3rdparty/libquirc.a']+emcc_args

os.system('emcc ./src/ai/facedetector.cpp ' +
          (' '.join(emcc_args)) + ' -o '+args['-o']+'.js')

print ('done')
