#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <stdio.h>
#include <string.h>
#include <stdarg.h>

#include "dec_video_ffmpeg.h"
#include "dec_video_base.h"
#include "av_type.h"

using namespace emscripten;
using namespace std;


//视频类型，全局统一定义，JS层也使用该定义


class VideoDecoder : public DecoderVideoBaseObserver {

public:

    int mVideoWith = 0;
    int mVideoHeight = 0;
    int mVType = 0;
    int mVFormat = 0;
    DecoderVideoBase* mDecoderV;
    val mJsObject;

    bool mInit = false;

public:

    VideoDecoder(val&& v);
    virtual ~VideoDecoder();

    void setCodec(unsigned vtype, string extra);

    void decode(string input, unsigned int isKeyFrame, unsigned int timestamp);

    virtual void videoInfo(int width, int height);
    virtual void yuvData(unsigned char* yuv, unsigned int timestamp);
     
    void clear();

    void reportError(const char* format, ...);

};


VideoDecoder::VideoDecoder(val&& v) : mJsObject(move(v)) {

  
}

VideoDecoder::~VideoDecoder() {

    clear();

    printf("VideoDecoder dealloc \n");

}

void VideoDecoder::clear() {

    mVideoWith = 0;
    mVideoHeight = 0;
    
    if (mDecoderV) {
        delete mDecoderV;
        mDecoderV = nullptr;
    }

}

void VideoDecoder::reportError(const char* format, ...) {

    va_list ap;
  
    va_start(ap, format);
    char* buf = nullptr;
    vasprintf(&buf, format, ap); 
    va_end(ap);


    mJsObject.call<void>("errorInfo", string(buf));
}


void VideoDecoder::setCodec(unsigned vtype, string extra)
{
     printf("Use Video Decoder, VideoDecoder::setCodec vtype %d, extra %d \n", vtype, extra.length());
    
    clear();


    int videoformat = 0;

    if (vtype == Video_H264) {

        if (extra.length() > 0) {

            videoformat = Format_AVCC;

        } else {

            videoformat = Format_AVC_AnnexB;
        }

      
    } else if (vtype == Video_H265) {

        if (extra.length() > 0) {

            videoformat = Format_HVCC;

        } else {

            videoformat = Format_HEVC_AnnexB;
        }

    } else {

        printf("Video Decoder not support vtype %s \n", vtype);
        return;
    }

    mVType = vtype;
    mVFormat = videoformat;

    mDecoderV = new Decorder_Video_FFMPEG(this);
    mDecoderV->init(mVType, (unsigned char*)extra.data(), extra.length());

    mInit = true;
}


void  VideoDecoder::decode(string input, unsigned int isKeyFrame, unsigned int timestamp)
{
    if (!mInit) {

        printf("VideoDecoder has not Init when decode \n");
        return;
    }

    unsigned int bufferLen = input.length();
    unsigned char* buffer = (unsigned char*)input.data();

    mDecoderV->decode(buffer, bufferLen, timestamp);
}

void VideoDecoder::videoInfo(int width, int height){

    mVideoWith = width;
    mVideoHeight = height;

    mJsObject.call<void>("videoInfo",  mVType, mVideoWith, mVideoHeight);

}

void VideoDecoder::yuvData(unsigned char* yuv, unsigned int timestamp) {

    // printf("yuv %d %d %d %d %d %d\n", yuv[0], yuv[1], yuv[2], yuv[mVideoWith*mVideoHeight/2], yuv[mVideoWith*mVideoHeight/2+1], yuv[mVideoWith*mVideoHeight/2+2]);

    mJsObject.call<void>("yuvData", (unsigned int)yuv, timestamp);


}



EMSCRIPTEN_BINDINGS(my_module) {
     class_<VideoDecoder>("VideoDecoder")
    .constructor<val>()
    .function("setCodec", &VideoDecoder::setCodec)
    .function("decode", &VideoDecoder::decode)
    .function("clear", &VideoDecoder::clear);
}

