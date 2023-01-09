var b=class{constructor(e,t,s,h){this.r=e,this.g=t,this.b=s,this.a=h}},x=class{constructor(){this.scaleX=1,this.scaleY=1,this.offsetX=0,this.offsetY=0,this.loop=!1,this._vbuffer=0,this._coord=0,this.visible=!0,this.intensity=1,this.xy=new Float32Array([]),this.numPoints=0,this.color=new b(0,0,0,1),this.webglNumPoints=0}},v=class extends x{constructor(e,t){super(),this.currentIndex=0,this.webglNumPoints=t,this.numPoints=t,this.color=e,this.xy=new Float32Array(2*this.webglNumPoints)}setX(e,t){this.xy[e*2]=t}setY(e,t){this.xy[e*2+1]=t}getX(e){return this.xy[e*2]}getY(e){return this.xy[e*2+1]}lineSpaceX(e,t){for(let s=0;s<this.numPoints;s++)this.setX(s,e+t*s)}arrangeX(){this.lineSpaceX(-1,2/this.numPoints)}constY(e){for(let t=0;t<this.numPoints;t++)this.setY(t,e)}shiftAdd(e){let t=e.length;for(let s=0;s<this.numPoints-t;s++)this.setY(s,this.getY(s+t));for(let s=0;s<t;s++)this.setY(s+this.numPoints-t,e[s])}addArrayY(e){if(this.currentIndex+e.length<=this.numPoints)for(let t=0;t<e.length;t++)this.setY(this.currentIndex,e[t]),this.currentIndex++}replaceArrayY(e){if(e.length==this.numPoints)for(let t=0;t<this.numPoints;t++)this.setY(t,e[t])}};var Y=(f,e,t)=>{let s={x:0,y:0};return s.x=f.x+e.x*t,s.y=f.y+e.y*t,s},_=f=>P(-f.y,f.x),w=(f,e)=>{let t=T(f,e);return t=M(t),t},S=(f,e)=>{let t={x:0,y:0};return t.x=f.x+e.x,t.y=f.y+e.y,t},R=(f,e)=>f.x*e.x+f.y*e.y,M=f=>{let e={x:0,y:0},t=f.x*f.x+f.y*f.y;return t>0&&(t=1/Math.sqrt(t),e.x=f.x*t,e.y=f.y*t),e},P=(f,e)=>{let t={x:0,y:0};return t.x=f,t.y=e,t},T=(f,e)=>{let t={x:0,y:0};return t.x=f.x-e.x,t.y=f.y-e.y,t},C=f=>{let e,t={x:0,y:0},s={x:0,y:0},h=[],r=(n,l)=>{h.push({vec2:n,miterLength:l})},a=n=>({x:f[n*2],y:f[n*2+1]});t=w(a(1),a(0)),e=_(t),r(e,1);let o=f.length/2;for(let n=1;n<o-1;n++){let l=a(n-1),i=a(n),u=a(n+1);t=w(i,l),e=_(t),s=w(u,i);let c=F(t,s),g=N(t,c,1);r(c,g)}return t=w(a(o-1),a(o-2)),e=_(t),r(e,1),h},F=(f,e)=>{let t=S(f,e);return t=M(t),P(-t.y,t.x)},N=(f,e,t)=>{let s=P(-f.y,f.x);return t/R(e,s)},d=class extends x{constructor(e,t,s){super(),this.currentIndex=0,this._thicknessRequested=0,this._actualThickness=0,this.webglNumPoints=t*2,this.numPoints=t,this.color=e,this._thicknessRequested=s,this._linePoints=new Float32Array(t*2),this.xy=new Float32Array(2*this.webglNumPoints)}convertToTriPoints(){let e=this._actualThickness/2,t=C(this._linePoints);for(let s=0;s<this.numPoints;s++){let h=this._linePoints[2*s],r=this._linePoints[2*s+1],a={x:h,y:r},o=Y(a,t[s].vec2,t[s].miterLength*e),n=Y(a,t[s].vec2,-t[s].miterLength*e);this.xy[s*4]=o.x,this.xy[s*4+1]=o.y,this.xy[s*4+2]=n.x,this.xy[s*4+3]=n.y}}setX(e,t){this._linePoints[e*2]=t}setY(e,t){this._linePoints[e*2+1]=t}lineSpaceX(e,t){for(let s=0;s<this.numPoints;s++)this.setX(s,e+t*s)}setThickness(e){this._thicknessRequested=e}getThickness(){return this._thicknessRequested}setActualThickness(e){this._actualThickness=e}},A=class{constructor(e,t){this.debug=!1,this.addLine=this.addDataLine,t==null?this.webgl=e.getContext("webgl",{antialias:!0,transparent:!1}):(this.webgl=e.getContext("webgl",{antialias:t.antialias,transparent:t.transparent,desynchronized:t.deSync,powerPerformance:t.powerPerformance,preserveDrawing:t.preserveDrawing}),this.debug=t.debug==null?!1:t.debug),this.log("canvas type is: "+e.constructor.name),this.log(`[webgl-plot]:width=${e.width}, height=${e.height}`),this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[],this.gScaleX=1,this.gScaleY=1,this.gXYratio=1,this.gOffsetX=0,this.gOffsetY=0,this.gLog10X=!1,this.gLog10Y=!1,this.webgl.clear(this.webgl.COLOR_BUFFER_BIT),this.webgl.viewport(0,0,e.width,e.height),this._progLine=this.webgl.createProgram(),this.initThinLineProgram(),this.webgl.enable(this.webgl.BLEND),this.webgl.blendFunc(this.webgl.SRC_ALPHA,this.webgl.ONE_MINUS_SRC_ALPHA)}get linesData(){return this._linesData}get linesAux(){return this._linesAux}get thickLines(){return this._thickLines}get surfaces(){return this._surfaces}_drawLines(e){let t=this.webgl;e.forEach(s=>{if(s.visible){t.useProgram(this._progLine);let h=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(h,!1,new Float32Array([s.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,s.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let r=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(r,new Float32Array([s.offsetX+this.gOffsetX,s.offsetY+this.gOffsetY]));let a=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(a,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let o=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(o,[s.color.r,s.color.g,s.color.b,s.color.a]),t.bufferData(t.ARRAY_BUFFER,s.xy,t.STREAM_DRAW),t.drawArrays(s.loop?t.LINE_LOOP:t.LINE_STRIP,0,s.webglNumPoints)}})}_drawSurfaces(e){let t=this.webgl;e.forEach(s=>{if(s.visible){t.useProgram(this._progLine);let h=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(h,!1,new Float32Array([s.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,s.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let r=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(r,new Float32Array([s.offsetX+this.gOffsetX,s.offsetY+this.gOffsetY]));let a=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(a,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let o=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(o,[s.color.r,s.color.g,s.color.b,s.color.a]),t.bufferData(t.ARRAY_BUFFER,s.xy,t.STREAM_DRAW),t.drawArrays(t.TRIANGLE_STRIP,0,s.webglNumPoints)}})}_drawTriangles(e){let t=this.webgl;t.bufferData(t.ARRAY_BUFFER,e.xy,t.STREAM_DRAW),t.useProgram(this._progLine);let s=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(s,!1,new Float32Array([e.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,e.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let h=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(h,new Float32Array([e.offsetX+this.gOffsetX,e.offsetY+this.gOffsetY]));let r=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(r,new Int32Array([0,0]));let a=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(a,[e.color.r,e.color.g,e.color.b,e.color.a]),t.drawArrays(t.TRIANGLE_STRIP,0,e.xy.length/2)}_drawThickLines(){this._thickLines.forEach(e=>{if(e.visible){let t=Math.min(this.gScaleX,this.gScaleY);e.setActualThickness(e.getThickness()/t),e.convertToTriPoints(),this._drawTriangles(e)}})}update(){this.clear(),this.draw()}draw(){this._drawLines(this.linesData),this._drawLines(this.linesAux),this._drawThickLines(),this._drawSurfaces(this.surfaces)}clear(){this.webgl.clear(this.webgl.COLOR_BUFFER_BIT)}_addLine(e){e._vbuffer=this.webgl.createBuffer(),this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER,e._vbuffer),this.webgl.bufferData(this.webgl.ARRAY_BUFFER,e.xy,this.webgl.STREAM_DRAW),e._coord=this.webgl.getAttribLocation(this._progLine,"coordinates"),this.webgl.vertexAttribPointer(e._coord,2,this.webgl.FLOAT,!1,0,0),this.webgl.enableVertexAttribArray(e._coord)}addDataLine(e){this._addLine(e),this.linesData.push(e)}addAuxLine(e){this._addLine(e),this.linesAux.push(e)}addThickLine(e){this._addLine(e),this._thickLines.push(e)}addSurface(e){this._addLine(e),this.surfaces.push(e)}initThinLineProgram(){let e=`
      attribute vec2 coordinates;
      uniform mat2 uscale;
      uniform vec2 uoffset;
      uniform ivec2 is_log;

      void main(void) {
         float x = (is_log[0]==1) ? log(coordinates.x) : coordinates.x;
         float y = (is_log[1]==1) ? log(coordinates.y) : coordinates.y;
         vec2 line = vec2(x, y);
         gl_Position = vec4(uscale*line + uoffset, 0.0, 1.0);
      }`,t=this.webgl.createShader(this.webgl.VERTEX_SHADER);this.webgl.shaderSource(t,e),this.webgl.compileShader(t);let s=`
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`,h=this.webgl.createShader(this.webgl.FRAGMENT_SHADER);this.webgl.shaderSource(h,s),this.webgl.compileShader(h),this._progLine=this.webgl.createProgram(),this.webgl.attachShader(this._progLine,t),this.webgl.attachShader(this._progLine,h),this.webgl.linkProgram(this._progLine)}popDataLine(){this.linesData.pop()}removeAllLines(){this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[]}removeDataLines(){this._linesData=[]}removeAuxLines(){this._linesAux=[]}viewport(e,t,s,h){this.webgl.viewport(e,t,s,h)}log(e){this.debug&&console.log("[webgl-plot]:"+e)}};var y=class{constructor(){this.plots={}}initPlot(e,t){if(t||(t=new A(e.canvas,e.webglOptions)),!e._id)e._id=`plot${Math.floor(Math.random()*1e15)}`;else if(this.plots[e._id]){let l=this.plots[e._id].initial;if(e.lines){for(let i in e.lines)if(l.lines[i]&&Array.isArray(e.lines[i])){let u=e.lines[i];e.lines[i]=l.lines[i]}}e=Object.assign(l,e)}e.overlay&&(typeof e.overlay!="object"&&(e.overlay=document.createElement("canvas"),e.overlay.style.position="absolute",e.overlay.width=e.canvas.width,e.overlay.height=e.canvas.height,e.canvas.appendChild(e.overlay)),e.overlayCtx||(e.overlayCtx=e.overlay.getContext("2d"))),e.width&&(e.canvas.width=e.width,e.canvas.style&&(e.canvas.style.width=e.width+"px"),typeof e.overlay=="object"&&(e.overlay.width=e.width,e.overlay.style&&(e.overlay.style.width=e.width+"px"))),e.height&&(e.canvas.height=e.height,e.canvas.style&&(e.canvas.style.height=e.height+"px"),typeof e.overlay=="object"&&(e.overlay.height=e.height,e.overlay.style&&(e.overlay.style.height=e.height+"px"))),e.lines?.timestamp&&delete e.lines.timestamp,e.lines||(e.lines={});let s={};for(let l in e.lines)s[l]=Object.assign({},s[l]),"viewing"in e.lines[l]||(e.lines[l].viewing=!0),s[l].viewing=e.lines[l].viewing,s[l].sps=e.lines[l].sps,s[l].nSec=e.lines[l].nSec,s[l].nPoints=e.lines[l].nPoints,s[l].ymin=e.lines[l].ymin,s[l].ymax=e.lines[l].ymax,s[l].units=e.lines[l].units;let h={plot:t,settings:e,initial:Object.assign(Object.assign({},e),{lines:s}),anim:()=>{t.update()}};this.plots[e._id]=h;let r=0,a=0;Object.keys(e.lines).forEach(l=>{e.lines[l]?.viewing!==!1&&a++}),e.nLines=a;let o,n;typeof e.overlay=="object"&&(o=e.overlay,n=e.overlayCtx,n.clearRect(0,0,e.overlay.width,e.overlay.height),n.font=e.overlayFont?e.overlayFont:"1em Courier",n.fillStyle=e.overlayColor?e.overlayColor:"white");for(let l in e.lines){let i=e.lines[l];if(Array.isArray(i)&&(i={values:i},e.lines[l]=i),"viewing"in i||(i.viewing=!0),i.color)Array.isArray(i.color)&&(i.color=new b(...i.color));else{let m=y.HSLToRGB(360*(r/a)%360,100,50,1);h.initial.lines[l].color=[...m,1],i.color=new b(...m,1)}let u;if(i.nSec&&i.sps?u=Math.ceil(i.nSec*i.sps):i.nPoints?u=i.nPoints:i.points?u=i.points:e.linePoints?u=e.linePoints:i.values?u=i.values.length:u=1e3,i.points=u,e.lines[l].viewing===!1)continue;if((i.width||e.lineWidth)&&i.width!==0){let m=e.lineWidth;m||(m=i.width),i.width?i.line=new d(i.color,u,i.width):e.lineWidth&&(i.line=new d(i.color,u,e.lineWidth)),i.line.lineSpaceX(-1,2/i.line.numPoints)}else i.line=new v(i.color,u),i.line.arrangeX();i.values?.length===i.points?i.values.length!==u&&(i.interpolate?i.values.length>u?i.values=y.downsample(i.values,u):i.values.length<u&&(i.values=y.upsample(i.values,u)):i.values.length>i.points?i.values=i.values.slice(i.values.length-i.points):i.values=[...new Array(i.points-i.values.length).fill(0),...i.values]):Array.isArray(i.values)?i.values.length>u?i.values=i.values.slice(i.values.length-u):i.values.length<u&&(i.values=[...new Array(u-i.values.length).fill(0),...i.values]):i.values=new Array(i.points).fill(0);let c=i.ymin,g=i.ymax;if(c===g?(g=i.values.length<=1e5?Math.max(...i.values):1,c=i.values.length<=1e5?Math.min(...i.values):0):isNaN(g)&&(g=i.values.length<=1e5?Math.max(...i.values):1),isNaN(c)&&(c=i.values.length<=1e5?Math.min(...i.values):0),c>g){let m=c;g=c,c=m}let p=Math.abs(c);if(i.absmax=p>g?p:g,"autoscale"in i||(i.autoscale=!0),i.position||(i.position=e.nLines-r-1),i.autoscale?i.autoscale===2?("clamp"in i||(i.clamp=!0),i.scaled=y.autoscale(i.values,i.position,a,i.centerZero,c,g,i.clamp)):(i.scaled=i.values,i.line.scaleY=y.getYScalar(i.values,a,i.centerZero,c,g),i.line.offsetY=y.getYOffset(i.position,a,c,i.line.scaleY)):i.scaled=i.values,i.scaled.forEach((m,L)=>i.line.setY(L,m)),i.line instanceof d?t.addThickLine(i.line):i.line instanceof v&&t.addDataLine(i.line),"xAxis"in i||(i.xAxis=!0),i.xAxis){i.xColor?Array.isArray(i.xColor)&&(i.xColor=new b(...i.xColor)):i.xColor=new b(1,1,1,.3);let m=new v(i.xColor,2),L=i.autoscale?(r+1)*2/a-1-1/a:0;m.constY(L),m.arrangeX(),m.xy[2]=1,i.x=m,t.addAuxLine(m)}if(a>1&&i.autoscale&&r!==a-1){e.dividerColor?Array.isArray(e.dividerColor)&&(e.dividerColor=new b(...e.dividerColor)):e.dividerColor=new b(1,1,1,1);let m=new v(e.dividerColor,2);m.constY(i.autoscale?(r+1)*2/a-1:1),m.arrangeX(),m.xy[2]=1,i.divider=m,t.addAuxLine(m)}if(typeof e.overlay=="object"&&(i.useOverlay||!("useOverlay"in i))){let m=e.nLines-i.position-1;n.fillText(l,20,o.height*(m+.2)/e.nLines),n.fillText(`${Math.floor(g)===g?g:g?.toFixed(5)} ${i.units?i.units:""}`,o.width-100,o.height*(m+.2)/e.nLines),n.fillText(`${Math.floor(c)===c?c:c?.toFixed(5)} ${i.units?i.units:""}`,o.width-100,o.height*(m+.9)/e.nLines)}r++}return requestAnimationFrame(h.anim),this.plots[e._id]}deinitPlot(e){return typeof e=="string"&&(e=this.plots[e]),e.plot.clear(),e.plot.removeAllLines(),!0}reinitPlot(e,t){if(typeof e=="string"){let s=e;e=this.plots[e],t._id||(t._id=s)}if(!!e.plot)return e.plot.clear(),e.plot.removeAllLines(),e.settings.overlayCtx&&e.settings.overlayCtx.clearRect(0,0,e.settings.overlay?.width,e.settings.overlay?.height),this.initPlot(t,e.plot)}getChartSettings(e,t){let s=this.plots[e];if(s){let h=Object.assign({},s.initial);for(let r in s.initial.lines)typeof s.initial.lines[r]?.ymax!="number"&&(h.lines[r].ymax=s.settings.lines[r]?.ymax),typeof s.initial.lines[r]?.ymin!="number"&&(h.lines[r].ymin=s.settings.lines[r]?.ymin),t&&(h.lines[r].values=s.settings.lines[r].values);return delete h.canvas,delete h.overlay,delete h.overlayCtx,h}}update(e,t,s=!0){if(typeof e=="string"&&(e=this.plots[e]),!e)return!1;if(t){let h=!1,r,a;typeof e.settings.overlay=="object"&&(r=e.settings.overlay,a=e.settings.overlayCtx,a.font=e.settings.overlayFont?e.settings.overlayFont:"1em Courier",a.fillStyle=e.settings.overlayColor?e.settings.overlayColor:"white");for(let o in t)if(e.settings.lines[o]&&e.settings.lines[o].line){if(e.settings.lines[o]?.viewing===!1)continue;let n=e.settings.lines[o];if(Array.isArray(t[o])&&n.values.length<1e5?(n.values.length===0&&(n.values.length=n.points?n.points:1e3),t[o].length===n.values.length?n.values=t[o]:y.circularBuffer(n.values,t[o])):typeof t[o]=="number"?(n.values.push(t[o]),n.values.shift()):t[o]?.values&&(n.values.length===0&&(n.values.length=n.points?n.points:1e3),t[o].values.length===n.values.length?n.values=t[o].values:y.circularBuffer(n.values,t[o].values)),n.values){n.values.length!==n.points&&(n.interpolate?n.values.length>n.points?n.values=y.downsample(n.values,n.points):n.scaled.length<n.points&&(n.values=y.upsample(n.values,n.points)):n.values.length>n.points?n.values.splice(0,n.values.length-n.points):n.values=new Array(n.points).fill(0).splice(n.points-n.values.length,0,n.values));let l=n.ymin,i=n.ymax;if(l===i?(i=n.values.length<=1e5?Math.max(...n.values):1,l=n.values.length<=1e5?Math.min(...n.values):0):isNaN(i)&&(i=n.values.length<=1e5?Math.max(...n.values):1),isNaN(l)&&(l=n.values.length<=1e5?Math.min(...n.values):0),l>i){let c=l;i=l,l=c}let u=Math.abs(l);if(n.absmax=u>i?u:i,n.autoscale?n.autoscale===2?n.scaled=y.autoscale(n.values,n.position,e.settings.nLines,n.centerZero,l,i,n.clamp):(n.scaled=n.values,n.line.scaleY=y.getYScalar(n.values,e.settings.nLines,n.centerZero,l,i),n.line.offsetY=y.getYOffset(n.position,e.settings.nLines,l,n.line.scaleY)):n.scaled=n.values,n.scaled.forEach((c,g)=>{!n.autoscale&&n.absmax>1?n.line.setY(g,c/n.absmax):n.line.setY(g,c)}),typeof e.settings.overlay=="object"&&(n.useOverlay||!("useOverlay"in n))){let c=e.settings.nLines-n.position-1;a.clearRect(0,r.height*c/e.settings.nLines,r.width,r.height/e.settings.nLines),a.fillText(o,20,r.height*(c+.2)/e.settings.nLines),a.fillText(`${Math.floor(i)===i?i:i?.toFixed(5)} ${n.units?n.units:""}`,r.width-100,r.height*(c+.2)/e.settings.nLines),a.fillText(`${Math.floor(l)===l?l:l?.toFixed(5)} ${n.units?n.units:""}`,r.width-100,r.height*(c+.9)/e.settings.nLines)}}}else e.settings.generateNewLines&&!o.includes("timestamp")&&(Array.isArray(t[o])&&(t[o]={values:t[o]}),!t[o].nSec&&!t[o].nPoints&&!e.settings.linePoints&&(t[o].nPoints=1e3),h=!0);if(h)return e.settings.cleanGeneration||Object.keys(e.initial.lines).forEach(o=>{t[o]?t[o]=Object.assign(e.initial.lines[o],t[o]):t[o]=e.initial.lines[o]}),this.reinitPlot(e,{_id:e.settings._id,lines:t}),!0}return s&&requestAnimationFrame(e.anim),!0}updateLine(e,t,s,h,r,a,o){return e.numPoints!==t.length&&(s?e.numPoints>t.length?t=y.downsample(t,e.numPoints):e.numPoints<t.length&&(t=y.upsample(t,e.numPoints)):t.length>e.numPoints?t=t.slice(t.length-e.numPoints):t=[...new Array(t.length).fill(0),...t]),h&&(t=y.autoscale(t,r,a,o)),t.forEach((n,l)=>e.setY(l,n)),!0}static autoscale(e,t=0,s=1,h=!1,r,a,o){if(e?.length===0)return e;let n=typeof a=="number"?a:e.length<=1e5?Math.max(...e):1,l=typeof r=="number"?r:e.length<=1e5?Math.min(...e):0,i=1/s,u=1;if(h){let c=Math.max(Math.abs(l),Math.abs(n));return c!==0&&(u=i/c),e.map(g=>(o&&(g<l&&(g=l),g>n&&(g=n)),g*u+(i*(t+1)*2-1-i)))}else return n===l?n!==0?u=i/n:l!==0&&(u=i/Math.abs(l)):u=i/(n-l),e.map(c=>(o&&(c<l&&(c=l),c>n&&(c=n)),2*((c-l)*u-1/(2*s))+(i*(t+1)*2-1-i)))}static getYScalar(e,t=1,s=!1,h,r){if(e?.length===0)return e;let a=typeof r=="number"?r:e.length<=1e5?Math.max(...e):1,o=typeof h=="number"?h:e.length<=1e5?Math.min(...e):0,n=1/t,l=1;if(s){let i=Math.max(Math.abs(o),Math.abs(a));return i!==0&&(l=n/i),2*l}else return a===o?a!==0?l=n/a:o!==0&&(l=n/Math.abs(o)):l=n/(a-o),2*l}static getYOffset(e=0,t=1,s=0,h=1){let r=1/t,a=r*(e+1)*2-1-r;return s!==0?a-=s*h+1/t:a-=h+1/t,a}static absmax(e){return Math.max(Math.abs(Math.min(...e)),Math.max(...e))}static downsample(e,t,s=1){if(e.length>t){let h=new Array(t),r=e.length/t,a=e.length-1,o=0,n=0;for(let l=r;l<e.length;l+=r){let i=Math.round(l);i>a&&(i=a);for(let u=o;u<i;u++)h[n]+=e[u];h[n]/=(i-o)*s,n++,o=i}return h}else return e}static upsample(e,t,s=1){var h=function(c,g,p){return(c+(g-c)*p)*s},r=new Array(t),a=(e.length-1)/(t-1);r[0]=e[0];for(var o=1;o<t-1;o++){var n=o*a,l=Math.floor(n),i=Math.ceil(n),u=n-l;r[o]=h(e[l],e[i],u)}return r[t-1]=e[e.length-1],r}static interpolate(e,t,s=1){return e.length>t?y.downsample(e,t,s):e.length<t?y.upsample(e,t,s):e}static HSLToRGB(e,t,s,h=255){t/=100,s/=100;let r=(1-Math.abs(2*s-1))*t,a=r*(1-Math.abs(e/60%2-1)),o=s-r/2,n=0,l=0,i=0;return 0<=e&&e<60?(n=r,l=a,i=0):60<=e&&e<120?(n=a,l=r,i=0):120<=e&&e<180?(n=0,l=r,i=a):180<=e&&e<240?(n=0,l=a,i=r):240<=e&&e<300?(n=a,l=0,i=r):300<=e&&e<360&&(n=r,l=0,i=a),n=(n+o)*h,l=(l+o)*h,i=(i+o)*h,[n,l,i]}static circularBuffer(e,t){if(t.length<e.length){let s=e.slice(t.length),h=e.length;e.splice(0,h,...s,...t)}else if(t.length>e.length){let s=e.length;e.splice(0,s,...t.slice(t.length-s))}else e.splice(0,e.length,...t);return e}static formatDataForCharts(e,t){if(Array.isArray(e)){if(Array.isArray(e[0])){let s={};if(e.forEach((h,r)=>{s[r]=h}),e=s,isNaN(e[0][0]))return}else if(t){if(e={[t]:e},isNaN(e[t][0]))return}else if(e={0:e},isNaN(e[0][0]))return}else if(typeof e=="object"){for(let s in e)if(typeof e[s]=="number"?e[s]=[e[s]]:e[s]?.values&&typeof e[s].values=="number"&&(e[s].values=[e[s].values]),isNaN(e[s][0]))return}else if(typeof e=="string"){let s;if(e.includes(`\r
`)){let h=e.split(`\r
`);e={},h.forEach((r,a)=>{r.includes("	")?s=r.split("	"):r.includes(",")?s=r.split(","):r.includes("|")&&(s=r.split("|")),s&&s.forEach((o,n)=>{if(o.includes(":")){let[l,i]=o.split(":"),u=parseFloat(i);isNaN(u)||(e[l]=[u])}else{let l=parseFloat(o);isNaN(l)||(e[n]=[l])}})})}else e.includes("	")?s=e.split("	"):e.includes(",")?s=e.split(","):e.includes("|")&&(s=e.split("|"));e={},s&&s.forEach((h,r)=>{if(h.includes(":")){let[a,o]=h.split(":"),n=parseFloat(o);isNaN(n)||(e[a]=[n])}else{let a=parseFloat(h);isNaN(a)||(e[r]=[a])}})}else typeof e=="number"&&(t?e={[t]:[e]}:e={0:[e]});return e}static padTime(e,t,s,h){let r=(e[0]-t)/s/h;return[...new Array(h-e.length).map((o,n)=>t+r*(n+1)),...e]}static interpolateForTime(e,t,s){return y.interpolate(e,Math.ceil(s*t))}};export{y as WebglLinePlotUtil};
