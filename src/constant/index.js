

 const AVType = {

    Video: 0x1,
    Audio: 0x2

};

 const VideoType = {

    H264: 0x1,
    H265: 0x2

};

const AudioType = {

    PCMA:  0x1,
    PCMU:  0x2,
    AAC:   0x4

};

const AACProfile = {
    AAC_MAIN: 1,
    AAC_LC: 2,
    AAC_SSR: 3
};

const PixelType = {

    YUV:   0x1,
    RGBA:  0x2,
};

const ADTS_HEADER_SIZE = 7;

const AAC_SAMPLE_RATE = [
    96000, 88200, 64000, 48000,
    44100, 32000, 24000, 22050,
    16000, 12000, 11025, 8000,
    7350, 0, 0, 0
  ];




const WORKER_SEND_TYPE = {
    init: 'init',
    setVideoCodec: 'setVideoCodec',
    decodeVideo: 'decodeVideo',
    setAudioCodec: 'setAudioCodec',
    decodeAudio: 'decodeAudio',
    reset: 'reset',
    destroy: 'destroy',
}


const WORKER_EVENT_TYPE = {
    created:'created',
    inited:'inited',
    destroyed: 'destroyed',
    videoInfo: 'videoInfo',
    yuvData: 'yuvData',
    audioInfo: 'audioInfo',
    pcmData: 'pcmData'
}





export {AVType, VideoType, AudioType, PixelType, ADTS_HEADER_SIZE, AAC_SAMPLE_RATE, AACProfile, WORKER_SEND_TYPE, WORKER_EVENT_TYPE};