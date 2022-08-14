#ifndef  __DECODER_HEVC_H__
#define  __DECODER_HEVC_H__

#include "decodervideo.h"

class Decoder_HEVC_BDE : public DecoderVideo
{

    public:

         void    *mCodecCtx;            // Codec context
         int      mVideoWith;          
         int      mVideoHeight;
         unsigned char* mYUV;

    public:

        Decoder_HEVC_BDE(DecoderVideoObserver* obs);

        virtual void init();
        virtual void decode(unsigned char *buf, unsigned int buflen, unsigned int timestamp);
        virtual ~Decoder_HEVC_BDE();
};




#endif