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


target = '../../../thirdparty/video/libavc'
include =  target + '/include/'
lib = target + '/lib/'

try:
    shutil.rmtree(target)
except OSError as e:
    print("Error: %s - %s." % (e.filename, e.strerror))
 
os.makedirs(include)
os.makedirs(lib)

os.system('cp -rf libavcdec.a ' + lib + 'libavcdec-simd.a')

os.system('cp -rf ../common/ithread.h ' + include +  'ithread.h')
os.system('cp -rf ../common/ih264_typedefs.h ' + include +  'ih264_typedefs.h')
os.system('cp -rf ../decoder/ih264d.h ' + include +  'ih264d.h')
os.system('cp -rf ../decoder/iv.h ' + include +  'iv.h')
os.system('cp -rf ../decoder/ivd.h ' + include +  'ivd.h')

