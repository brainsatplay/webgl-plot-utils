
import {WebglLine, WebglThickLine, WebglPlot, ColorRGBA} from 'webgl-plot'

export type WebglLineProps = {
    values?:number[],
    color?:[number,number,number,number]|ColorRGBA,  
    position?:number, //stack position? default is the order you define the lines in this object or you can have them overlap
    autoscale?:boolean, //autoscale the data to -1 and 1 and stack, default true so you can just pass whatever
    centerZero?:boolean, //center the line at zero (if autoscaling), i.e. the positive and negative axis get the same amount of space, default false
    xAxis?:boolean, //draw an xaxis, default true
    xColor?:[number,number,number,number]|ColorRGBA, //default gray and transparent
    width?:number, //use thick triangle strip lines instead, 6x slower!!
    interpolate?:boolean, //we can up or downsample data provided to update arrays, else we will use the end of the array for the slice (assuming you're pushing to an array and visualizing the incoming data)
    useOverlay?:boolean, //specify if you want this line to print, set false for overlapping lines to prevent printing on top of each other (for now)
    [key:string]:any
} & (
    { //define a fixed number of points
        nPoints:number
    }|{ //or define by number of seconds + samplerate
        nSec:number, 
        sps:number
    })

export type WebglLinePlotProps = {
    canvas:HTMLCanvasElement,
    width?:number,
    height?:number,
    webglOptions?:{
        antialias?:boolean,
        transparent?:boolean,
        desynchronized?:boolean,
        powerPerformance?:'default'|'high-performance'|'low-power',
        preserveDrawing?:boolean,
        debug?:boolean
    },
    overlay?:HTMLCanvasElement|boolean, //automatically print the max and min values of the stacked lines
    lines:{
        [key:string]:WebglLineProps|number[]
    },
    dividerColor?:[number,number,number,number]|ColorRGBA, //default gray
    generateNewLines?:boolean, //if unrecognized lines are in an update, reinit the plot?
    cleanGeneration?:boolean, //on regeneration, remove any lines not in the current update?
    [key:string]:any
}

export type WebglLinePlotInfo = {
    plot:WebglPlot,
    settings:WebglLinePlotProps, //settings, modified
    initial:WebglLinePlotProps, //original unmodified settings
    anim:any
}

export class WebglLinePlotUtil {

    plots:{[key:string]:WebglLinePlotInfo} = {};

