(()=>{var v=class{constructor(e,t,n,h){this.r=e,this.g=t,this.b=n,this.a=h}},A=class{constructor(){this.scaleX=1,this.scaleY=1,this.offsetX=0,this.offsetY=0,this.loop=!1,this._vbuffer=0,this._coord=0,this.visible=!0,this.intensity=1,this.xy=new Float32Array([]),this.numPoints=0,this.color=new v(0,0,0,1),this.webglNumPoints=0}},d=class extends A{constructor(e,t){super(),this.currentIndex=0,this.webglNumPoints=t,this.numPoints=t,this.color=e,this.xy=new Float32Array(2*this.webglNumPoints)}setX(e,t){this.xy[e*2]=t}setY(e,t){this.xy[e*2+1]=t}getX(e){return this.xy[e*2]}getY(e){return this.xy[e*2+1]}lineSpaceX(e,t){for(let n=0;n<this.numPoints;n++)this.setX(n,e+t*n)}arrangeX(){this.lineSpaceX(-1,2/this.numPoints)}constY(e){for(let t=0;t<this.numPoints;t++)this.setY(t,e)}shiftAdd(e){let t=e.length;for(let n=0;n<this.numPoints-t;n++)this.setY(n,this.getY(n+t));for(let n=0;n<t;n++)this.setY(n+this.numPoints-t,e[n])}addArrayY(e){if(this.currentIndex+e.length<=this.numPoints)for(let t=0;t<e.length;t++)this.setY(this.currentIndex,e[t]),this.currentIndex++}replaceArrayY(e){if(e.length==this.numPoints)for(let t=0;t<this.numPoints;t++)this.setY(t,e[t])}};var M=(c,e,t)=>{let n={x:0,y:0};return n.x=c.x+e.x*t,n.y=c.y+e.y*t,n},P=c=>Y(-c.y,c.x),x=(c,e)=>{let t=T(c,e);return t=S(t),t},C=(c,e)=>{let t={x:0,y:0};return t.x=c.x+e.x,t.y=c.y+e.y,t},R=(c,e)=>c.x*e.x+c.y*e.y,S=c=>{let e={x:0,y:0},t=c.x*c.x+c.y*c.y;return t>0&&(t=1/Math.sqrt(t),e.x=c.x*t,e.y=c.y*t),e},Y=(c,e)=>{let t={x:0,y:0};return t.x=c,t.y=e,t},T=(c,e)=>{let t={x:0,y:0};return t.x=c.x-e.x,t.y=c.y-e.y,t},F=c=>{let e,t={x:0,y:0},n={x:0,y:0},h=[],o=(s,r)=>{h.push({vec2:s,miterLength:r})},a=s=>({x:c[s*2],y:c[s*2+1]});t=x(a(1),a(0)),e=P(t),o(e,1);let l=c.length/2;for(let s=1;s<l-1;s++){let r=a(s-1),i=a(s),u=a(s+1);t=x(i,r),e=P(t),n=x(u,i);let g=N(t,n),f=X(t,g,1);o(g,f)}return t=x(a(l-1),a(l-2)),e=P(t),o(e,1),h},N=(c,e)=>{let t=C(c,e);return t=S(t),Y(-t.y,t.x)},X=(c,e,t)=>{let n=Y(-c.y,c.x);return t/R(e,n)},p=class extends A{constructor(e,t,n){super(),this.currentIndex=0,this._thicknessRequested=0,this._actualThickness=0,this.webglNumPoints=t*2,this.numPoints=t,this.color=e,this._thicknessRequested=n,this._linePoints=new Float32Array(t*2),this.xy=new Float32Array(2*this.webglNumPoints)}convertToTriPoints(){let e=this._actualThickness/2,t=F(this._linePoints);for(let n=0;n<this.numPoints;n++){let h=this._linePoints[2*n],o=this._linePoints[2*n+1],a={x:h,y:o},l=M(a,t[n].vec2,t[n].miterLength*e),s=M(a,t[n].vec2,-t[n].miterLength*e);this.xy[n*4]=l.x,this.xy[n*4+1]=l.y,this.xy[n*4+2]=s.x,this.xy[n*4+3]=s.y}}setX(e,t){this._linePoints[e*2]=t}setY(e,t){this._linePoints[e*2+1]=t}lineSpaceX(e,t){for(let n=0;n<this.numPoints;n++)this.setX(n,e+t*n)}setThickness(e){this._thicknessRequested=e}getThickness(){return this._thicknessRequested}setActualThickness(e){this._actualThickness=e}},L=class{constructor(e,t){this.debug=!1,this.addLine=this.addDataLine,t==null?this.webgl=e.getContext("webgl",{antialias:!0,transparent:!1}):(this.webgl=e.getContext("webgl",{antialias:t.antialias,transparent:t.transparent,desynchronized:t.deSync,powerPerformance:t.powerPerformance,preserveDrawing:t.preserveDrawing}),this.debug=t.debug==null?!1:t.debug),this.log("canvas type is: "+e.constructor.name),this.log(`[webgl-plot]:width=${e.width}, height=${e.height}`),this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[],this.gScaleX=1,this.gScaleY=1,this.gXYratio=1,this.gOffsetX=0,this.gOffsetY=0,this.gLog10X=!1,this.gLog10Y=!1,this.webgl.clear(this.webgl.COLOR_BUFFER_BIT),this.webgl.viewport(0,0,e.width,e.height),this._progLine=this.webgl.createProgram(),this.initThinLineProgram(),this.webgl.enable(this.webgl.BLEND),this.webgl.blendFunc(this.webgl.SRC_ALPHA,this.webgl.ONE_MINUS_SRC_ALPHA)}get linesData(){return this._linesData}get linesAux(){return this._linesAux}get thickLines(){return this._thickLines}get surfaces(){return this._surfaces}_drawLines(e){let t=this.webgl;e.forEach(n=>{if(n.visible){t.useProgram(this._progLine);let h=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(h,!1,new Float32Array([n.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,n.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let o=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(o,new Float32Array([n.offsetX+this.gOffsetX,n.offsetY+this.gOffsetY]));let a=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(a,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let l=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(l,[n.color.r,n.color.g,n.color.b,n.color.a]),t.bufferData(t.ARRAY_BUFFER,n.xy,t.STREAM_DRAW),t.drawArrays(n.loop?t.LINE_LOOP:t.LINE_STRIP,0,n.webglNumPoints)}})}_drawSurfaces(e){let t=this.webgl;e.forEach(n=>{if(n.visible){t.useProgram(this._progLine);let h=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(h,!1,new Float32Array([n.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,n.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let o=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(o,new Float32Array([n.offsetX+this.gOffsetX,n.offsetY+this.gOffsetY]));let a=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(a,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let l=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(l,[n.color.r,n.color.g,n.color.b,n.color.a]),t.bufferData(t.ARRAY_BUFFER,n.xy,t.STREAM_DRAW),t.drawArrays(t.TRIANGLE_STRIP,0,n.webglNumPoints)}})}_drawTriangles(e){let t=this.webgl;t.bufferData(t.ARRAY_BUFFER,e.xy,t.STREAM_DRAW),t.useProgram(this._progLine);let n=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(n,!1,new Float32Array([e.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,e.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let h=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(h,new Float32Array([e.offsetX+this.gOffsetX,e.offsetY+this.gOffsetY]));let o=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(o,new Int32Array([0,0]));let a=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(a,[e.color.r,e.color.g,e.color.b,e.color.a]),t.drawArrays(t.TRIANGLE_STRIP,0,e.xy.length/2)}_drawThickLines(){this._thickLines.forEach(e=>{if(e.visible){let t=Math.min(this.gScaleX,this.gScaleY);e.setActualThickness(e.getThickness()/t),e.convertToTriPoints(),this._drawTriangles(e)}})}update(){this.clear(),this.draw()}draw(){this._drawLines(this.linesData),this._drawLines(this.linesAux),this._drawThickLines(),this._drawSurfaces(this.surfaces)}clear(){this.webgl.clear(this.webgl.COLOR_BUFFER_BIT)}_addLine(e){e._vbuffer=this.webgl.createBuffer(),this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER,e._vbuffer),this.webgl.bufferData(this.webgl.ARRAY_BUFFER,e.xy,this.webgl.STREAM_DRAW),e._coord=this.webgl.getAttribLocation(this._progLine,"coordinates"),this.webgl.vertexAttribPointer(e._coord,2,this.webgl.FLOAT,!1,0,0),this.webgl.enableVertexAttribArray(e._coord)}addDataLine(e){this._addLine(e),this.linesData.push(e)}addAuxLine(e){this._addLine(e),this.linesAux.push(e)}addThickLine(e){this._addLine(e),this._thickLines.push(e)}addSurface(e){this._addLine(e),this.surfaces.push(e)}initThinLineProgram(){let e=`
      attribute vec2 coordinates;
      uniform mat2 uscale;
      uniform vec2 uoffset;
      uniform ivec2 is_log;

      void main(void) {
         float x = (is_log[0]==1) ? log(coordinates.x) : coordinates.x;
         float y = (is_log[1]==1) ? log(coordinates.y) : coordinates.y;
         vec2 line = vec2(x, y);
         gl_Position = vec4(uscale*line + uoffset, 0.0, 1.0);
      }`,t=this.webgl.createShader(this.webgl.VERTEX_SHADER);this.webgl.shaderSource(t,e),this.webgl.compileShader(t);let n=`
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`,h=this.webgl.createShader(this.webgl.FRAGMENT_SHADER);this.webgl.shaderSource(h,n),this.webgl.compileShader(h),this._progLine=this.webgl.createProgram(),this.webgl.attachShader(this._progLine,t),this.webgl.attachShader(this._progLine,h),this.webgl.linkProgram(this._progLine)}popDataLine(){this.linesData.pop()}removeAllLines(){this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[]}removeDataLines(){this._linesData=[]}removeAuxLines(){this._linesAux=[]}viewport(e,t,n,h){this.webgl.viewport(e,t,n,h)}log(e){this.debug&&console.log("[webgl-plot]:"+e)}};var y=class{constructor(){this.plots={}}initPlot(e,t){if(t||(t=new L(e.canvas,e.webglOptions)),!e._id)e._id=`plot${Math.floor(Math.random()*1e15)}`;else if(this.plots[e._id]){let r=this.plots[e._id].initial;if(e.lines){for(let i in e.lines)if(r.lines[i]&&Array.isArray(e.lines[i])){let u=e.lines[i];e.lines[i]=r.lines[i]}}e=Object.assign(r,e)}e.overlay&&(typeof e.overlay!="object"&&(e.overlay=document.createElement("canvas"),e.overlay.style.position="absolute",e.overlay.width=e.canvas.width,e.overlay.height=e.canvas.height,e.canvas.appendChild(e.overlay)),e.overlayCtx||(e.overlayCtx=e.overlay.getContext("2d"))),e.width&&(e.canvas.width=e.width,e.canvas.style&&(e.canvas.style.width=e.width+"px"),typeof e.overlay=="object"&&(e.overlay.width=e.width,e.overlay.style&&(e.overlay.style.width=e.width+"px"))),e.height&&(e.canvas.height=e.height,e.canvas.style&&(e.canvas.style.height=e.height+"px"),typeof e.overlay=="object"&&(e.overlay.height=e.height,e.overlay.style&&(e.overlay.style.height=e.height+"px"))),e.lines?.timestamp&&delete e.lines.timestamp,e.lines||(e.lines={});let n={};for(let r in e.lines)n[r]=Object.assign({},n[r]),"viewing"in e.lines[r]||(e.lines[r].viewing=!0),n[r].viewing=e.lines[r].viewing,n[r].sps=e.lines[r].sps,n[r].nSec=e.lines[r].nSec,n[r].nPoints=e.lines[r].nPoints,n[r].ymin=e.lines[r].ymin,n[r].ymax=e.lines[r].ymax,n[r].units=e.lines[r].units;let h={plot:t,settings:e,initial:Object.assign(Object.assign({},e),{lines:n}),anim:()=>{t.update()}};this.plots[e._id]=h;let o=0,a=0;Object.keys(e.lines).forEach(r=>{e.lines[r]?.viewing!==!1&&a++}),e.nLines=a;let l,s;typeof e.overlay=="object"&&(l=e.overlay,s=e.overlayCtx,s.clearRect(0,0,e.overlay.width,e.overlay.height),s.font=e.overlayFont?e.overlayFont:"1em Courier",s.fillStyle=e.overlayColor?e.overlayColor:"white");for(let r in e.lines){let i=e.lines[r];if(Array.isArray(i)&&(i={values:i},e.lines[r]=i),"viewing"in i||(i.viewing=!0),i.color)Array.isArray(i.color)&&(i.color=new v(...i.color));else{let m=y.HSLToRGB(360*(o/a)%360,100,50,1);h.initial.lines[r].color=[...m,1],i.color=new v(...m,1)}let u;if(i.nSec&&i.sps?u=Math.ceil(i.nSec*i.sps):i.nPoints?u=i.nPoints:i.points?u=i.points:e.linePoints?u=e.linePoints:i.values?u=i.values.length:u=1e3,i.points=u,e.lines[r].viewing===!1)continue;if((i.width||e.lineWidth)&&i.width!==0){let m=e.lineWidth;m||(m=i.width),i.width?i.line=new p(i.color,u,i.width):e.lineWidth&&(i.line=new p(i.color,u,e.lineWidth)),i.line.lineSpaceX(-1,2/i.line.numPoints)}else i.line=new d(i.color,u),i.line.arrangeX();i.values?.length===i.points?i.values.length!==u&&(i.interpolate?i.values.length>u?i.values=y.downsample(i.values,u):i.values.length<u&&(i.values=y.upsample(i.values,u)):i.values.length>i.points?i.values=i.values.slice(i.values.length-i.points):i.values=[...new Array(i.points-i.values.length).fill(0),...i.values]):Array.isArray(i.values)?i.values.length>u?i.values=i.values.slice(i.values.length-u):i.values.length<u&&(i.values=[...new Array(u-i.values.length).fill(0),...i.values]):i.values=new Array(i.points).fill(0);let g=i.ymin,f=i.ymax,b=i.values.length<=1e5;if(g===f?(f=b?Math.max(...i.values):1,g=b?Math.min(...i.values):0):isNaN(f)&&(f=b?Math.max(...i.values):1),isNaN(g)&&(g=b?Math.min(...i.values):0),g>f){let m=g;f=g,g=m}let w=Math.abs(g);if(i.absmax=w>f?w:f,"autoscale"in i||(i.autoscale=!0),i.position||(i.position=e.nLines-o-1),i.autoscale?i.autoscale===2?("clamp"in i||(i.clamp=!0),i.scaled=y.autoscale(i.values,i.position,a,i.centerZero,g,f,i.clamp)):(i.scaled=i.values,i.line.scaleY=y.getYScalar(i.values,a,i.centerZero,g,f),i.line.offsetY=y.getYOffset(i.position,a,g,i.line.scaleY)):i.scaled=i.values,i.scaled.forEach((m,_)=>i.line.setY(_,m)),i.line instanceof p?t.addThickLine(i.line):i.line instanceof d&&t.addDataLine(i.line),"xAxis"in i||(i.xAxis=!0),i.xAxis){i.xColor?Array.isArray(i.xColor)&&(i.xColor=new v(...i.xColor)):i.xColor=new v(1,1,1,.3);let m=new d(i.xColor,2),_=i.autoscale?(o+1)*2/a-1-1/a:0;m.constY(_),m.arrangeX(),m.xy[2]=1,i.x=m,t.addAuxLine(m)}if(a>1&&i.autoscale&&o!==a-1){e.dividerColor?Array.isArray(e.dividerColor)&&(e.dividerColor=new v(...e.dividerColor)):e.dividerColor=new v(1,1,1,1);let m=new d(e.dividerColor,2);m.constY(i.autoscale?(o+1)*2/a-1:1),m.arrangeX(),m.xy[2]=1,i.divider=m,t.addAuxLine(m)}if(typeof e.overlay=="object"&&(i.useOverlay||!("useOverlay"in i))){let m=e.nLines-i.position-1;s.fillText(r,20,l.height*(m+.2)/e.nLines),s.fillText(`${Math.floor(f)===f?f:f?.toFixed(5)} ${i.units?i.units:""}`,l.width-100,l.height*(m+.2)/e.nLines),s.fillText(`${Math.floor(g)===g?g:g?.toFixed(5)} ${i.units?i.units:""}`,l.width-100,l.height*(m+.9)/e.nLines)}o++}return requestAnimationFrame(h.anim),this.plots[e._id]}deinitPlot(e){return typeof e=="string"&&(e=this.plots[e]),e.plot.clear(),e.plot.removeAllLines(),!0}reinitPlot(e,t){if(typeof e=="string"){let n=e;e=this.plots[e],t._id||(t._id=n)}if(e.plot)return e.plot.clear(),e.plot.removeAllLines(),e.settings.overlayCtx&&e.settings.overlayCtx.clearRect(0,0,e.settings.overlay?.width,e.settings.overlay?.height),this.initPlot(t,e.plot)}getChartSettings(e,t){let n=this.plots[e];if(n){let h=Object.assign({},n.initial);for(let o in n.initial.lines)typeof n.initial.lines[o]?.ymax!="number"&&(h.lines[o].ymax=n.settings.lines[o]?.ymax),typeof n.initial.lines[o]?.ymin!="number"&&(h.lines[o].ymin=n.settings.lines[o]?.ymin),t&&(h.lines[o].values=n.settings.lines[o].values);return delete h.canvas,delete h.overlay,delete h.overlayCtx,h}}update(e,t,n=!0){if(typeof e=="string"&&(e=this.plots[e]),!e)return!1;if(t){let h=!1,o,a;typeof e.settings.overlay=="object"&&(o=e.settings.overlay,a=e.settings.overlayCtx,a.font=e.settings.overlayFont?e.settings.overlayFont:"1em Courier",a.fillStyle=e.settings.overlayColor?e.settings.overlayColor:"white");for(let l in t)if(e.settings.lines[l]&&e.settings.lines[l].line){if(e.settings.lines[l]?.viewing===!1)continue;let s=e.settings.lines[l];if(s.values){if(e.settings.mode&&e.settings.mode==="sweep"){"ct"in s||(s.ct=0);let f=b=>{s.ct>s.values.length&&(s.ct=0),s.values[s.ct]=b,s.ct++};Array.isArray(t[l])?(s.ct===0&&(s.values=new Array(s.values.length).fill(t[l][t[l].length-1])),t[l].forEach(f)):typeof t[l]=="number"?(s.ct===0&&(s.values=new Array(s.values.length).fill(t[l])),f(t[l])):t[l].values&&(s.ct===0&&(s.values=new Array(s.values.length).fill(t[l].values[t[l].values.length-1])),t[l].values.forEach(f))}else Array.isArray(t[l])&&s.values?.length<1e5?(s.values.length===0&&(s.values.length=s.points?s.points:1e3,s.values.fill(t[l][t[l].length-1])),t[l].length===s.values.length?s.values=t[l]:y.circularBuffer(s.values,t[l])):typeof t[l]=="number"?((s.values[0]===void 0||s.values[0]===0)&&s.values.fill(t[l]),s.values.push(t[l]),s.values.shift()):t[l]?.values&&(s.values.length===0&&(s.values.length=s.points?s.points:1e3,s.values.fill(t[l].values[t[l].values.length-1])),t[l].values.length===s.values.length?s.values=t[l].values:y.circularBuffer(s.values,t[l].values));s.values.length!==s.points&&(s.interpolate?s.values.length>s.points?s.values=y.downsample(s.values,s.points):s.scaled.length<s.points&&(s.values=y.upsample(s.values,s.points)):s.values.length>s.points?s.values.splice(0,s.values.length-s.points):s.values=new Array(s.points).fill(0).splice(s.points-s.values.length,0,s.values));let r=s.ymin,i=s.ymax,u=s.values.length<=1e5;if(r===i?(i=u?Math.max(...s.values):1,r=u?Math.min(...s.values):0):isNaN(i)&&(i=u?Math.max(...s.values):1),isNaN(r)&&(r=u?Math.min(...s.values):0),r>i){let f=r;i=r,r=f}let g=Math.abs(r);if(s.absmax=g>i?g:i,s.autoscale?s.autoscale===2?s.scaled=y.autoscale(s.values,s.position,e.settings.nLines,s.centerZero,r,i,s.clamp):(s.scaled=s.values,s.line.scaleY=y.getYScalar(s.values,e.settings.nLines,s.centerZero,r,i),s.line.offsetY=y.getYOffset(s.position,e.settings.nLines,r,s.line.scaleY)):s.scaled=s.values,s.scaled.forEach((f,b)=>{!s.autoscale&&s.absmax>1?s.line.setY(b,f/s.absmax):s.line.setY(b,f)}),typeof e.settings.overlay=="object"&&(s.useOverlay||!("useOverlay"in s))){let f=e.settings.nLines-s.position-1,b=o.height*f/e.settings.nLines,w=o.height/e.settings.nLines;if(a.clearRect(0,b,o.width,w),e.settings.mode&&e.settings.mode==="sweep"){a.fillStyle=e.settings.sweepColor?e.settings.sweepColor:"rgba(0,255,0,0.8)",a.beginPath();let m=o.width*s.ct/s.values.length;a.moveTo(m,b),a.lineTo(m,w),a.stroke()}a.fillStyle=e.settings.overlayColor?e.settings.overlayColor:"white",a.fillText(l,20,o.height*(f+.2)/e.settings.nLines),a.fillText(`${Math.floor(i)===i?i:i?.toFixed(5)} ${s.units?s.units:""}`,o.width-100,o.height*(f+.2)/e.settings.nLines),a.fillText(`${Math.floor(r)===r?r:r?.toFixed(5)} ${s.units?s.units:""}`,o.width-100,o.height*(f+.9)/e.settings.nLines)}}}else e.settings.generateNewLines&&!l.includes("timestamp")&&(Array.isArray(t[l])&&(t[l]={values:t[l]}),!t[l].nSec&&!t[l].nPoints&&!e.settings.linePoints&&(t[l].nPoints=1e3),h=!0);if(h)return e.settings.cleanGeneration||Object.keys(e.initial.lines).forEach(l=>{t[l]?t[l]=Object.assign(e.initial.lines[l],t[l]):t[l]=e.initial.lines[l]}),this.reinitPlot(e,{_id:e.settings._id,lines:t}),!0}return n&&requestAnimationFrame(e.anim),!0}updateLine(e,t,n,h,o,a,l){return e.numPoints!==t.length&&(n?e.numPoints>t.length?t=y.downsample(t,e.numPoints):e.numPoints<t.length&&(t=y.upsample(t,e.numPoints)):t.length>e.numPoints?t=t.slice(t.length-e.numPoints):t=[...new Array(t.length).fill(0),...t]),h&&(t=y.autoscale(t,o,a,l)),t.forEach((s,r)=>e.setY(r,s)),!0}static autoscale(e,t=0,n=1,h=!1,o,a,l){if(e?.length===0)return e;let s=typeof a=="number"?a:e.length<=1e5?Math.max(...e):1,r=typeof o=="number"?o:e.length<=1e5?Math.min(...e):0,i=1/n,u=1;if(h){let g=Math.max(Math.abs(r),Math.abs(s));return g!==0&&(u=i/g),e.map(f=>(l&&(f<r&&(f=r),f>s&&(f=s)),f*u+(i*(t+1)*2-1-i)))}else return s===r?s!==0?u=i/s:r!==0&&(u=i/Math.abs(r)):u=i/(s-r),e.map(g=>(l&&(g<r&&(g=r),g>s&&(g=s)),2*((g-r)*u-1/(2*n))+(i*(t+1)*2-1-i)))}static getYScalar(e,t=1,n=!1,h,o){if(e?.length===0)return e;let a=typeof o=="number"?o:e.length<=1e5?Math.max(...e):1,l=typeof h=="number"?h:e.length<=1e5?Math.min(...e):0,s=1/t,r=1;if(n){let i=Math.max(Math.abs(l),Math.abs(a));return i!==0&&(r=s/i),2*r}else return a===l?a!==0?r=s/a:l!==0&&(r=s/Math.abs(l)):r=s/(a-l),2*r}static getYOffset(e=0,t=1,n=0,h=1){let o=1/t,a=o*(e+1)*2-1-o;return n!==0?a-=n*h+1/t:a-=h+1/t,a}static absmax(e){return Math.max(Math.abs(Math.min(...e)),Math.max(...e))}static downsample(e,t,n=1){if(e.length>t){let h=new Array(t),o=e.length/t,a=e.length-1,l=0,s=0;for(let r=o;r<e.length;r+=o){let i=Math.round(r);i>a&&(i=a);for(let u=l;u<i;u++)h[s]+=e[u];h[s]/=(i-l)*n,s++,l=i}return h}else return e}static upsample(e,t,n=1){var h=function(g,f,b){return(g+(f-g)*b)*n},o=new Array(t),a=(e.length-1)/(t-1);o[0]=e[0];for(var l=1;l<t-1;l++){var s=l*a,r=Math.floor(s),i=Math.ceil(s),u=s-r;o[l]=h(e[r],e[i],u)}return o[t-1]=e[e.length-1],o}static interpolate(e,t,n=1){return e.length>t?y.downsample(e,t,n):e.length<t?y.upsample(e,t,n):e}static HSLToRGB(e,t,n,h=255){t/=100,n/=100;let o=(1-Math.abs(2*n-1))*t,a=o*(1-Math.abs(e/60%2-1)),l=n-o/2,s=0,r=0,i=0;return 0<=e&&e<60?(s=o,r=a,i=0):60<=e&&e<120?(s=a,r=o,i=0):120<=e&&e<180?(s=0,r=o,i=a):180<=e&&e<240?(s=0,r=a,i=o):240<=e&&e<300?(s=a,r=0,i=o):300<=e&&e<360&&(s=o,r=0,i=a),s=(s+l)*h,r=(r+l)*h,i=(i+l)*h,[s,r,i]}static circularBuffer(e,t){if(t.length<e.length){let n=e.slice(t.length),h=e.length;e.splice(0,h,...n,...t)}else if(t.length>e.length){let n=e.length;e.splice(0,n,...t.slice(t.length-n))}else e.splice(0,e.length,...t);return e}static formatDataForCharts(e,t){if(Array.isArray(e)){if(Array.isArray(e[0])){let n={};if(e.forEach((h,o)=>{n[o]=h}),e=n,isNaN(e[0][0]))return}else if(t){if(e={[t]:e},isNaN(e[t][0]))return}else if(e={0:e},isNaN(e[0][0]))return}else if(typeof e=="object"){for(let n in e)if(typeof e[n]=="number"?e[n]=[e[n]]:e[n]?.values&&typeof e[n].values=="number"&&(e[n].values=[e[n].values]),isNaN(e[n][0]))return}else if(typeof e=="string"){let n;if(e.includes(`\r
`)){let h=e.split(`\r
`);e={},h.forEach((o,a)=>{o.includes("	")?n=o.split("	"):o.includes(",")?n=o.split(","):o.includes("|")&&(n=o.split("|")),n&&n.forEach((l,s)=>{if(l.includes(":")){let[r,i]=l.split(":"),u=parseFloat(i);isNaN(u)||(e[r]=[u])}else{let r=parseFloat(l);isNaN(r)||(e[s]=[r])}})})}else e.includes("	")?n=e.split("	"):e.includes(",")?n=e.split(","):e.includes("|")&&(n=e.split("|"));e={},n&&n.forEach((h,o)=>{if(h.includes(":")){let[a,l]=h.split(":"),s=parseFloat(l);isNaN(s)||(e[a]=[s])}else{let a=parseFloat(h);isNaN(a)||(e[o]=[a])}})}else typeof e=="number"&&(t?e={[t]:[e]}:e={0:[e]});return e}static padTime(e,t,n,h){let o=(e[0]-t)/n/h;return[...new Array(h-e.length).map((l,s)=>t+o*(s+1)),...e]}static interpolateForTime(e,t,n){return y.interpolate(e,Math.ceil(n*t))}};})();
