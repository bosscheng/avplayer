# avplayer
    avplayer 是一个流媒体播放器，支持http-flv格式流，主要特性
    
    （1） 视频支持 h264/h265, 支持I/P/B帧
    （2） 声音支持aac/pcmu/pcma
    （3） 解码支持两种模式：
            soft: 正常软解码
            soft-simd:   支持SIMD加速软解码
     (4)  实现了自定义的渲染方式renderMode
            normal: 正常渲染
            green: 图像如果带绿幕，绿幕部分抠图成透明
            mask：图像右半部分带掩码图，则左半部显示并抠图成透明
            cube: 渲染立方体显示



# 编译解码模块
    本工程解码部分使用 wasm技术，通过emcc容器编译

    (1) 启动emcc容器,把工程路径映射进容器里（windows/mac 先安装 Docker Desktop， linux上先安装 docker）
        docker run -itd -v "avplayer project path":/src --name emsdk --privileged=true  emscripten/emsdk

        编译wasm需要进入emcc容器里
        docker exec -it emsdk /bin/bash

    (2) 编译 FFmpeg
        
        cd FFmpeg
        python3 build.py

    (3) 编译 libavc
        
        cd thirdparty/libavc
        python3 build.py

    (4) 编译 libhevc
        
        cd thirdparty/libhevc
        python3 build.py

    (5) 编译 音频解码 wasm
    
        cd wasm
        python3 make_audiodec.py

    (6) 编译 视频解码 wasm

        cd wasm
        python3 make_videodec.py     

    (7) 编译 视频解码 SIMD wasm 

        cd wasm
        python3 make_videodec_simd.py     


# 工程打包
   
    npm config set registry https://registry.npm.taobao.org
    npm install
    npx cross-env NODE_ENV=development rollup -c 

# 运行Demo

    demo/public 目录下，使用 Live Server (VSCode的用于调试html的插件) 打开 demo.html


# Demo H5编译docker image

    基于nginx镜像构建

    docker build -f Dockerfile -t tdcr5/avplayer:0.5.0 .
    docker push tdcr5/avplayer:0.5.0



# 运行docker image

docker run --name avplayer -itd -p 9080:80 tdcr5/avplayer:0.5.0