    //initialize a plot with 
    initPlot(settings:WebglLinePlotProps, plot?:WebglPlot) {

        if(!plot)
            plot = new WebglPlot(settings.canvas,settings.webglOptions);

        if(!settings._id) {
            settings._id = `plot${Math.floor(Math.random()*1000000000000000)}`;
        } else if(this.plots[settings._id]) {
            let oldsettings = this.plots[settings._id].settings;
            settings = Object.assign(oldsettings, settings);
        }


        if(settings.overlay) { //be sure to transfer this on workers
            if(typeof settings.overlay !== 'object') {
                settings.overlay = document.createElement('canvas');
                settings.overlay.style.position = 'absolute';
                settings.overlay.width = settings.canvas.width;
                settings.overlay.height = settings.canvas.height;
                settings.canvas.appendChild(settings.overlay);
            }
            if(!settings.overlayCtx) settings.overlayCtx = settings.overlay.getContext('2d');
        }
        
        if(settings.width) {
            settings.canvas.width = settings.width;
            if(settings.canvas.style) settings.canvas.style.width = settings.width+'px';
            if(typeof settings.overlay === 'object') {
                settings.overlay.width = settings.width;
                if(settings.overlay.style) settings.overlay.style.width = settings.width+'px';
            }
        }
        if(settings.height) {
            settings.canvas.height = settings.height;
            if(settings.canvas.style) settings.canvas.style.height = settings.height+'px';
            if(typeof settings.overlay === 'object') {
                settings.overlay.height = settings.height;
                if(settings.overlay.style) settings.overlay.style.height = settings.height+'px';
            }
        }

        let initialLns = {};
        for(const key in settings.lines) {
            initialLns[key] = Object.assign({},initialLns[key])
        }

        let info:any = {
            plot,
            settings,
            initial:Object.assign(Object.assign({},settings),{lines:initialLns}),
            anim:()=>{ plot.update() } //run in requestAnimationFrame to throttle FPS
        };
       
        this.plots[settings._id] = info;

        let i = 0;
        let nLines = Object.keys(settings.lines).length;
        settings.nLines = nLines;
        for(const line in settings.lines) {
            let s = settings.lines[line] as any;

            if(Array.isArray(s)) {
                s = {
                    values:s,
                };
                settings.lines[line] = s;
            }

            if(s.color) {
                if(Array.isArray(s.color)) {
                    s.color = new ColorRGBA(...s.color as [number,number,number,number]);
                }
            } else {
                let rgb = WebglLinePlotUtil.HSLToRGB(360*(i/nLines)%360,100,50,1);
                s.color = new ColorRGBA(...rgb, 1);
            }

            let points;
            if(s.nPoints)
                points = s.nPoints; 
            else if(s.nSec && s.sps)
                points = Math.ceil(s.nSec*s.sps);
            else if(s.values) points=s.values.length;

            if(!points) return;
            s.points = points;

            if(s.width) {
                s.line = new WebglThickLine(s.color, points, s.width);
            }
            else s.line = new WebglLine(s.color, points);

            s.line.arrangeX();

            //console.log(JSON.stringify(s.values));
            if(s.values) {
                if(settings.overlay) {
                    let max = Math.max(...s.values);
                    let min = Math.min(...s.values);
                    s.ymin = min;
                    s.ymax = max;
                }
                if(s.values.length !== points) {
                    if(s.interpolate) {
                        if(s.values.length > points) {
                            s.values = WebglLinePlotUtil.downsample(s.values, points);
                        } else if (s.values.length < points) {
                            s.values = WebglLinePlotUtil.upsample(s.values, points);
                        }
                    } else {
                        if(s.values.length > s.points) s.values = s.values.slice(s.values.length-s.points);
                        else s.values = [...new Array(s.points-s.values.length).fill(0), ...s.values];
                    }
                }
            } else s.values = new Array(points).fill(0);
            //console.log('before',JSON.stringify(s.values));

            if(!('autoscale' in s)) s.autoscale = true; 
            if(!s.position) s.position = settings.nLines - i - 1;
            if(s.autoscale) {
                s.values = WebglLinePlotUtil.autoscale(s.values, s.position ? s.position : i, nLines, s.centerZero);
            }
            //console.log('after',JSON.stringify(s.values));

            s.values.forEach((y,i) => s.line.setY(i,y));

            plot.addDataLine(s.line);

            if(!('xAxis' in s)) s.xAxis = true; 

            if(s.xAxis) {
                if(s.xColor) {
                    if(Array.isArray(s.xColor)) 
                        s.xColor = new ColorRGBA(...s.xColor as [number,number,number,number]);
                } else s.xColor = new ColorRGBA(1,1,1,0.3);

                let x = new WebglLine(s.xColor,2);
                let xHeight = (i+1)*2/nLines-1-1/nLines;
                if(s.autoscale) x.constY(xHeight);
                else x.constY(0.5); //just use center line
                x.arrangeX();
                x.xy[2] = 1;

                s.x = x;
            
                plot.addAuxLine(x);
            }

            if(nLines > 1 && s.autoscale && i !== nLines-1) {
                if(settings.dividerColor) {
                    if(Array.isArray(settings.dividerColor)) settings.dividerColor = new ColorRGBA(...settings.dividerColor as [number,number,number,number]);
                } else settings.dividerColor = new ColorRGBA(1,1,1,1);
                let divider = new WebglLine(settings.dividerColor,2);
                divider.constY((i+1)*2/nLines - 1);
                divider.arrangeX();
                divider.xy[2] = 1;

                s.divider = divider;

                plot.addAuxLine(divider);
            }
            
            i++;
        }

        if(typeof settings.overlay === 'object') {
            let canvas = settings.overlay;
            let ctx = settings.overlayCtx as CanvasRenderingContext2D;
            ctx.clearRect(0,0,settings.overlay.width,settings.overlay.height);
            ctx.font = '1em Courier';
            ctx.fillStyle = 'white';
            for(const line in settings.lines) {
                let s = settings.lines[line] as WebglLineProps;
                if(s.useOverlay || !('useOverlay' in s)) {
                    let pos = settings.nLines - s.position - 1;
                    ctx.fillText(line, 20,canvas.height*(pos as number + 0.1)/settings.nLines);
                    ctx.fillText(s.ymax, canvas.width - 70,canvas.height*(pos as number + 0.1)/settings.nLines);
                    ctx.fillText(s.ymin, canvas.width - 70,canvas.height*(pos as number + 0.9)/settings.nLines);
                }
            }
        }

        //console.log(plot, this.plots[settings._id])
        //plot.update();
        requestAnimationFrame(info.anim);

        //console.log('init plot with settings', settings);
        return this.plots[settings._id];

    }

