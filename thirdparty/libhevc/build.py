#!/usr/bin/python

import os
import shutil


try:
    shutil.rmtree('build')
except OSError as e:
    print("Error: %s - %s." % (e.filename, e.strerror))
    
os.mkdir('build')
os.chdir('build')

os.system('emcmake cmake -DCMAKE_BUILD_TYPE=RELEASE ..')
os.system('emmake make')


target = '../../../wasm/thirdparty/libhevc'
include =  target + '/include/'
lib = target + '/lib/'

try:
    shutil.rmtree(target)
except OSError as e:
    print("Error: %s - %s." % (e.filename, e.strerror))
 
os.makedirs(include)
os.makedirs(lib)

os.system('cp -rf libhevcdec.a ' + lib + 'libhevcdec-simd.a')


os.system('cp -rf ../common/ithread.h ' + include +  'ithread.h')
os.system('cp -rf ../common/iv.h ' + include +  'iv.h')
os.system('cp -rf ../common/ivd.h ' + include +  'ivd.h')
os.system('cp -rf ../common/ihevc_typedefs.h ' + include +  'ihevc_typedefs.h')
os.system('cp -rf ../decoder/ihevcd_cxa.h ' + include +  'ihevcd_cxa.h')




