#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/time.h>

#include <algorithm>
#include <memory>




#include "log.h"
#include "decoder_hevc_openhevc.h"



Decoder_HEVC_OpenHevc::Decoder_HEVC_OpenHevc(DecoderVideoObserver* obs):DecoderVideo(obs), mVideoWith(0), mVideoHeight(0), mYUV(NULL) {

    mCodecCtx = libOpenHevcInit(0, 0);
    libOpenHevcSetDebugMode(mCodecCtx, 0);
    libOpenHevcStartDecoder(mCodecCtx);

}

Decoder_HEVC_OpenHevc::~Decoder_HEVC_OpenHevc() {

    if (mCodecCtx) {

        libOpenHevcClose(mCodecCtx);
        mCodecCtx = NULL;
    }

    if (mYUV) {

        free(mYUV);
        mYUV = NULL;
    }

}


void Decoder_HEVC_OpenHevc::init() {


}

void Decoder_HEVC_OpenHevc::decode(unsigned char *buf, unsigned int buflen, unsigned int timestamp) {

    int got_picture = libOpenHevcDecode(mCodecCtx, buf, buflen, timestamp);

    if (got_picture > 0) {

        
        libOpenHevcGetPictureInfoCpy(mCodecCtx, &openHevcFrameCpy.frameInfo);

        if (mVideoWith == 0 || mVideoHeight == 0) {


            printf("pic info chroma format:%d width:%d height:%d YPitch:%d UPitch:%d VPitch:%d  \n", 
                    openHevcFrameCpy.frameInfo.chromat_format, openHevcFrameCpy.frameInfo.nWidth, openHevcFrameCpy.frameInfo.nHeight,
                    openHevcFrameCpy.frameInfo.nYPitch, openHevcFrameCpy.frameInfo.nUPitch, openHevcFrameCpy.frameInfo.nVPitch);

            mVideoWith = openHevcFrameCpy.frameInfo.nWidth;
            mVideoHeight = openHevcFrameCpy.frameInfo.nHeight;
            mYUV = (unsigned char*)malloc(mVideoWith*mVideoHeight*3/2);

            openHevcFrameCpy.pvY = mYUV;
            openHevcFrameCpy.pvU = mYUV + mVideoWith*mVideoHeight;
            openHevcFrameCpy.pvV = mYUV + mVideoWith*mVideoHeight*5/4;


            mObserver->videoInfo(mVideoWith, mVideoHeight);
        }


        libOpenHevcGetOutputCpy(mCodecCtx, 1, &openHevcFrameCpy);

        int pts = openHevcFrameCpy.frameInfo.nTimeStamp;

        mObserver->yuvData(mYUV, pts);




    }

}