    deinitPlot(info:WebglLinePlotInfo|string) {
        if(typeof info === 'string') info = this.plots[info];
        info.plot.clear();
        info.plot.removeAllLines();

        return true;
    }

    //apply new settings e.g. color, width, nPoints, etc.
    reinitPlot(info:WebglLinePlotInfo|string, settings:WebglLinePlotProps) {
        if(typeof info === 'string') info = this.plots[info];
        if(!info.plot) return undefined;
        info.plot.clear();
        info.plot.removeAllLines();
        if(info.settings.overlayCtx) info.settings.overlayCtx.clearRect(0,0,(info.settings.overlay as any)?.width,(info.settings.overlay as any)?.height)
        return this.initPlot(settings,info.plot);
    }

    getChartSettings(plotId:string) {
        let info = this.plots[plotId];
        if(info) {
            let settings = Object.assign({},info.initial);

            //remove any non jsonifiable stuff
            delete settings.canvas;
            delete settings.overlay;
            delete settings.overlayCtx;
            //console.log(settings);
            return settings;
        } return undefined;
    }

    //pass the info object and the lines you want to update
    update(
        plotInfo:WebglLinePlotInfo|string, 
        lines?:{
            [key:string]:WebglLineProps|number[]| { [key: string]: any; values: number[]; }
        }, 
        draw:boolean=true
    ) {
        if(typeof plotInfo === 'string') plotInfo = this.plots[plotInfo];
        if(!plotInfo) return false;
        if(lines) {
            let regenerate = false;
            for(const line in lines) {
                if(plotInfo.settings.lines[line]) {
                    let s = plotInfo.settings.lines[line] as any;
                    let oldvalues = s.values;
                    if(Array.isArray(lines[line])) s.values = lines[line];
                    else Object.assign(s,lines[line]);
                    if(s.values) {
                        if(plotInfo.settings.overlay) {
                            let max = Math.max(...s.values);
                            let min = Math.min(...s.values);
                            s.ymin = min;
                            s.ymax = max;
                        }
                        if(s.autoscale) {
                            s.values = WebglLinePlotUtil.autoscale(s.values, s.position, plotInfo.settings.nLines, s.centerZero);
                        }
                        if(s.values.length !== s.points) {
                            if(s.interpolate) {
                                if(s.values.length > s.points) {
                                    s.values = WebglLinePlotUtil.downsample(s.values, s.points);
                                } else if (s.values.length < s.points) {
                                    s.values = WebglLinePlotUtil.upsample(s.values, s.points);
                                }
                            } else {
                                if(s.values.length > s.points) s.values = s.values.slice(s.values.length-s.points);
                                else s.values = [...oldvalues.slice(s.values.length), ...s.values]; //circular buffer
                            }
                        }
                        s.values.forEach((y,i) => s.line.setY(i,y));
                    }
                }
                else if(plotInfo.settings.generateNewLines) {
                    if(Array.isArray(lines[line])) {
                        lines[line] = {values: lines[line] as number[]};
                    }
                    if(!(lines[line] as any).nSec && !(lines[line] as any).nPoints) {
                        (lines[line] as any).nPoints = 1000;
                    }
                    regenerate = true;
                }
            }

            if(regenerate) {
                if(plotInfo.settings.cleanGeneration) {
                    Object.keys(plotInfo.initial.lines).forEach((k) => {
                        if(!lines[k]) delete (plotInfo as any).initial[k];
                    })
                    Object.keys(lines).forEach((k) => {
                        if(!(plotInfo as any).initial.lines[k]) {
                            (plotInfo as any).initial.lines[k] = lines[k];
                        }
                    })
                }
                this.reinitPlot(plotInfo,plotInfo.initial);
                return true;
            }
        }

        if(typeof plotInfo.settings.overlay === 'object') {
            let canvas = plotInfo.settings.overlay;
            let ctx = plotInfo.settings.overlayCtx as CanvasRenderingContext2D;
            ctx.clearRect(0,0,plotInfo.settings.overlay.width,plotInfo.settings.overlay.height);
            ctx.font = '1em Courier';
            ctx.fillStyle = 'white';
            for(const line in plotInfo.settings.lines) {
                let s = plotInfo.settings.lines[line] as WebglLineProps;
                if(s.useOverlay || !('useOverlay' in s)) {
                    let pos = plotInfo.settings.nLines - s.position - 1;
                    ctx.fillText(line, 20,canvas.height*(pos as number + 0.1)/plotInfo.settings.nLines);
                    ctx.fillText(s.ymax, canvas.width - 70,canvas.height*(pos as number + 0.1)/plotInfo.settings.nLines);
                    ctx.fillText(s.ymin, canvas.width - 70,canvas.height*(pos as number + 0.9)/plotInfo.settings.nLines);
                }
            }
        }

        if(draw) //plotInfo.plot.update(); //redraw
            requestAnimationFrame(plotInfo.anim);
        return true;
    }
    
