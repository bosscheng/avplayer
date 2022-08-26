
#!/usr/bin/python

# import tools.shared as emscripten
import os
import sys
import getopt
from subprocess import Popen, PIPE, STDOUT
args = {'-o': '../src/decoder/decoder_simd'}

sargs = {
    'WASM': 1,
    'TOTAL_MEMORY': 128*1024*1024,
    'ASSERTIONS': 0,
    'ERROR_ON_UNDEFINED_SYMBOLS': 0,
    'DISABLE_EXCEPTION_CATCHING': 1,
    'INVOKE_RUN':0,
    'USE_PTHREADS':  0
}
emcc_args = [
    # '-m32',
    # '-fPIC',
    '-O3',
    '--memory-init-file', '0',
    # '--closure', '1',
    # '--llvm-lto','1',
    '-lembind',
    '-I.', '-Isrc/common', '-Ithirdparty/android/include', '-Ithirdparty/ffmpeg/include',
    '--post-js','./post.js',
    '-msimd128',
    '-flto'
]+["-s "+k+"="+str(v) for k, v in sargs.items()]

print ('building...')

emcc_args = ['thirdparty/android/lib/libavcdec-simd.a', 'thirdparty/android/lib/libhevcdec-simd.a', 'thirdparty/ffmpeg/lib/libavcodec.a','thirdparty/ffmpeg/lib/libavutil.a','thirdparty/ffmpeg/lib/libswresample.a']+emcc_args

os.system('emcc ./src/decoder_simd/decoder.cpp ./src/common/log.c ./src/common/deocdervideo.cpp ./src/common/decoder_avc_android.cpp ./src/common/decoder_hevc_android.cpp ' +
          (' '.join(emcc_args)) + ' -o '+args['-o']+'.js')

print ('done')
