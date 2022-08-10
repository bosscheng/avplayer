#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/time.h>

#include <algorithm>
#include <memory>


#include <de265.h>

#include "log.h"
#include "decoder_hevc_bde.h"



Decoder_HEVC_BDE::Decoder_HEVC_BDE(DecoderVideoObserver* obs):DecoderVideo(obs), mVideoWith(0), mVideoHeight(0), mYUV(NULL) {

   mCodecCtx = de265_new_decoder();
}

Decoder_HEVC_BDE::~Decoder_HEVC_BDE() {

    if (mCodecCtx) {
          de265_free_decoder(mCodecCtx);
          mCodecCtx = NULL;
    }

    if (mYUV) {

        free(mYUV);
        mYUV = NULL;
    }

}


void Decoder_HEVC_BDE::init() {


}

void Decoder_HEVC_BDE::decode(unsigned char *buf, unsigned int buflen, unsigned int timestamp) {

    de265_error err = de265_push_data(mCodecCtx, buf, buflen, timestamp, NULL);

    if (err != DE265_OK){

        printf("de265_push_data err:%d \n", err);
        return;
    }

    int more = 0;
    do {
        err = de265_decode(mCodecCtx, &more);
        if (err != DE265_OK) {
            more = 0;
        }

        switch (err) {
            case DE265_ERROR_WAITING_FOR_INPUT_DATA:
            // ignore error (didn't exist in 0.4 and before)
            err = DE265_OK;
            break;
            default:
            break;
        }
    } while (more);


    const struct de265_image* image = de265_get_next_picture(mCodecCtx);

    if (image != NULL) {

        if (mVideoWith == 0 || mVideoHeight == 0) {

            mVideoWith = de265_get_image_width(image, 0);
            mVideoHeight = de265_get_image_height(image, 0);

            mYUV = (unsigned char*)malloc(mVideoWith*mVideoHeight*3/2);
            mObserver->videoInfo(mVideoWith, mVideoHeight);
        }

        int y_w = de265_get_image_width(image, 0);
        int y_h = de265_get_image_height(image, 0);
        int y_stride = 0;
        const uint8_t* y_data = de265_get_image_plane(image, 0, &y_stride);

        int u_w = de265_get_image_width(image, 1);
        int u_h = de265_get_image_height(image, 1);        
        int u_stride = 0;
        const uint8_t* u_data = de265_get_image_plane(image, 1, &u_stride);

        int v_w = de265_get_image_width(image, 2);
        int v_h = de265_get_image_height(image, 2);
        int v_stride = 0;
        const uint8_t* v_data = de265_get_image_plane(image, 2, &v_stride);

        int size = mVideoWith * mVideoHeight;

        if (y_w == y_stride) {

            memcpy(mYUV, y_data, y_w*y_h);

        } else {

            for (int i = 0; i < y_h; i++) {

                memcpy(mYUV + i*y_w, y_data + i*y_stride, y_w);
            }

        }

        if (u_w == u_stride) {

            memcpy(mYUV + size, u_data, size>>2);

        } else {

            for (int i = 0; i < u_h; i++) {

                memcpy(mYUV + size + i*u_w, u_data + i*u_stride, u_w);
            }

        }

        if (v_w == v_stride) {

            memcpy(mYUV + size*5/4, v_data, size>>2);

        } else {

            for (int i = 0; i < v_h; i++) {

                memcpy(mYUV + size*5/4 + i*v_w, v_data + i*v_stride, v_w);
            }

        }

        int pts = de265_get_image_PTS(image);

        mObserver->yuvData(mYUV, pts);

    } else {

       // printf("bde265 get pic is null \n");
    }
}