    //provides a little more situational control over the plot
    updateLine(
        line:WebglLine|WebglThickLine, 
        values:number[], 
        interpolate?:boolean, 
        autoscale?:boolean, 
        autoscalePosition?:number, 
        nLines?:number, 
        centerZero?:boolean
    ) {
        if(line.numPoints !== values.length) {
            if(interpolate) {
                if(line.numPoints > values.length) {
                    values = WebglLinePlotUtil.downsample(values, line.numPoints);
                } else if (line.numPoints < values.length) {
                    values = WebglLinePlotUtil.upsample(values, line.numPoints);
                }
            } else {
                if(values.length > line.numPoints) values = values.slice(values.length-line.numPoints);
                else values = [...new Array(values.length).fill(0), ...values];
            } 
        }
        if(autoscale) {
            values = WebglLinePlotUtil.autoscale(values, autoscalePosition, nLines, centerZero);
        }
        values.forEach((y,i) => line.setY(i,y));

        return true;
    }

    //autoscale array to -1 and 1
    static autoscale(array, lineIdx=0, nLines=1, centerZero=false) {
        if(array?.length === 0 ) return array;
        let max = Math.max(...array)
        let min = Math.min(...array);

        let _lines = 1/nLines;
        let scalar = 1;
        if(centerZero) {
            let absmax = Math.max(Math.abs(min),Math.abs(max));
            if(absmax !== 0) scalar = _lines/absmax;
            return array.map(y => (y*scalar+(_lines*(lineIdx+1)*2-1-_lines))); //scaled array
        }
        else {
            if(max === min) {
                if(max !== 0) {
                    scalar = _lines/max;
                }
            }
            else scalar = _lines/(max-min);
            return array.map(y => (2*((y-min)*scalar-(1/(2*nLines)))+(_lines*(lineIdx+1)*2-1-_lines))); //scaled array
        }
    }


    //absolute value maximum of array (for a +/- valued array)
    static absmax(array) {
        return Math.max(Math.abs(Math.min(...array)),Math.max(...array));
    }

    //averages values when downsampling.
    static downsample(array, fitCount, scalar=1) {

        if(array.length > fitCount) {        
            let output = new Array(fitCount);
            let incr = array.length/fitCount;
            let lastIdx = array.length-1;
            let last = 0;
            let counter = 0;
            for(let i = incr; i < array.length; i+=incr) {
                let rounded = Math.round(i);
                if(rounded > lastIdx) rounded = lastIdx;
                for(let j = last; j < rounded; j++) {
                    output[counter] += array[j];
                }
                output[counter] /= (rounded-last)*scalar;
                counter++;
                last = rounded;
            }
            return output;
        } else return array; //can't downsample a smaller array
    }

    //Linear upscaling interpolation from https://stackoverflow.com/questions/26941168/javascript-interpolate-an-array-of-numbers. Input array and number of samples to fit the data to
	static upsample(array, fitCount, scalar=1) {

		var linearInterpolate = function (before, after, atPoint) {
			return (before + (after - before) * atPoint)*scalar;
		};

		var newData = new Array(fitCount);
		var springFactor = (array.length - 1) / (fitCount - 1);
		newData[0] = array[0]; // for new allocation
		for ( var i = 1; i < fitCount - 1; i++) {
			var tmp = i * springFactor;
			var before = Math.floor(tmp);
			var after =  Math.ceil(tmp);
			var atPoint = tmp - before;
			newData[i] = linearInterpolate(array[before], array[after], atPoint);
		}
		newData[fitCount - 1] = array[array.length - 1]; // for new allocation
		return newData;
	};

