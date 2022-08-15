#ifndef  __DECODER_HEVC_H__
#define  __DECODER_HEVC_H__

#include "decodervideo.h"
#include <openHevcWrapper.h>

class Decoder_HEVC_OpenHevc : public DecoderVideo
{

    public:

         void    *mCodecCtx;            // Codec context
         int      mVideoWith;          
         int      mVideoHeight;
         unsigned char* mYUV;
         OpenHevc_Frame_cpy openHevcFrameCpy;

    public:

        Decoder_HEVC_OpenHevc(DecoderVideoObserver* obs);

        virtual void init();
        virtual void decode(unsigned char *buf, unsigned int buflen, unsigned int timestamp);
        virtual ~Decoder_HEVC_OpenHevc();
};




#endif