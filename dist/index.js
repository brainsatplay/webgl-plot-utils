(()=>{var v=class{constructor(e,t,s,h){this.r=e,this.g=t,this.b=s,this.a=h}},A=class{constructor(){this.scaleX=1,this.scaleY=1,this.offsetX=0,this.offsetY=0,this.loop=!1,this._vbuffer=0,this._coord=0,this.visible=!0,this.intensity=1,this.xy=new Float32Array([]),this.numPoints=0,this.color=new v(0,0,0,1),this.webglNumPoints=0}},d=class extends A{constructor(e,t){super(),this.currentIndex=0,this.webglNumPoints=t,this.numPoints=t,this.color=e,this.xy=new Float32Array(2*this.webglNumPoints)}setX(e,t){this.xy[e*2]=t}setY(e,t){this.xy[e*2+1]=t}getX(e){return this.xy[e*2]}getY(e){return this.xy[e*2+1]}lineSpaceX(e,t){for(let s=0;s<this.numPoints;s++)this.setX(s,e+t*s)}arrangeX(){this.lineSpaceX(-1,2/this.numPoints)}constY(e){for(let t=0;t<this.numPoints;t++)this.setY(t,e)}shiftAdd(e){let t=e.length;for(let s=0;s<this.numPoints-t;s++)this.setY(s,this.getY(s+t));for(let s=0;s<t;s++)this.setY(s+this.numPoints-t,e[s])}addArrayY(e){if(this.currentIndex+e.length<=this.numPoints)for(let t=0;t<e.length;t++)this.setY(this.currentIndex,e[t]),this.currentIndex++}replaceArrayY(e){if(e.length==this.numPoints)for(let t=0;t<this.numPoints;t++)this.setY(t,e[t])}};var M=(c,e,t)=>{let s={x:0,y:0};return s.x=c.x+e.x*t,s.y=c.y+e.y*t,s},P=c=>Y(-c.y,c.x),x=(c,e)=>{let t=T(c,e);return t=S(t),t},C=(c,e)=>{let t={x:0,y:0};return t.x=c.x+e.x,t.y=c.y+e.y,t},R=(c,e)=>c.x*e.x+c.y*e.y,S=c=>{let e={x:0,y:0},t=c.x*c.x+c.y*c.y;return t>0&&(t=1/Math.sqrt(t),e.x=c.x*t,e.y=c.y*t),e},Y=(c,e)=>{let t={x:0,y:0};return t.x=c,t.y=e,t},T=(c,e)=>{let t={x:0,y:0};return t.x=c.x-e.x,t.y=c.y-e.y,t},F=c=>{let e,t={x:0,y:0},s={x:0,y:0},h=[],o=(n,l)=>{h.push({vec2:n,miterLength:l})},a=n=>({x:c[n*2],y:c[n*2+1]});t=x(a(1),a(0)),e=P(t),o(e,1);let r=c.length/2;for(let n=1;n<r-1;n++){let l=a(n-1),i=a(n),u=a(n+1);t=x(i,l),e=P(t),s=x(u,i);let g=N(t,s),f=X(t,g,1);o(g,f)}return t=x(a(r-1),a(r-2)),e=P(t),o(e,1),h},N=(c,e)=>{let t=C(c,e);return t=S(t),Y(-t.y,t.x)},X=(c,e,t)=>{let s=Y(-c.y,c.x);return t/R(e,s)},p=class extends A{constructor(e,t,s){super(),this.currentIndex=0,this._thicknessRequested=0,this._actualThickness=0,this.webglNumPoints=t*2,this.numPoints=t,this.color=e,this._thicknessRequested=s,this._linePoints=new Float32Array(t*2),this.xy=new Float32Array(2*this.webglNumPoints)}convertToTriPoints(){let e=this._actualThickness/2,t=F(this._linePoints);for(let s=0;s<this.numPoints;s++){let h=this._linePoints[2*s],o=this._linePoints[2*s+1],a={x:h,y:o},r=M(a,t[s].vec2,t[s].miterLength*e),n=M(a,t[s].vec2,-t[s].miterLength*e);this.xy[s*4]=r.x,this.xy[s*4+1]=r.y,this.xy[s*4+2]=n.x,this.xy[s*4+3]=n.y}}setX(e,t){this._linePoints[e*2]=t}setY(e,t){this._linePoints[e*2+1]=t}lineSpaceX(e,t){for(let s=0;s<this.numPoints;s++)this.setX(s,e+t*s)}setThickness(e){this._thicknessRequested=e}getThickness(){return this._thicknessRequested}setActualThickness(e){this._actualThickness=e}},L=class{constructor(e,t){this.debug=!1,this.addLine=this.addDataLine,t==null?this.webgl=e.getContext("webgl",{antialias:!0,transparent:!1}):(this.webgl=e.getContext("webgl",{antialias:t.antialias,transparent:t.transparent,desynchronized:t.deSync,powerPerformance:t.powerPerformance,preserveDrawing:t.preserveDrawing}),this.debug=t.debug==null?!1:t.debug),this.log("canvas type is: "+e.constructor.name),this.log(`[webgl-plot]:width=${e.width}, height=${e.height}`),this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[],this.gScaleX=1,this.gScaleY=1,this.gXYratio=1,this.gOffsetX=0,this.gOffsetY=0,this.gLog10X=!1,this.gLog10Y=!1,this.webgl.clear(this.webgl.COLOR_BUFFER_BIT),this.webgl.viewport(0,0,e.width,e.height),this._progLine=this.webgl.createProgram(),this.initThinLineProgram(),this.webgl.enable(this.webgl.BLEND),this.webgl.blendFunc(this.webgl.SRC_ALPHA,this.webgl.ONE_MINUS_SRC_ALPHA)}get linesData(){return this._linesData}get linesAux(){return this._linesAux}get thickLines(){return this._thickLines}get surfaces(){return this._surfaces}_drawLines(e){let t=this.webgl;e.forEach(s=>{if(s.visible){t.useProgram(this._progLine);let h=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(h,!1,new Float32Array([s.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,s.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let o=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(o,new Float32Array([s.offsetX+this.gOffsetX,s.offsetY+this.gOffsetY]));let a=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(a,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let r=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(r,[s.color.r,s.color.g,s.color.b,s.color.a]),t.bufferData(t.ARRAY_BUFFER,s.xy,t.STREAM_DRAW),t.drawArrays(s.loop?t.LINE_LOOP:t.LINE_STRIP,0,s.webglNumPoints)}})}_drawSurfaces(e){let t=this.webgl;e.forEach(s=>{if(s.visible){t.useProgram(this._progLine);let h=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(h,!1,new Float32Array([s.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,s.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let o=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(o,new Float32Array([s.offsetX+this.gOffsetX,s.offsetY+this.gOffsetY]));let a=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(a,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let r=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(r,[s.color.r,s.color.g,s.color.b,s.color.a]),t.bufferData(t.ARRAY_BUFFER,s.xy,t.STREAM_DRAW),t.drawArrays(t.TRIANGLE_STRIP,0,s.webglNumPoints)}})}_drawTriangles(e){let t=this.webgl;t.bufferData(t.ARRAY_BUFFER,e.xy,t.STREAM_DRAW),t.useProgram(this._progLine);let s=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(s,!1,new Float32Array([e.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,e.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let h=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(h,new Float32Array([e.offsetX+this.gOffsetX,e.offsetY+this.gOffsetY]));let o=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(o,new Int32Array([0,0]));let a=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(a,[e.color.r,e.color.g,e.color.b,e.color.a]),t.drawArrays(t.TRIANGLE_STRIP,0,e.xy.length/2)}_drawThickLines(){this._thickLines.forEach(e=>{if(e.visible){let t=Math.min(this.gScaleX,this.gScaleY);e.setActualThickness(e.getThickness()/t),e.convertToTriPoints(),this._drawTriangles(e)}})}update(){this.clear(),this.draw()}draw(){this._drawLines(this.linesData),this._drawLines(this.linesAux),this._drawThickLines(),this._drawSurfaces(this.surfaces)}clear(){this.webgl.clear(this.webgl.COLOR_BUFFER_BIT)}_addLine(e){e._vbuffer=this.webgl.createBuffer(),this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER,e._vbuffer),this.webgl.bufferData(this.webgl.ARRAY_BUFFER,e.xy,this.webgl.STREAM_DRAW),e._coord=this.webgl.getAttribLocation(this._progLine,"coordinates"),this.webgl.vertexAttribPointer(e._coord,2,this.webgl.FLOAT,!1,0,0),this.webgl.enableVertexAttribArray(e._coord)}addDataLine(e){this._addLine(e),this.linesData.push(e)}addAuxLine(e){this._addLine(e),this.linesAux.push(e)}addThickLine(e){this._addLine(e),this._thickLines.push(e)}addSurface(e){this._addLine(e),this.surfaces.push(e)}initThinLineProgram(){let e=`
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
         }`,h=this.webgl.createShader(this.webgl.FRAGMENT_SHADER);this.webgl.shaderSource(h,s),this.webgl.compileShader(h),this._progLine=this.webgl.createProgram(),this.webgl.attachShader(this._progLine,t),this.webgl.attachShader(this._progLine,h),this.webgl.linkProgram(this._progLine)}popDataLine(){this.linesData.pop()}removeAllLines(){this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[]}removeDataLines(){this._linesData=[]}removeAuxLines(){this._linesAux=[]}viewport(e,t,s,h){this.webgl.viewport(e,t,s,h)}log(e){this.debug&&console.log("[webgl-plot]:"+e)}};var y=class{constructor(){this.plots={}}initPlot(e,t){if(t||(t=new L(e.canvas,e.webglOptions)),!e._id)e._id=`plot${Math.floor(Math.random()*1e15)}`;else if(this.plots[e._id]){let l=this.plots[e._id].initial;if(e.lines){for(let i in e.lines)if(l.lines[i]&&Array.isArray(e.lines[i])){let u=e.lines[i];e.lines[i]=l.lines[i]}}e=Object.assign(l,e)}e.overlay&&(typeof e.overlay!="object"&&(e.overlay=document.createElement("canvas"),e.overlay.style.position="absolute",e.overlay.width=e.canvas.width,e.overlay.height=e.canvas.height,e.canvas.appendChild(e.overlay)),e.overlayCtx||(e.overlayCtx=e.overlay.getContext("2d"))),e.width&&(e.canvas.width=e.width,e.canvas.style&&(e.canvas.style.width=e.width+"px"),typeof e.overlay=="object"&&(e.overlay.width=e.width,e.overlay.style&&(e.overlay.style.width=e.width+"px"))),e.height&&(e.canvas.height=e.height,e.canvas.style&&(e.canvas.style.height=e.height+"px"),typeof e.overlay=="object"&&(e.overlay.height=e.height,e.overlay.style&&(e.overlay.style.height=e.height+"px"))),e.lines?.timestamp&&delete e.lines.timestamp,e.lines||(e.lines={});let s={};for(let l in e.lines)s[l]=Object.assign({},s[l]),"viewing"in e.lines[l]||(e.lines[l].viewing=!0),s[l].viewing=e.lines[l].viewing,s[l].sps=e.lines[l].sps,s[l].nSec=e.lines[l].nSec,s[l].nPoints=e.lines[l].nPoints,s[l].ymin=e.lines[l].ymin,s[l].ymax=e.lines[l].ymax,s[l].units=e.lines[l].units;let h={plot:t,settings:e,initial:Object.assign(Object.assign({},e),{lines:s}),anim:()=>{t.update()}};this.plots[e._id]=h;let o=0,a=0;Object.keys(e.lines).forEach(l=>{e.lines[l]?.viewing!==!1&&a++}),e.nLines=a;let r,n;typeof e.overlay=="object"&&(r=e.overlay,n=e.overlayCtx,n.clearRect(0,0,e.overlay.width,e.overlay.height),n.font=e.overlayFont?e.overlayFont:"1em Courier",n.fillStyle=e.overlayColor?e.overlayColor:"white");for(let l in e.lines){let i=e.lines[l];if(Array.isArray(i)&&(i={values:i},e.lines[l]=i),"viewing"in i||(i.viewing=!0),i.color)Array.isArray(i.color)&&(i.color=new v(...i.color));else{let m=y.HSLToRGB(360*(o/a)%360,100,50,1);h.initial.lines[l].color=[...m,1],i.color=new v(...m,1)}let u;if(i.nSec&&i.sps?u=Math.ceil(i.nSec*i.sps):i.nPoints?u=i.nPoints:i.points?u=i.points:e.linePoints?u=e.linePoints:i.values?u=i.values.length:u=1e3,i.points=u,e.lines[l].viewing===!1)continue;if((i.width||e.lineWidth)&&i.width!==0){let m=e.lineWidth;m||(m=i.width),i.width?i.line=new p(i.color,u,i.width):e.lineWidth&&(i.line=new p(i.color,u,e.lineWidth)),i.line.lineSpaceX(-1,2/i.line.numPoints)}else i.line=new d(i.color,u),i.line.arrangeX();i.values?.length===i.points?i.values.length!==u&&(i.interpolate?i.values.length>u?i.values=y.downsample(i.values,u):i.values.length<u&&(i.values=y.upsample(i.values,u)):i.values.length>i.points?i.values=i.values.slice(i.values.length-i.points):i.values=[...new Array(i.points-i.values.length).fill(0),...i.values]):Array.isArray(i.values)?i.values.length>u?i.values=i.values.slice(i.values.length-u):i.values.length<u&&(i.values=[...new Array(u-i.values.length).fill(0),...i.values]):i.values=new Array(i.points).fill(0);let g=i.ymin,f=i.ymax,b=i.values.length<=1e5;if(g===f?(f=b?Math.max(...i.values):1,g=b?Math.min(...i.values):0):isNaN(f)&&(f=b?Math.max(...i.values):1),isNaN(g)&&(g=b?Math.min(...i.values):0),g>f){let m=g;f=g,g=m}let w=Math.abs(g);if(i.absmax=w>f?w:f,"autoscale"in i||(i.autoscale=!0),i.position||(i.position=e.nLines-o-1),i.autoscale?i.autoscale===2?("clamp"in i||(i.clamp=!0),i.scaled=y.autoscale(i.values,i.position,a,i.centerZero,g,f,i.clamp)):(i.scaled=i.values,i.line.scaleY=y.getYScalar(i.values,a,i.centerZero,g,f),i.line.offsetY=y.getYOffset(i.position,a,g,i.line.scaleY)):i.scaled=i.values,i.scaled.forEach((m,_)=>i.line.setY(_,m)),i.line instanceof p?t.addThickLine(i.line):i.line instanceof d&&t.addDataLine(i.line),"xAxis"in i||(i.xAxis=!0),i.xAxis){i.xColor?Array.isArray(i.xColor)&&(i.xColor=new v(...i.xColor)):i.xColor=new v(1,1,1,.3);let m=new d(i.xColor,2),_=i.autoscale?(o+1)*2/a-1-1/a:0;m.constY(_),m.arrangeX(),m.xy[2]=1,i.x=m,t.addAuxLine(m)}if(a>1&&i.autoscale&&o!==a-1){e.dividerColor?Array.isArray(e.dividerColor)&&(e.dividerColor=new v(...e.dividerColor)):e.dividerColor=new v(1,1,1,1);let m=new d(e.dividerColor,2);m.constY(i.autoscale?(o+1)*2/a-1:1),m.arrangeX(),m.xy[2]=1,i.divider=m,t.addAuxLine(m)}if(typeof e.overlay=="object"&&(i.useOverlay||!("useOverlay"in i))){let m=e.nLines-i.position-1;n.fillText(l,20,r.height*(m+.2)/e.nLines),n.fillText(`${Math.floor(f)===f?f:f?.toFixed(5)} ${i.units?i.units:""}`,r.width-100,r.height*(m+.2)/e.nLines),n.fillText(`${Math.floor(g)===g?g:g?.toFixed(5)} ${i.units?i.units:""}`,r.width-100,r.height*(m+.9)/e.nLines)}o++}return requestAnimationFrame(h.anim),this.plots[e._id]}deinitPlot(e){return typeof e=="string"&&(e=this.plots[e]),e.plot.clear(),e.plot.removeAllLines(),!0}reinitPlot(e,t){if(typeof e=="string"){let s=e;e=this.plots[e],t._id||(t._id=s)}if(e.plot)return e.plot.clear(),e.plot.removeAllLines(),e.settings.overlayCtx&&e.settings.overlayCtx.clearRect(0,0,e.settings.overlay?.width,e.settings.overlay?.height),this.initPlot(t,e.plot)}getChartSettings(e,t){let s=this.plots[e];if(s){let h=Object.assign({},s.initial);for(let o in s.initial.lines)typeof s.initial.lines[o]?.ymax!="number"&&(h.lines[o].ymax=s.settings.lines[o]?.ymax),typeof s.initial.lines[o]?.ymin!="number"&&(h.lines[o].ymin=s.settings.lines[o]?.ymin),t&&(h.lines[o].values=s.settings.lines[o].values);return delete h.canvas,delete h.overlay,delete h.overlayCtx,h}}update(e,t,s=!0){if(typeof e=="string"&&(e=this.plots[e]),!e)return!1;if(t){let h=!1,o,a;typeof e.settings.overlay=="object"&&(o=e.settings.overlay,a=e.settings.overlayCtx,a.font=e.settings.overlayFont?e.settings.overlayFont:"1em Courier",a.fillStyle=e.settings.overlayColor?e.settings.overlayColor:"white");for(let r in t)if(e.settings.lines[r]&&e.settings.lines[r].line){if(e.settings.lines[r]?.viewing===!1)continue;let n=e.settings.lines[r];if(n.values){if(e.settings.mode&&e.settings.mode==="sweep"){"ct"in n||(n.ct=0);let f=b=>{n.ct>n.values.length&&(n.ct=0),n.values[n.ct]=b,n.ct++};Array.isArray(t[r])?t[r].forEach(f):typeof t[r]=="number"?f(t[r]):t[r].values&&t[r].values.forEach(f)}else Array.isArray(t[r])&&n.values?.length<1e5?(n.values.length===0&&(n.values.length=n.points?n.points:1e3),t[r].length===n.values.length?n.values=t[r]:y.circularBuffer(n.values,t[r])):typeof t[r]=="number"?(n.values.push(t[r]),n.values.shift()):t[r]?.values&&(n.values.length===0&&(n.values.length=n.points?n.points:1e3),t[r].values.length===n.values.length?n.values=t[r].values:y.circularBuffer(n.values,t[r].values));n.values.length!==n.points&&(n.interpolate?n.values.length>n.points?n.values=y.downsample(n.values,n.points):n.scaled.length<n.points&&(n.values=y.upsample(n.values,n.points)):n.values.length>n.points?n.values.splice(0,n.values.length-n.points):n.values=new Array(n.points).fill(0).splice(n.points-n.values.length,0,n.values));let l=n.ymin,i=n.ymax,u=n.values.length<=1e5;if(l===i?(i=u?Math.max(...n.values):1,l=u?Math.min(...n.values):0):isNaN(i)&&(i=u?Math.max(...n.values):1),isNaN(l)&&(l=u?Math.min(...n.values):0),l>i){let f=l;i=l,l=f}let g=Math.abs(l);if(n.absmax=g>i?g:i,n.autoscale?n.autoscale===2?n.scaled=y.autoscale(n.values,n.position,e.settings.nLines,n.centerZero,l,i,n.clamp):(n.scaled=n.values,n.line.scaleY=y.getYScalar(n.values,e.settings.nLines,n.centerZero,l,i),n.line.offsetY=y.getYOffset(n.position,e.settings.nLines,l,n.line.scaleY)):n.scaled=n.values,n.scaled.forEach((f,b)=>{!n.autoscale&&n.absmax>1?n.line.setY(b,f/n.absmax):n.line.setY(b,f)}),typeof e.settings.overlay=="object"&&(n.useOverlay||!("useOverlay"in n))){let f=e.settings.nLines-n.position-1,b=o.height*f/e.settings.nLines,w=o.height/e.settings.nLines;if(a.clearRect(0,b,o.width,w),e.settings.mode&&e.settings.mode==="sweep"){a.fillStyle=e.settings.sweepColor?e.settings.sweepColor:"rgba(0,255,0,0.25)",a.beginPath();let m=o.width*n.ct/n.values.length;a.moveTo(m,b),a.lineTo(m,w),a.stroke()}a.fillText(r,20,o.height*(f+.2)/e.settings.nLines),a.fillText(`${Math.floor(i)===i?i:i?.toFixed(5)} ${n.units?n.units:""}`,o.width-100,o.height*(f+.2)/e.settings.nLines),a.fillText(`${Math.floor(l)===l?l:l?.toFixed(5)} ${n.units?n.units:""}`,o.width-100,o.height*(f+.9)/e.settings.nLines)}}}else e.settings.generateNewLines&&!r.includes("timestamp")&&(Array.isArray(t[r])&&(t[r]={values:t[r]}),!t[r].nSec&&!t[r].nPoints&&!e.settings.linePoints&&(t[r].nPoints=1e3),h=!0);if(h)return e.settings.cleanGeneration||Object.keys(e.initial.lines).forEach(r=>{t[r]?t[r]=Object.assign(e.initial.lines[r],t[r]):t[r]=e.initial.lines[r]}),this.reinitPlot(e,{_id:e.settings._id,lines:t}),!0}return s&&requestAnimationFrame(e.anim),!0}updateLine(e,t,s,h,o,a,r){return e.numPoints!==t.length&&(s?e.numPoints>t.length?t=y.downsample(t,e.numPoints):e.numPoints<t.length&&(t=y.upsample(t,e.numPoints)):t.length>e.numPoints?t=t.slice(t.length-e.numPoints):t=[...new Array(t.length).fill(0),...t]),h&&(t=y.autoscale(t,o,a,r)),t.forEach((n,l)=>e.setY(l,n)),!0}static autoscale(e,t=0,s=1,h=!1,o,a,r){if(e?.length===0)return e;let n=typeof a=="number"?a:e.length<=1e5?Math.max(...e):1,l=typeof o=="number"?o:e.length<=1e5?Math.min(...e):0,i=1/s,u=1;if(h){let g=Math.max(Math.abs(l),Math.abs(n));return g!==0&&(u=i/g),e.map(f=>(r&&(f<l&&(f=l),f>n&&(f=n)),f*u+(i*(t+1)*2-1-i)))}else return n===l?n!==0?u=i/n:l!==0&&(u=i/Math.abs(l)):u=i/(n-l),e.map(g=>(r&&(g<l&&(g=l),g>n&&(g=n)),2*((g-l)*u-1/(2*s))+(i*(t+1)*2-1-i)))}static getYScalar(e,t=1,s=!1,h,o){if(e?.length===0)return e;let a=typeof o=="number"?o:e.length<=1e5?Math.max(...e):1,r=typeof h=="number"?h:e.length<=1e5?Math.min(...e):0,n=1/t,l=1;if(s){let i=Math.max(Math.abs(r),Math.abs(a));return i!==0&&(l=n/i),2*l}else return a===r?a!==0?l=n/a:r!==0&&(l=n/Math.abs(r)):l=n/(a-r),2*l}static getYOffset(e=0,t=1,s=0,h=1){let o=1/t,a=o*(e+1)*2-1-o;return s!==0?a-=s*h+1/t:a-=h+1/t,a}static absmax(e){return Math.max(Math.abs(Math.min(...e)),Math.max(...e))}static downsample(e,t,s=1){if(e.length>t){let h=new Array(t),o=e.length/t,a=e.length-1,r=0,n=0;for(let l=o;l<e.length;l+=o){let i=Math.round(l);i>a&&(i=a);for(let u=r;u<i;u++)h[n]+=e[u];h[n]/=(i-r)*s,n++,r=i}return h}else return e}static upsample(e,t,s=1){var h=function(g,f,b){return(g+(f-g)*b)*s},o=new Array(t),a=(e.length-1)/(t-1);o[0]=e[0];for(var r=1;r<t-1;r++){var n=r*a,l=Math.floor(n),i=Math.ceil(n),u=n-l;o[r]=h(e[l],e[i],u)}return o[t-1]=e[e.length-1],o}static interpolate(e,t,s=1){return e.length>t?y.downsample(e,t,s):e.length<t?y.upsample(e,t,s):e}static HSLToRGB(e,t,s,h=255){t/=100,s/=100;let o=(1-Math.abs(2*s-1))*t,a=o*(1-Math.abs(e/60%2-1)),r=s-o/2,n=0,l=0,i=0;return 0<=e&&e<60?(n=o,l=a,i=0):60<=e&&e<120?(n=a,l=o,i=0):120<=e&&e<180?(n=0,l=o,i=a):180<=e&&e<240?(n=0,l=a,i=o):240<=e&&e<300?(n=a,l=0,i=o):300<=e&&e<360&&(n=o,l=0,i=a),n=(n+r)*h,l=(l+r)*h,i=(i+r)*h,[n,l,i]}static circularBuffer(e,t){if(t.length<e.length){let s=e.slice(t.length),h=e.length;e.splice(0,h,...s,...t)}else if(t.length>e.length){let s=e.length;e.splice(0,s,...t.slice(t.length-s))}else e.splice(0,e.length,...t);return e}static formatDataForCharts(e,t){if(Array.isArray(e)){if(Array.isArray(e[0])){let s={};if(e.forEach((h,o)=>{s[o]=h}),e=s,isNaN(e[0][0]))return}else if(t){if(e={[t]:e},isNaN(e[t][0]))return}else if(e={0:e},isNaN(e[0][0]))return}else if(typeof e=="object"){for(let s in e)if(typeof e[s]=="number"?e[s]=[e[s]]:e[s]?.values&&typeof e[s].values=="number"&&(e[s].values=[e[s].values]),isNaN(e[s][0]))return}else if(typeof e=="string"){let s;if(e.includes(`\r
`)){let h=e.split(`\r
`);e={},h.forEach((o,a)=>{o.includes("	")?s=o.split("	"):o.includes(",")?s=o.split(","):o.includes("|")&&(s=o.split("|")),s&&s.forEach((r,n)=>{if(r.includes(":")){let[l,i]=r.split(":"),u=parseFloat(i);isNaN(u)||(e[l]=[u])}else{let l=parseFloat(r);isNaN(l)||(e[n]=[l])}})})}else e.includes("	")?s=e.split("	"):e.includes(",")?s=e.split(","):e.includes("|")&&(s=e.split("|"));e={},s&&s.forEach((h,o)=>{if(h.includes(":")){let[a,r]=h.split(":"),n=parseFloat(r);isNaN(n)||(e[a]=[n])}else{let a=parseFloat(h);isNaN(a)||(e[o]=[a])}})}else typeof e=="number"&&(t?e={[t]:[e]}:e={0:[e]});return e}static padTime(e,t,s,h){let o=(e[0]-t)/s/h;return[...new Array(h-e.length).map((r,n)=>t+o*(n+1)),...e]}static interpolateForTime(e,t,s){return y.interpolate(e,Math.ceil(s*t))}};})();