    static interpolate(array:number[], fitCount:number, scalar=1) {
        if(array.length > fitCount) {
            return WebglLinePlotUtil.downsample(array, fitCount, scalar);
        } else if(array.length < fitCount) {
            return WebglLinePlotUtil.upsample(array, fitCount, scalar);
        }
        return array;
    }

    static HSLToRGB(h,s,l, scalar=255):[number,number,number] {
        // Must be fractions of 1
        s /= 100;
        l /= 100;
      
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
            r = 0,
            g = 0,
            b = 0;
     
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;  
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = (r + m) * scalar;
        g = (g + m) * scalar;
        b = (b + m) * scalar;

        return [r,g,b];
    }

    //push new entries to end of array and roll over starting entries with a set array length
    static circularBuffer(arr:any[],newEntries:any[]) {
        if(newEntries.length < arr.length)
            arr.splice(
                0,
                arr.length-newEntries.length,
                ...arr.slice(newEntries.length)
            ).splice(
                    newEntries.length,
                    arr.length,
                    ...newEntries
                );
        else if (newEntries.length > arr.length) {
            arr.splice(0,arr.length,newEntries.slice(newEntries.length-arr.length));
        }
        else { 
            arr.splice(0,arr.length,...newEntries);
        }
        
        return arr;
    }

    //e.g. mimic arduino serial plotter data, make sure we return an object of key:array pairs
    static formatDataForCharts(
        data:{
            [key:string]:number[]|number|{values:number[]|number,[key:string]:any}
        }|string|((number|number[])[])|number, 
        key?:string //if passing a single value
    ) {
        //take incoming data formats and return them in the format that our charting library likes so we can blindly pass stuff in
        if (Array.isArray(data)) {
            if(Array.isArray(data[0])) {
                let d = {};
                data.forEach((arr,i) => {
                    d[i] = arr;
                });
                data = d;
                if(isNaN(data[0][0])) return undefined;//throw new Error(`Invalid data format: ${data}`);
            }
            else if(key) {
                data = {[key]:data} as any;
                if(isNaN(data[key][0]))  return undefined;//throw new Error(`Invalid data format: ${data}`);
            }
            else {
                data = {0:data} as any;
                if(isNaN(data[0][0]))  return undefined;//throw new Error(`Invalid data format: ${data}`);
            }
        } else if(typeof data === 'object') { //swap incoming key:value pairs into our charting library format
            for(const key in data) {
                if(typeof data[key] === 'number') data[key] = [data[key] as number];
                else if ((data[key] as any)?.values) {
                    if(typeof (data[key] as any).values === 'number') 
                        (data[key] as any).values = [(data[key] as any).values];
                }
                if(isNaN(data[key][0]))  return undefined;//throw new Error(`Invalid data format: ${data}`);
                
            }
        }
        else if (typeof data === 'string') { //let's parse different string formats 
            let split:any;
            if(data.includes('\t')) {
                split = data.split('\t');
            } else if (data.includes(',')) {
                split = data.split(',');
            } 
            data = {};
            if(split) {
                split.forEach((val,i) => {
                    if(val.includes(':')) {
                        let [key,v] = val.split(':');
                        let fl = parseFloat(v);
                        if(fl) data[key] = [fl];
                        else return undefined;
                    } else {
                        let fl = parseFloat(val);
                        if(fl) data[i] = [fl];
                        else return undefined;
                    }
                });
            }
        } else if (typeof data === 'number') {
            if(key) data = {[key]:[data]};    
            else data = {0:[data]};
        }
    
        return data;// as {[key:string]:(number[]|{values:number[],[key:string]:any}|WebglLineProps)};
    }

    //pad an array based on a time interval between sample sets, averaging slope
    static padTime(
        data:number[], //new data, assumed to be sequential between a gap
        lastValue:number, //the last data point before the gap
        time:number,    //interval that's passed to determine slope between samples
        targetFit:number //e.g. time(s) * sps i.e. if our chart expects a certain number of points per second to stay consistent
    ) {
        let slopeIncr = ((data[0]-lastValue) / time) / targetFit;
        let padded = [...new Array(targetFit - data.length).map((_,i) => lastValue + slopeIncr*(i+1)),...data];

        return padded;
    }

    static interpolateForTime(
        data:number[], //new data, assumed to be evenly spread over a time interval
        time:number, //the time interval passed (s)
        targetSPS:number //number of points per second expected by graph
    ) {
        return WebglLinePlotUtil.interpolate(data, Math.ceil(targetSPS*time));
    }

}