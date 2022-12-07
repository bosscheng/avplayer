#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <sys/time.h>


#include <opencv2/opencv.hpp>


using namespace emscripten;
using namespace std;


//视频类型，全局统一定义，JS层也使用该定义

// const char *onnxPath = "/thirdparty/opencv/share/opencv4/face_detection_yunet_2022mar.onnx";
const char *onnxPath = "/thirdparty/opencv/share/opencv4/face_detection_yunet_2022mar-act_int8-wt_int8-quantized.onnx";


class FaceDetector {

public:

    val mJsObject;
    cv::Ptr<cv::FaceDetectorYN> mFaceDetector;
    unsigned char* mOutFaceYUV;
    int mCurrentWidth;
    int mCurrentHeight;


public:

    FaceDetector(val&& v);

    virtual ~FaceDetector();

    auto detect(string input, int width, int height);

    void clear();

};


FaceDetector::FaceDetector(val&& v) : mJsObject(move(v)) {

    mFaceDetector = cv::FaceDetectorYN::create(onnxPath, "", cv::Size(0, 0));
    mCurrentWidth = 0;
    mCurrentHeight = 0;
    mOutFaceYUV= NULL;

}

FaceDetector::~FaceDetector() {

    clear();

    printf("FaceDetector dealloc \n");

}


void FaceDetector::clear() {


}


auto FaceDetector::detect(string input, int width, int height) {

    // fmt::print("detectFace {}x{}\n", width, height);
    if (mCurrentWidth != width || mCurrentHeight != height) {
        printf("FaceDetector setInputSize %d, %d \n", width, height);
        mFaceDetector->setInputSize(cv::Size(width, height));
        mCurrentWidth = width;
        mCurrentHeight = height;

        if (!mOutFaceYUV) {
            free(mOutFaceYUV);
            mOutFaceYUV = NULL;
        }

        mOutFaceYUV = (unsigned char*)malloc(mCurrentWidth*mCurrentHeight*3/2);
    }

    struct timeval tv;
    gettimeofday(&tv,NULL);
    int start = tv.tv_sec*1000 + tv.tv_usec/1000;

    unsigned int inputImageBufferLen = input.length();
    unsigned char* inputImageBuffer = (unsigned char*)input.data();

    cv::Mat inputImageMat(height * 3 / 2, width, CV_8UC1, inputImageBuffer);

    cv::Mat bgrInputImageMat;
    cv::cvtColor(inputImageMat, bgrInputImageMat, cv::COLOR_YUV2BGR_I420);


    cv::Mat faces;
    mFaceDetector->detect(bgrInputImageMat, faces);

    gettimeofday(&tv,NULL);
    int stop = tv.tv_sec*1000 + tv.tv_usec/1000;

    printf("FaceDetector face: %dx%d@%d depth:%d detect face cosumetime %d\n", faces.cols, faces.rows,
               faces.channels(), faces.depth(), stop - start);

    for (int i = 0; i < faces.rows; ++i) {

        printf("FaceDetector face[%d] %f,%f,%f,%f\n", i, faces.at<float>(cv::Point(0, i)),
                faces.at<float>(cv::Point(1, i)),
                faces.at<float>(cv::Point(2, i)),
                faces.at<float>(cv::Point(3, i)));


        cv::rectangle(bgrInputImageMat,
                        cv::Rect(faces.at<float>(cv::Point(0, i)),
                                faces.at<float>(cv::Point(1, i)),
                                faces.at<float>(cv::Point(2, i)),
                                faces.at<float>(cv::Point(3, i))),
                        cv::Scalar(0, 255.0, 0), 2);
    }

    cv::Mat outputImageMat;
    cv::cvtColor(bgrInputImageMat, outputImageMat, cv::COLOR_BGR2YUV_I420);

    memcpy(mOutFaceYUV, outputImageMat.data, inputImageBufferLen);

    return (unsigned int)mOutFaceYUV;

}


EMSCRIPTEN_BINDINGS(my_module) {
     class_<FaceDetector>("FaceDetector")
    .constructor<val>()
    .function("detect", &FaceDetector::detect)
    .function("clear", &FaceDetector::clear);

}
