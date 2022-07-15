
#!/usr/bin/python

# import tools.shared as emscripten
import os
import sys
import getopt
from subprocess import Popen, PIPE, STDOUT
args = {'-o': '../src/decoder/decoder_android_simd'}

sargs = {
    'WASM': 1,
    'TOTAL_MEMORY': 67108864,
    'ASSERTIONS': 0,
    'ERROR_ON_UNDEFINED_SYMBOLS': 0,
    'DISABLE_EXCEPTION_CATCHING': 1,
    'INVOKE_RUN':0,
    'USE_PTHREADS':  0
}
emcc_args = [
    # '-m32',
     '-Oz',
    '--memory-init-file', '0',
    # '--closure', '1',
    # '--llvm-lto','1',
    '--bind',
    '-I.', '-Ithirdparty/android', '-Ithirdparty/android/include',
    '--post-js','./post.js',
    '-msimd128'
]+["-s "+k+"="+str(v) for k, v in sargs.items()]

print ('building...')

emcc_args = ['thirdparty/android/libs/libavcdec-simd.a']+emcc_args

os.system('emcc ./src/use_android_codec/decoder.cpp ./thirdparty/android/log.c ./thirdparty/android/deocdervideo.cpp ./thirdparty/android/decoderavc.cpp ' +
          (' '.join(emcc_args)) + ' -o '+args['-o']+'.js')

print ('done')
