var y=class{r;g;b;a;constructor(e,t,l,o){this.r=e,this.g=t,this.b=l,this.a=o}},w=class{intensity;visible;numPoints;xy;color;scaleX;scaleY;offsetX;offsetY;loop;webglNumPoints;_vbuffer;_coord;constructor(){this.scaleX=1,this.scaleY=1,this.offsetX=0,this.offsetY=0,this.loop=!1,this._vbuffer=0,this._coord=0,this.visible=!0,this.intensity=1,this.xy=new Float32Array([]),this.numPoints=0,this.color=new y(0,0,0,1),this.webglNumPoints=0}},v=class extends w{currentIndex=0;constructor(e,t){super(),this.webglNumPoints=t,this.numPoints=t,this.color=e,this.xy=new Float32Array(2*this.webglNumPoints)}setX(e,t){this.xy[e*2]=t}setY(e,t){this.xy[e*2+1]=t}getX(e){return this.xy[e*2]}getY(e){return this.xy[e*2+1]}lineSpaceX(e,t){for(let l=0;l<this.numPoints;l++)this.setX(l,e+t*l)}arrangeX(){this.lineSpaceX(-1,2/this.numPoints)}constY(e){for(let t=0;t<this.numPoints;t++)this.setY(t,e)}shiftAdd(e){let t=e.length;for(let l=0;l<this.numPoints-t;l++)this.setY(l,this.getY(l+t));for(let l=0;l<t;l++)this.setY(l+this.numPoints-t,e[l])}addArrayY(e){if(this.currentIndex+e.length<=this.numPoints)for(let t=0;t<e.length;t++)this.setY(this.currentIndex,e[t]),this.currentIndex++}replaceArrayY(e){if(e.length==this.numPoints)for(let t=0;t<this.numPoints;t++)this.setY(t,e[t])}};var Y=(u,e,t)=>{let l={x:0,y:0};return l.x=u.x+e.x*t,l.y=u.y+e.y*t,l},A=u=>P(-u.y,u.x),p=(u,e)=>{let t=R(u,e);return t=M(t),t},T=(u,e)=>{let t={x:0,y:0};return t.x=u.x+e.x,t.y=u.y+e.y,t},C=(u,e)=>u.x*e.x+u.y*e.y,M=u=>{let e={x:0,y:0},t=u.x*u.x+u.y*u.y;return t>0&&(t=1/Math.sqrt(t),e.x=u.x*t,e.y=u.y*t),e},P=(u,e)=>{let t={x:0,y:0};return t.x=u,t.y=e,t},R=(u,e)=>{let t={x:0,y:0};return t.x=u.x-e.x,t.y=u.y-e.y,t},X=u=>{let e,t={x:0,y:0},l={x:0,y:0},o=[],a=(s,r)=>{o.push({vec2:s,miterLength:r})},h=s=>({x:u[s*2],y:u[s*2+1]});t=p(h(1),h(0)),e=A(t),a(e,1);let n=u.length/2;for(let s=1;s<n-1;s++){let r=h(s-1),i=h(s),f=h(s+1);t=p(i,r),e=A(t),l=p(f,i);let c=F(t,l),g=N(t,c,1);a(c,g)}return t=p(h(n-1),h(n-2)),e=A(t),a(e,1),o},F=(u,e)=>{let t=T(u,e);return t=M(t),P(-t.y,t.x)},N=(u,e,t)=>{let l=P(-u.y,u.x);return t/C(e,l)},d=class extends w{currentIndex=0;_linePoints;_thicknessRequested=0;_actualThickness=0;constructor(e,t,l){super(),this.webglNumPoints=t*2,this.numPoints=t,this.color=e,this._thicknessRequested=l,this._linePoints=new Float32Array(t*2),this.xy=new Float32Array(2*this.webglNumPoints)}convertToTriPoints(){let e=this._actualThickness/2,t=X(this._linePoints);for(let l=0;l<this.numPoints;l++){let o=this._linePoints[2*l],a=this._linePoints[2*l+1],h={x:o,y:a},n=Y(h,t[l].vec2,t[l].miterLength*e),s=Y(h,t[l].vec2,-t[l].miterLength*e);this.xy[l*4]=n.x,this.xy[l*4+1]=n.y,this.xy[l*4+2]=s.x,this.xy[l*4+3]=s.y}}setX(e,t){this._linePoints[e*2]=t}setY(e,t){this._linePoints[e*2+1]=t}lineSpaceX(e,t){for(let l=0;l<this.numPoints;l++)this.setX(l,e+t*l)}setThickness(e){this._thicknessRequested=e}getThickness(){return this._thicknessRequested}setActualThickness(e){this._actualThickness=e}},x=class{webgl;gScaleX;gScaleY;gXYratio;gOffsetX;gOffsetY;gLog10X;gLog10Y;_linesData;_linesAux;_thickLines;_surfaces;get linesData(){return this._linesData}get linesAux(){return this._linesAux}get thickLines(){return this._thickLines}get surfaces(){return this._surfaces}_progLine;debug=!1;constructor(e,t){t==null?this.webgl=e.getContext("webgl",{antialias:!0,transparent:!1}):(this.webgl=e.getContext("webgl",{antialias:t.antialias,transparent:t.transparent,desynchronized:t.deSync,powerPerformance:t.powerPerformance,preserveDrawing:t.preserveDrawing}),this.debug=t.debug==null?!1:t.debug),this.log("canvas type is: "+e.constructor.name),this.log(`[webgl-plot]:width=${e.width}, height=${e.height}`),this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[],this.gScaleX=1,this.gScaleY=1,this.gXYratio=1,this.gOffsetX=0,this.gOffsetY=0,this.gLog10X=!1,this.gLog10Y=!1,this.webgl.clear(this.webgl.COLOR_BUFFER_BIT),this.webgl.viewport(0,0,e.width,e.height),this._progLine=this.webgl.createProgram(),this.initThinLineProgram(),this.webgl.enable(this.webgl.BLEND),this.webgl.blendFunc(this.webgl.SRC_ALPHA,this.webgl.ONE_MINUS_SRC_ALPHA)}_drawLines(e){let t=this.webgl;e.forEach(l=>{if(l.visible){t.useProgram(this._progLine);let o=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(o,!1,new Float32Array([l.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,l.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let a=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(a,new Float32Array([l.offsetX+this.gOffsetX,l.offsetY+this.gOffsetY]));let h=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(h,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let n=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(n,[l.color.r,l.color.g,l.color.b,l.color.a]),t.bufferData(t.ARRAY_BUFFER,l.xy,t.STREAM_DRAW),t.drawArrays(l.loop?t.LINE_LOOP:t.LINE_STRIP,0,l.webglNumPoints)}})}_drawSurfaces(e){let t=this.webgl;e.forEach(l=>{if(l.visible){t.useProgram(this._progLine);let o=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(o,!1,new Float32Array([l.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,l.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let a=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(a,new Float32Array([l.offsetX+this.gOffsetX,l.offsetY+this.gOffsetY]));let h=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(h,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let n=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(n,[l.color.r,l.color.g,l.color.b,l.color.a]),t.bufferData(t.ARRAY_BUFFER,l.xy,t.STREAM_DRAW),t.drawArrays(t.TRIANGLE_STRIP,0,l.webglNumPoints)}})}_drawTriangles(e){let t=this.webgl;t.bufferData(t.ARRAY_BUFFER,e.xy,t.STREAM_DRAW),t.useProgram(this._progLine);let l=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(l,!1,new Float32Array([e.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,e.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let o=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(o,new Float32Array([e.offsetX+this.gOffsetX,e.offsetY+this.gOffsetY]));let a=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(a,new Int32Array([0,0]));let h=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(h,[e.color.r,e.color.g,e.color.b,e.color.a]),t.drawArrays(t.TRIANGLE_STRIP,0,e.xy.length/2)}_drawThickLines(){this._thickLines.forEach(e=>{if(e.visible){let t=Math.min(this.gScaleX,this.gScaleY);e.setActualThickness(e.getThickness()/t),e.convertToTriPoints(),this._drawTriangles(e)}})}update(){this.clear(),this.draw()}draw(){this._drawLines(this.linesData),this._drawLines(this.linesAux),this._drawThickLines(),this._drawSurfaces(this.surfaces)}clear(){this.webgl.clear(this.webgl.COLOR_BUFFER_BIT)}_addLine(e){e._vbuffer=this.webgl.createBuffer(),this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER,e._vbuffer),this.webgl.bufferData(this.webgl.ARRAY_BUFFER,e.xy,this.webgl.STREAM_DRAW),e._coord=this.webgl.getAttribLocation(this._progLine,"coordinates"),this.webgl.vertexAttribPointer(e._coord,2,this.webgl.FLOAT,!1,0,0),this.webgl.enableVertexAttribArray(e._coord)}addDataLine(e){this._addLine(e),this.linesData.push(e)}addLine=this.addDataLine;addAuxLine(e){this._addLine(e),this.linesAux.push(e)}addThickLine(e){this._addLine(e),this._thickLines.push(e)}addSurface(e){this._addLine(e),this.surfaces.push(e)}initThinLineProgram(){let e=`
      attribute vec2 coordinates;
      uniform mat2 uscale;
      uniform vec2 uoffset;
      uniform ivec2 is_log;

      void main(void) {
         float x = (is_log[0]==1) ? log(coordinates.x) : coordinates.x;
         float y = (is_log[1]==1) ? log(coordinates.y) : coordinates.y;
         vec2 line = vec2(x, y);
         gl_Position = vec4(uscale*line + uoffset, 0.0, 1.0);
      }`,t=this.webgl.createShader(this.webgl.VERTEX_SHADER);this.webgl.shaderSource(t,e),this.webgl.compileShader(t);let l=`
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`,o=this.webgl.createShader(this.webgl.FRAGMENT_SHADER);this.webgl.shaderSource(o,l),this.webgl.compileShader(o),this._progLine=this.webgl.createProgram(),this.webgl.attachShader(this._progLine,t),this.webgl.attachShader(this._progLine,o),this.webgl.linkProgram(this._progLine)}popDataLine(){this.linesData.pop()}removeAllLines(){this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[]}removeDataLines(){this._linesData=[]}removeAuxLines(){this._linesAux=[]}viewport(e,t,l,o){this.webgl.viewport(e,t,l,o)}log(e){this.debug&&console.log("[webgl-plot]:"+e)}};var S=class u{constructor(){this.plots={};this.renderOverlay=(e,t,l,o,a,h=1,n=0)=>{if(typeof l.settings.overlay=="object"&&(o.useOverlay||!("useOverlay"in o))){let s=l.settings.nLines-o.position-1,r=e.height*s/l.settings.nLines,i=e.height*(s+1)/l.settings.nLines;if(t.clearRect(0,r,e.width,i),l.settings.mode==="sweep"){t.strokeStyle=l.settings.sweepColor?l.settings.sweepColor:"rgba(0,255,0,0.8)",t.beginPath();let f=e.width*o.ct/o.values.length;t.moveTo(f,r),t.lineTo(f,i),t.stroke()}if(t.fillStyle=l.settings.overlayColor?l.settings.overlayColor:"white",a&&t.fillText(a,20,e.height*(s+.2)/l.settings.nLines),o.nSec){let f=this.formatTime(o.nSec);t.fillText(`${f}`,l.settings.mode==="sweep"?e.width-35:20,e.height*(s+.9)/l.settings.nLines),t.fillText("0:00",l.settings.mode==="sweep"?20:e.width-35,e.height*(s+.9)/l.settings.nLines)}typeof h=="number"&&t.fillText(`${Math.floor(h)===h?h:h?.toFixed(5)} ${o.units?o.units:""}`,e.width-100,e.height*(s+.2)/l.settings.nLines),typeof n=="number"&&t.fillText(`${Math.floor(n)===n?n:n?.toFixed(5)} ${o.units?o.units:""}`,e.width-100,e.height*(s+.8)/l.settings.nLines)}}}initPlot(e,t){if(t||(t=new x(e.canvas,e.webglOptions)),!e._id)e._id=`plot${Math.floor(Math.random()*1e15)}`;else if(this.plots[e._id]){let r=this.plots[e._id].initial;if(e.lines){for(let i in e.lines)if(r.lines[i]&&Array.isArray(e.lines[i])){let f=e.lines[i];e.lines[i]=r.lines[i]}}e=Object.assign(r,e)}e.overlay&&(typeof e.overlay!="object"&&(e.overlay=document.createElement("canvas"),e.overlay.style.position="absolute",e.overlay.width=e.canvas.width,e.overlay.height=e.canvas.height,e.canvas.appendChild(e.overlay)),e.overlayCtx||(e.overlayCtx=e.overlay.getContext("2d"))),e.width&&(e.canvas.width=e.width,e.canvas.style&&(e.canvas.style.width=e.width+"px"),typeof e.overlay=="object"&&(e.overlay.width=e.width,e.overlay.style&&(e.overlay.style.width=e.width+"px"))),e.height&&(e.canvas.height=e.height,e.canvas.style&&(e.canvas.style.height=e.height+"px"),typeof e.overlay=="object"&&(e.overlay.height=e.height,e.overlay.style&&(e.overlay.style.height=e.height+"px"))),e.lines?.timestamp&&delete e.lines.timestamp,e.lines||(e.lines={});let l={};for(let r in e.lines)l[r]=Object.assign({},l[r]),"viewing"in e.lines[r]||(e.lines[r].viewing=!0),l[r].viewing=e.lines[r].viewing,l[r].sps=e.lines[r].sps,l[r].nSec=e.lines[r].nSec,l[r].nPoints=e.lines[r].nPoints,l[r].ymin=e.lines[r].ymin,l[r].ymax=e.lines[r].ymax,l[r].units=e.lines[r].units;let o={plot:t,settings:e,initial:Object.assign(Object.assign({},e),{lines:l}),anim:()=>{t.update()}};this.plots[e._id]=o;let a=0,h=0;Object.keys(e.lines).forEach(r=>{e.lines[r]?.viewing!==!1&&h++}),e.nLines=h;let n,s;typeof e.overlay=="object"&&(n=e.overlay,s=e.overlayCtx,s.clearRect(0,0,e.overlay.width,e.overlay.height),s.font=e.overlayFont?e.overlayFont:"1em Courier",s.fillStyle=e.overlayColor?e.overlayColor:"white");for(let r in e.lines){let i=e.lines[r];if(Array.isArray(i)&&(i={values:i},e.lines[r]=i),"viewing"in i||(i.viewing=!0),i.color)Array.isArray(i.color)&&(i.color=new y(...i.color));else{let m=u.HSLToRGB(360*(a/h)%360,100,50,1);o.initial.lines[r].color=[...m,1],i.color=new y(...m,1)}let f;if(i.nSec&&i.sps?f=Math.ceil(i.nSec*i.sps):i.nPoints?f=i.nPoints:i.points?f=i.points:e.linePoints?f=e.linePoints:i.values?f=i.values.length:f=1e3,i.points=f,e.lines[r].viewing===!1)continue;if((i.width||e.lineWidth)&&i.width!==0){let m=e.lineWidth;m||(m=i.width),i.width?i.line=new d(i.color,f,i.width):e.lineWidth&&(i.line=new d(i.color,f,e.lineWidth)),i.line.lineSpaceX(-1,2/i.line.numPoints)}else i.line=new v(i.color,f),i.line.arrangeX();i.values?.length===i.points?i.values.length!==f&&(i.interpolate?i.values.length>f?i.values=u.downsample(i.values,f):i.values.length<f&&(i.values=u.upsample(i.values,f)):i.values.length>i.points?i.values=i.values.slice(i.values.length-i.points):i.values=[...new Array(i.points-i.values.length).fill(0),...i.values]):Array.isArray(i.values)?i.values.length>f?i.values=i.values.slice(i.values.length-f):i.values.length<f&&(i.values=[...new Array(f-i.values.length).fill(0),...i.values]):i.values=new Array(i.points).fill(0);let c=i.ymin,g=i.ymax,b=i.values.length<=1e5;if(c===g?(g=b?Math.max(...i.values):1,c=b?Math.min(...i.values):0):isNaN(g)&&(g=b?Math.max(...i.values):1),isNaN(c)&&(c=b?Math.min(...i.values):0),c>g){let m=c;g=c,c=m}let _=Math.abs(c);if(i.absmax=_>g?_:g,"autoscale"in i||(i.autoscale=!0),i.position||(i.position=e.nLines-a-1),i.autoscale?i.autoscale===2?("clamp"in i||(i.clamp=!0),i.scaled=u.autoscale(i.values,i.position,h,i.centerZero,c,g,i.clamp)):(i.scaled=i.values,i.line.scaleY=u.getYScalar(i.values,h,i.centerZero,c,g),i.line.offsetY=u.getYOffset(i.position,h,c,i.line.scaleY)):i.scaled=i.values,i.scaled.forEach((m,L)=>i.line.setY(L,m)),i.line instanceof d?t.addThickLine(i.line):i.line instanceof v&&t.addDataLine(i.line),"xAxis"in i||(i.xAxis=!0),i.xAxis){i.xColor?Array.isArray(i.xColor)&&(i.xColor=new y(...i.xColor)):i.xColor=new y(1,1,1,.3);let m=new v(i.xColor,2),L=i.autoscale?(a+1)*2/h-1-1/h:0;m.constY(L),m.arrangeX(),m.xy[2]=1,i.x=m,t.addAuxLine(m)}if(h>1&&i.autoscale&&a!==h-1){e.dividerColor?Array.isArray(e.dividerColor)&&(e.dividerColor=new y(...e.dividerColor)):e.dividerColor=new y(1,1,1,1);let m=new v(e.dividerColor,2);m.constY(i.autoscale?(a+1)*2/h-1:1),m.arrangeX(),m.xy[2]=1,i.divider=m,t.addAuxLine(m)}if(typeof e.overlay=="object"&&(i.useOverlay||!("useOverlay"in i))){let m=e.nLines-i.position-1;s.fillText(r,20,n.height*(m+.2)/e.nLines),s.fillText(`${Math.floor(g)===g?g:g?.toFixed(5)} ${i.units?i.units:""}`,n.width-100,n.height*(m+.2)/e.nLines),s.fillText(`${Math.floor(c)===c?c:c?.toFixed(5)} ${i.units?i.units:""}`,n.width-100,n.height*(m+.9)/e.nLines)}a++}return requestAnimationFrame(o.anim),this.plots[e._id]}deinitPlot(e){return typeof e=="string"&&(e=this.plots[e]),e.plot.clear(),e.plot.removeAllLines(),!0}reinitPlot(e,t){if(typeof e=="string"){let l=e;e=this.plots[e],t._id||(t._id=l)}if(e.plot)return e.plot.clear(),e.plot.removeAllLines(),e.settings.overlayCtx&&e.settings.overlayCtx.clearRect(0,0,e.settings.overlay?.width,e.settings.overlay?.height),this.initPlot(t,e.plot)}getChartSettings(e,t){let l=this.plots[e];if(l){let o=Object.assign({},l.initial);for(let a in l.initial.lines)typeof l.initial.lines[a]?.ymax!="number"&&(o.lines[a].ymax=l.settings.lines[a]?.ymax),typeof l.initial.lines[a]?.ymin!="number"&&(o.lines[a].ymin=l.settings.lines[a]?.ymin),t&&(o.lines[a].values=l.settings.lines[a].values);return delete o.canvas,delete o.overlay,delete o.overlayCtx,o}}update(e,t,l=!0){if(typeof e=="string"&&(e=this.plots[e]),!e)return!1;let o,a;if(typeof e.settings.overlay=="object"&&(o=e.settings.overlay,a=e.settings.overlayCtx,a.font=e.settings.overlayFont?e.settings.overlayFont:"1em Courier",a.fillStyle=e.settings.overlayColor?e.settings.overlayColor:"white"),t){let h=!1;for(let n in t)if(e.settings.lines[n]&&e.settings.lines[n].line){if(e.settings.lines[n]?.viewing===!1)continue;let s=e.settings.lines[n];if(s.values){if(e.settings.mode&&e.settings.mode==="sweep"){"ct"in s||(s.ct=0);let g=b=>{s.ct>s.values.length&&(s.ct=0),s.values[s.ct]=b,s.ct++};Array.isArray(t[n])?(s.ct===0&&(s.values=new Array(s.values.length).fill(t[n][t[n].length-1])),t[n].forEach(g)):typeof t[n]=="number"?(s.ct===0&&(s.values=new Array(s.values.length).fill(t[n])),g(t[n])):t[n].values&&(s.ct===0&&(s.values=new Array(s.values.length).fill(t[n].values[t[n].values.length-1])),t[n].values.forEach(g))}else Array.isArray(t[n])&&s.values?.length<1e5?(s.values.length===0?(s.values.length=s.points?s.points:1e3,s.values.fill(t[n][t[n].length-1]),s.firstWrite=!0):s.firstWrite||(s.values.fill(t[n][t[n].length-1]),s.firstWrite=!0),t[n].length===s.values.length?s.values=t[n]:u.circularBuffer(s.values,t[n])):typeof t[n]=="number"?(s.firstWrite||(s.values.fill(t[n]),s.firstWrite=!0),s.values.push(t[n]),s.values.shift()):t[n]?.values&&(s.values.length===0?(s.values.length=s.points?s.points:1e3,s.values.fill(t[n].values[t[n].values.length-1]),s.firstWrite=!0):s.firstWrite||(s.values.fill(t[n].values[t[n].values.length-1]),s.firstWrite=!0),t[n].values.length===s.values.length?s.values=t[n].values:u.circularBuffer(s.values,t[n].values));s.values.length!==s.points&&(s.interpolate?s.values.length>s.points?s.values=u.downsample(s.values,s.points):s.scaled.length<s.points&&(s.values=u.upsample(s.values,s.points)):s.values.length>s.points?s.values.splice(0,s.values.length-s.points):s.values=new Array(s.points).fill(0).splice(s.points-s.values.length,0,s.values));let r=s.ymin,i=s.ymax,f=s.values.length<=1e5;if(r===i?(i=f?Math.max(...s.values):1,r=f?Math.min(...s.values):0):isNaN(i)&&(i=f?Math.max(...s.values):1),isNaN(r)&&(r=f?Math.min(...s.values):0),r>i){let g=r;i=r,r=g}let c=Math.abs(r);s.absmax=c>i?c:i,s.autoscale?s.autoscale===2?s.scaled=u.autoscale(s.values,s.position,e.settings.nLines,s.centerZero,r,i,s.clamp):(s.scaled=s.values,s.line.scaleY=u.getYScalar(s.values,e.settings.nLines,s.centerZero,r,i),s.line.offsetY=u.getYOffset(s.position,e.settings.nLines,r,s.line.scaleY)):s.scaled=s.values,s.scaled.forEach((g,b)=>{!s.autoscale&&s.absmax>1?s.line.setY(b,g/s.absmax):s.line.setY(b,g)}),this.renderOverlay(o,a,e,s,n,i,r)}}else e.settings.generateNewLines&&!n.includes("timestamp")&&(Array.isArray(t[n])&&(t[n]={values:t[n]}),!t[n].nSec&&!t[n].nPoints&&!e.settings.linePoints&&(t[n].nPoints=1e3),h=!0);if(h)return e.settings.cleanGeneration||Object.keys(e.initial.lines).forEach(n=>{t[n]?t[n]=Object.assign(e.initial.lines[n],t[n]):t[n]=e.initial.lines[n]}),this.reinitPlot(e,{_id:e.settings._id,lines:t}),!0}else for(let h in e.settings.lines){let n=e.settings.lines[h];this.renderOverlay(o,a,e,n,h,n.ymax,n.ymin)}return l&&requestAnimationFrame(e.anim),!0}updateLine(e,t,l,o,a,h,n){return e.numPoints!==t.length&&(l?e.numPoints>t.length?t=u.downsample(t,e.numPoints):e.numPoints<t.length&&(t=u.upsample(t,e.numPoints)):t.length>e.numPoints?t=t.slice(t.length-e.numPoints):t=[...new Array(t.length).fill(0),...t]),o&&(t=u.autoscale(t,a,h,n)),t.forEach((s,r)=>e.setY(r,s)),!0}formatTime(e){let t=Math.floor(e/60),l=Math.floor(t/60);t=t%60,e=e%60;let o="";return l>0&&(o+=l+":",t<10&&(o+="0")),o+=t+":",e>0&&(e<10&&(o+="0"),o+=e),o}static autoscale(e,t=0,l=1,o=!1,a,h,n){if(e?.length===0)return e;let s=typeof h=="number"?h:e.length<=1e5?Math.max(...e):1,r=typeof a=="number"?a:e.length<=1e5?Math.min(...e):0,i=1/l,f=1;if(o){let c=Math.max(Math.abs(r),Math.abs(s));return c!==0&&(f=i/c),e.map(g=>(n&&(g<r&&(g=r),g>s&&(g=s)),g*f+(i*(t+1)*2-1-i)))}else return s===r?s!==0?f=i/s:r!==0&&(f=i/Math.abs(r)):f=i/(s-r),e.map(c=>(n&&(c<r&&(c=r),c>s&&(c=s)),2*((c-r)*f-1/(2*l))+(i*(t+1)*2-1-i)))}static getYScalar(e,t=1,l=!1,o,a){if(e?.length===0)return e;let h=typeof a=="number"?a:e.length<=1e5?Math.max(...e):1,n=typeof o=="number"?o:e.length<=1e5?Math.min(...e):0,s=1/t,r=1;if(l){let i=Math.max(Math.abs(n),Math.abs(h));return i!==0&&(r=s/i),2*r}else return h===n?h!==0?r=s/h:n!==0&&(r=s/Math.abs(n)):r=s/(h-n),2*r}static getYOffset(e=0,t=1,l=0,o=1){let a=1/t,h=a*(e+1)*2-1-a;return l!==0?h-=l*o+1/t:h-=o+1/t,h}static absmax(e){return Math.max(Math.abs(Math.min(...e)),Math.max(...e))}static downsample(e,t,l=1){if(e.length>t){let o=new Array(t),a=e.length/t,h=e.length-1,n=0,s=0;for(let r=a;r<e.length;r+=a){let i=Math.round(r);i>h&&(i=h);for(let f=n;f<i;f++)o[s]+=e[f];o[s]/=(i-n)*l,s++,n=i}return o}else return e}static upsample(e,t,l=1){var o=function(c,g,b){return(c+(g-c)*b)*l},a=new Array(t),h=(e.length-1)/(t-1);a[0]=e[0];for(var n=1;n<t-1;n++){var s=n*h,r=Math.floor(s),i=Math.ceil(s),f=s-r;a[n]=o(e[r],e[i],f)}return a[t-1]=e[e.length-1],a}static interpolate(e,t,l=1){return e.length>t?u.downsample(e,t,l):e.length<t?u.upsample(e,t,l):e}static HSLToRGB(e,t,l,o=255){t/=100,l/=100;let a=(1-Math.abs(2*l-1))*t,h=a*(1-Math.abs(e/60%2-1)),n=l-a/2,s=0,r=0,i=0;return 0<=e&&e<60?(s=a,r=h,i=0):60<=e&&e<120?(s=h,r=a,i=0):120<=e&&e<180?(s=0,r=a,i=h):180<=e&&e<240?(s=0,r=h,i=a):240<=e&&e<300?(s=h,r=0,i=a):300<=e&&e<360&&(s=a,r=0,i=h),s=(s+n)*o,r=(r+n)*o,i=(i+n)*o,[s,r,i]}static circularBuffer(e,t){if(t.length<e.length){let l=e.slice(t.length),o=e.length;e.splice(0,o,...l,...t)}else if(t.length>e.length){let l=e.length;e.splice(0,l,...t.slice(t.length-l))}else e.splice(0,e.length,...t);return e}static formatDataForCharts(e,t){if(Array.isArray(e)){if(Array.isArray(e[0])){let l={};if(e.forEach((o,a)=>{l[a]=o}),e=l,isNaN(e[0][0]))return}else if(t){if(e={[t]:e},isNaN(e[t][0]))return}else if(e={0:e},isNaN(e[0][0]))return}else if(typeof e=="object"){for(let l in e)if(typeof e[l]=="number"?e[l]=[e[l]]:e[l]?.values&&typeof e[l].values=="number"&&(e[l].values=[e[l].values]),isNaN(e[l][0]))return}else if(typeof e=="string"){let l;if(e.includes(`\r
`)){let o=e.split(`\r
`);e={},o.forEach((a,h)=>{a.includes("	")?l=a.split("	"):a.includes(",")?l=a.split(","):a.includes("|")&&(l=a.split("|")),l&&l.forEach((n,s)=>{if(n.includes(":")){let[r,i]=n.split(":"),f=parseFloat(i);isNaN(f)||(e[r]=[f])}else{let r=parseFloat(n);isNaN(r)||(e[s]=[r])}})})}else e.includes("	")?l=e.split("	"):e.includes(",")?l=e.split(","):e.includes("|")&&(l=e.split("|"));e={},l&&l.forEach((o,a)=>{if(o.includes(":")){let[h,n]=o.split(":"),s=parseFloat(n);isNaN(s)||(e[h]=[s])}else{let h=parseFloat(o);isNaN(h)||(e[a]=[h])}})}else typeof e=="number"&&(t?e={[t]:[e]}:e={0:[e]});return e}static padTime(e,t,l,o){let a=(e[0]-t)/l/o;return[...new Array(o-e.length).map((n,s)=>t+a*(s+1)),...e]}static interpolateForTime(e,t,l){return u.interpolate(e,Math.ceil(l*t))}};export{S as WebglLinePlotUtil};
