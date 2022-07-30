# webgl-plot-utils

A quality of life wrapper for webgl-plot library. For creating simple, stacked real time plots.


![Capture](./Capture.PNG)


Usage:

```js

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;


    let sps = 512;
    let sps2 = 256;
    let nSec = 3;
    let nPointsRenderedPerSec = 512;

    const freq = 1;
    const amp = 0.5;
    const noise = 0.5;

    let line = new Array(sps*nSec);
    let line2 = new Array(sps2*nSec);


    let plotutil = new WebglLinePlotUtils(canvas);
    plotutil.initPlot(2,[sps,sps2],nSec,nPointsRenderedPerSec);

    function update(line=[],sps=512,sec=10) {
        let len = sps*sec;
        let tincr = sec/len;
        let time = 0;
        for (let i = 0; i < sps*sec; i++) {
            const ySin = 1+Math.sin(Math.PI * time * freq * Math.PI * 2 + (performance.now()*0.001));
            const yNoise = Math.random() - 0.5;
            line[i] = ySin * amp + yNoise * noise;
            time += tincr;
        }
    }

    let  newFrame = () => {
        update(line,sps,nSec);
        update(line2,sps2,nSec);
        //console.log(line);
        plotutil.updateAllLines([line,line2,line,line2,line,line2],[sps,sps2,sps,sps2,sps,sps2],true,false);
        plotutil.update();

        requestAnimationFrame(newFrame);
    }
    requestAnimationFrame(newFrame);

            

```
