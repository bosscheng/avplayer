#!/usr/bin/python

import os

args = [
    'extra-cflags="-O3 -flto"',
    'cc=emcc',
    'cxx=em++',
    'ar=emar',
    'x86asmexe=emcc',
    'ranlib=emranlib',
    'prefix=../thirdparty/audio/ffmpeg',
    'target-os=none',
    'arch=x86_64',
    'cpu=generic'
    ]
disables = [
    'everything','all','avdevice','postproc','avfilter','programs','asm','parsers','muxers','demuxers','filters',
    'doc','devices','network','bsfs','shared','hwaccels','debug','protocols','indevs','outdevs','runtime-cpudetect'
]
enables = [
    'small','cross-compile','gpl','avcodec','swresample','avformat',
    'parser=aac',
    'parser=opus',
    'decoder=aac',
    'decoder=opus',
    'decoder=pcm_alaw',
    'decoder=pcm_mulaw',
    'static'
]
enables = ['enable-'+item for i,item in enumerate(enables)]
disables = ['disable-'+item for i,item in enumerate(disables)]
os.system('emconfigure ./configure --' +
          (' --'.join(args+disables+enables)))
os.system('make clean && emmake make -j && make install')