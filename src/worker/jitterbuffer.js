import EventEmitter from 'eventemitter3';


const JitterBufferStatus = {
    notstart: 'notstart',      //未开始
    bufferring : 'bufferring',  //开始，等待缓冲满
    bufferReady: 'bufferReady'        //buffer准备好了，可以播放了
}


const delayScale = 2.0;

class JitterBuffer extends EventEmitter {

    _vgop = [];
    _agop = [];
    _status = JitterBufferStatus.notstart;

    _firstpacketts = undefined; 
    _firstts = undefined;

    _player = undefined;
    
    _playTimer = undefined;
    _statisticTimer = undefined;
    
    constructor(player) {

        super();

        this._player = player;

        this._statisticTimer = setInterval(() => {

            this._player._logger.info('jitterbuffer', `video packet ${this._vgop.length} audio packet ${this._agop.length}`);
            
          }, 1000);


        let sec = 10; // 100 fps

        this._playTimer = setInterval(() => {

            this.playTicket();
            
            }, sec)

        this._player._logger.info('jitterbuffer', `start play video timer ${1000/sec} frames per second, delay ${this._player._options.delay}`);

    }

    reset() {

        this._agop = [];
        this._vgop = [];

        if (this._playTimer) {
            clearInterval(this._playTimer);
            this._playTimer = undefined;
        }

        this._status = JitterBufferStatus.notstart;
        this._firstpacketts = undefined; 
        this._firstts = undefined;

    }

    destroy() {

        this.reset();

        if (this._statisticTimer) {
            clearInterval(this._statisticTimer);
        }

        this.off();

        this._player._logger.info('JitterBuffer', 'JitterBuffer destroy');
    }


    playTicket() {

        if (this._status != JitterBufferStatus.bufferReady) {

            return;
        }

        let now = new Date().getTime();

        while(1) {

            if (this._vgop.length < 1) {

                break;
            }

            if (now - this._firstts < this._vgop[0].timestamp - this._firstpacketts) {
    
                break;
            }
    
            let avpacket = this._vgop.shift();
     
            this.emit('videopacket', avpacket);

        }

        while(1) {

            if (this._agop.length < 1) {

                break;
            }

            if (now - this._firstts < this._agop[0].timestamp - this._firstpacketts) {
    
                break;
            }
    
            let avpacket = this._agop.shift();
     
            this.emit('audiopacket', avpacket);
        }

        this.updateJitterBufferState();
    }

    pushAudio(avpacket) {

        this._agop.push(avpacket);

    }

    pushVideo(avpacket) {

        this._vgop.push(avpacket);
        this.updateJitterBufferState();
    }


    updateJitterBufferState() {

        let ret = true;

        while (ret) {

            ret = this.tryUpdateJitterBufferState();
        }

    }

    tryUpdateJitterBufferState() {

        let gop = this._vgop;

        if (this._status === JitterBufferStatus.notstart) {

            if (gop.length < 1) {

                return false;
            }

            this._status = JitterBufferStatus.bufferring;
            return true;

        } else if (this._status === JitterBufferStatus.bufferring) {

            if (gop.length < 2) {
                this._player._logger.warn('jitterbuffer', `now buffering, but gop len [${gop.length}] less than 2,`);
                return false;
            }

            if (gop[gop.length-1].timestamp - gop[0].timestamp > this._player._options.delay) {


                this._firstpacketts = gop[0].timestamp;
                this._firstts = new Date().getTime();
                this._status = JitterBufferStatus.bufferReady;

                this._player._logger.info('jitterbuffer', `gop buffer ok, delay ${this._player._options.delay}, last[${gop[gop.length-1].timestamp}] first[${gop[0].timestamp}] `);

                return true;
            }

            return false;

        } else if (this._status === JitterBufferStatus.bufferReady) {

            if (gop.length < 1) {

                this._player._logger.warn('jitterbuffer', `gop buffer is empty, restart buffering`);
                this._status = JitterBufferStatus.bufferring;
                return false;
            }

            this.tryDropFrames();

            return false;
            
        } else {

            this._player._logger.error('jitterbuffer',`jittbuffer status [${this._status}]  error !!!`);
        }

        return false;
    }


    tryDropFrames() {

        if (this._player._options.playMode !== 'live') {

          //  this._player._logger.error('jitterbuffer',`not drop frame!!!`);
            return;
        }

      //  this._player._logger.error('jitterbuffer',`drop frame [${this._player._options.playMode}] !!!`);

        let dropDelay = this._player._options.delay*delayScale;

        if (this._vgop.length < 2) {

            return;
        }

        if (this._vgop[this._vgop.length-1].timestamp - this._vgop[0].timestamp < dropDelay) {

            return;
        }


        let lastkeyindex = -1;
        for(let i = 0; i < this._vgop.length; i++) {

            let avpacket = this._vgop[i];

            if (avpacket.iskeyframe) {

                lastkeyindex = i;
            }

        }

        if (lastkeyindex >= 0) {

            let ts = this._vgop[lastkeyindex].timestamp;
            let lastaudioindex = -1;

            this._vgop = this._vgop.slice(lastkeyindex);

            for (let j = 0; j < this._agop.length; j++) {

                let avpacket = this._agop[j];
                if (avpacket.timestamp < ts) {

                    lastaudioindex = j;
                }
            }

            if (lastaudioindex >= 0) {

                if (lastaudioindex + 1 >= this._agop.length) {

                    this._agop = [];
                } else {
                    this._agop = this._agop.slice(lastaudioindex + 1);
                }
            }
        }

    }

}


export default JitterBuffer;