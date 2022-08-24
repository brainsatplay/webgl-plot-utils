(()=>{var m=class{constructor(e,t,s,a){this.r=e,this.g=t,this.b=s,this.a=a}},d=class{constructor(){this.scaleX=1,this.scaleY=1,this.offsetX=0,this.offsetY=0,this.loop=!1,this._vbuffer=0,this._coord=0,this.visible=!0,this.intensity=1,this.xy=new Float32Array([]),this.numPoints=0,this.color=new m(0,0,0,1),this.webglNumPoints=0}},y=class extends d{constructor(e,t){super(),this.currentIndex=0,this.webglNumPoints=t,this.numPoints=t,this.color=e,this.xy=new Float32Array(2*this.webglNumPoints)}setX(e,t){this.xy[e*2]=t}setY(e,t){this.xy[e*2+1]=t}getX(e){return this.xy[e*2]}getY(e){return this.xy[e*2+1]}lineSpaceX(e,t){for(let s=0;s<this.numPoints;s++)this.setX(s,e+t*s)}arrangeX(){this.lineSpaceX(-1,2/this.numPoints)}constY(e){for(let t=0;t<this.numPoints;t++)this.setY(t,e)}shiftAdd(e){let t=e.length;for(let s=0;s<this.numPoints-t;s++)this.setY(s,this.getY(s+t));for(let s=0;s<t;s++)this.setY(s+this.numPoints-t,e[s])}addArrayY(e){if(this.currentIndex+e.length<=this.numPoints)for(let t=0;t<e.length;t++)this.setY(this.currentIndex,e[t]),this.currentIndex++}replaceArrayY(e){if(e.length==this.numPoints)for(let t=0;t<this.numPoints;t++)this.setY(t,e[t])}};var A=(u,e,t)=>{let s={x:0,y:0};return s.x=u.x+e.x*t,s.y=u.y+e.y*t,s},w=u=>L(-u.y,u.x),b=(u,e)=>{let t=R(u,e);return t=_(t),t},Y=(u,e)=>{let t={x:0,y:0};return t.x=u.x+e.x,t.y=u.y+e.y,t},M=(u,e)=>u.x*e.x+u.y*e.y,_=u=>{let e={x:0,y:0},t=u.x*u.x+u.y*u.y;return t>0&&(t=1/Math.sqrt(t),e.x=u.x*t,e.y=u.y*t),e},L=(u,e)=>{let t={x:0,y:0};return t.x=u,t.y=e,t},R=(u,e)=>{let t={x:0,y:0};return t.x=u.x-e.x,t.y=u.y-e.y,t},S=u=>{let e,t={x:0,y:0},s={x:0,y:0},a=[],r=(i,h)=>{a.push({vec2:i,miterLength:h})},n=i=>({x:u[i*2],y:u[i*2+1]});t=b(n(1),n(0)),e=w(t),r(e,1);let o=u.length/2;for(let i=1;i<o-1;i++){let h=n(i-1),l=n(i),c=n(i+1);t=b(l,h),e=w(t),s=b(c,l);let g=T(t,s),p=C(t,g,1);r(g,p)}return t=b(n(o-1),n(o-2)),e=w(t),r(e,1),a},T=(u,e)=>{let t=Y(u,e);return t=_(t),L(-t.y,t.x)},C=(u,e,t)=>{let s=L(-u.y,u.x);return t/M(e,s)},v=class extends d{constructor(e,t,s){super(),this.currentIndex=0,this._thicknessRequested=0,this._actualThickness=0,this.webglNumPoints=t*2,this.numPoints=t,this.color=e,this._thicknessRequested=s,this._linePoints=new Float32Array(t*2),this.xy=new Float32Array(2*this.webglNumPoints)}convertToTriPoints(){let e=this._actualThickness/2,t=S(this._linePoints);for(let s=0;s<this.numPoints;s++){let a=this._linePoints[2*s],r=this._linePoints[2*s+1],n={x:a,y:r},o=A(n,t[s].vec2,t[s].miterLength*e),i=A(n,t[s].vec2,-t[s].miterLength*e);this.xy[s*4]=o.x,this.xy[s*4+1]=o.y,this.xy[s*4+2]=i.x,this.xy[s*4+3]=i.y}}setX(e,t){this._linePoints[e*2]=t}setY(e,t){this._linePoints[e*2+1]=t}lineSpaceX(e,t){for(let s=0;s<this.numPoints;s++)this.setX(s,e+t*s)}setThickness(e){this._thicknessRequested=e}getThickness(){return this._thicknessRequested}setActualThickness(e){this._actualThickness=e}},x=class{constructor(e,t){this.debug=!1,this.addLine=this.addDataLine,t==null?this.webgl=e.getContext("webgl",{antialias:!0,transparent:!1}):(this.webgl=e.getContext("webgl",{antialias:t.antialias,transparent:t.transparent,desynchronized:t.deSync,powerPerformance:t.powerPerformance,preserveDrawing:t.preserveDrawing}),this.debug=t.debug==null?!1:t.debug),this.log("canvas type is: "+e.constructor.name),this.log(`[webgl-plot]:width=${e.width}, height=${e.height}`),this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[],this.gScaleX=1,this.gScaleY=1,this.gXYratio=1,this.gOffsetX=0,this.gOffsetY=0,this.gLog10X=!1,this.gLog10Y=!1,this.webgl.clear(this.webgl.COLOR_BUFFER_BIT),this.webgl.viewport(0,0,e.width,e.height),this._progLine=this.webgl.createProgram(),this.initThinLineProgram(),this.webgl.enable(this.webgl.BLEND),this.webgl.blendFunc(this.webgl.SRC_ALPHA,this.webgl.ONE_MINUS_SRC_ALPHA)}get linesData(){return this._linesData}get linesAux(){return this._linesAux}get thickLines(){return this._thickLines}get surfaces(){return this._surfaces}_drawLines(e){let t=this.webgl;e.forEach(s=>{if(s.visible){t.useProgram(this._progLine);let a=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(a,!1,new Float32Array([s.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,s.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let r=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(r,new Float32Array([s.offsetX+this.gOffsetX,s.offsetY+this.gOffsetY]));let n=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(n,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let o=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(o,[s.color.r,s.color.g,s.color.b,s.color.a]),t.bufferData(t.ARRAY_BUFFER,s.xy,t.STREAM_DRAW),t.drawArrays(s.loop?t.LINE_LOOP:t.LINE_STRIP,0,s.webglNumPoints)}})}_drawSurfaces(e){let t=this.webgl;e.forEach(s=>{if(s.visible){t.useProgram(this._progLine);let a=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(a,!1,new Float32Array([s.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,s.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let r=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(r,new Float32Array([s.offsetX+this.gOffsetX,s.offsetY+this.gOffsetY]));let n=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(n,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let o=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(o,[s.color.r,s.color.g,s.color.b,s.color.a]),t.bufferData(t.ARRAY_BUFFER,s.xy,t.STREAM_DRAW),t.drawArrays(t.TRIANGLE_STRIP,0,s.webglNumPoints)}})}_drawTriangles(e){let t=this.webgl;t.bufferData(t.ARRAY_BUFFER,e.xy,t.STREAM_DRAW),t.useProgram(this._progLine);let s=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(s,!1,new Float32Array([e.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,e.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let a=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(a,new Float32Array([e.offsetX+this.gOffsetX,e.offsetY+this.gOffsetY]));let r=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(r,new Int32Array([0,0]));let n=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(n,[e.color.r,e.color.g,e.color.b,e.color.a]),t.drawArrays(t.TRIANGLE_STRIP,0,e.xy.length/2)}_drawThickLines(){this._thickLines.forEach(e=>{if(e.visible){let t=Math.min(this.gScaleX,this.gScaleY);e.setActualThickness(e.getThickness()/t),e.convertToTriPoints(),this._drawTriangles(e)}})}update(){this.clear(),this.draw()}draw(){this._drawLines(this.linesData),this._drawLines(this.linesAux),this._drawThickLines(),this._drawSurfaces(this.surfaces)}clear(){this.webgl.clear(this.webgl.COLOR_BUFFER_BIT)}_addLine(e){e._vbuffer=this.webgl.createBuffer(),this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER,e._vbuffer),this.webgl.bufferData(this.webgl.ARRAY_BUFFER,e.xy,this.webgl.STREAM_DRAW),e._coord=this.webgl.getAttribLocation(this._progLine,"coordinates"),this.webgl.vertexAttribPointer(e._coord,2,this.webgl.FLOAT,!1,0,0),this.webgl.enableVertexAttribArray(e._coord)}addDataLine(e){this._addLine(e),this.linesData.push(e)}addAuxLine(e){this._addLine(e),this.linesAux.push(e)}addThickLine(e){this._addLine(e),this._thickLines.push(e)}addSurface(e){this._addLine(e),this.surfaces.push(e)}initThinLineProgram(){let e=`
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
         }`,a=this.webgl.createShader(this.webgl.FRAGMENT_SHADER);this.webgl.shaderSource(a,s),this.webgl.compileShader(a),this._progLine=this.webgl.createProgram(),this.webgl.attachShader(this._progLine,t),this.webgl.attachShader(this._progLine,a),this.webgl.linkProgram(this._progLine)}popDataLine(){this.linesData.pop()}removeAllLines(){this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[]}removeDataLines(){this._linesData=[]}removeAuxLines(){this._linesAux=[]}viewport(e,t,s,a){this.webgl.viewport(e,t,s,a)}log(e){this.debug&&console.log("[webgl-plot]:"+e)}};var f=class{constructor(){this.plots={}}initPlot(e,t){if(t||(t=new x(e.canvas,e.webglOptions)),!e._id)e._id=`plot${Math.floor(Math.random()*1e15)}`;else if(this.plots[e._id]){let o=this.plots[e._id].initial;e=Object.assign(o,e)}e.overlay&&(typeof e.overlay!="object"&&(e.overlay=document.createElement("canvas"),e.overlay.style.position="absolute",e.overlay.width=e.canvas.width,e.overlay.height=e.canvas.height,e.canvas.appendChild(e.overlay)),e.overlayCtx||(e.overlayCtx=e.overlay.getContext("2d"))),e.width&&(e.canvas.width=e.width,e.canvas.style&&(e.canvas.style.width=e.width+"px"),typeof e.overlay=="object"&&(e.overlay.width=e.width,e.overlay.style&&(e.overlay.style.width=e.width+"px"))),e.height&&(e.canvas.height=e.height,e.canvas.style&&(e.canvas.style.height=e.height+"px"),typeof e.overlay=="object"&&(e.overlay.height=e.height,e.overlay.style&&(e.overlay.style.height=e.height+"px")));let s={};for(let o in e.lines)Array.isArray(e.lines[o])||(s[o]=Object.assign({},s[o]),"viewing"in e.lines[o]||(e.lines[o].viewing=!0),s[o].viewing=e.lines[o].viewing,s[o].sps=e.lines[o].sps,s[o].nSec=e.lines[o].nSec,s[o].nPoints=e.lines[o].nPoints);let a={plot:t,settings:e,initial:Object.assign(Object.assign({},e),{lines:s}),anim:()=>{t.update()}};this.plots[e._id]=a;let r=0,n=0;Object.keys(e.lines).forEach(o=>{e.lines[o]?.viewing!==!1&&n++}),e.nLines=n;for(let o in e.lines){let i=e.lines[o];if(Array.isArray(i)&&(i={values:i},e.lines[o]=i),"viewing"in i||(i.viewing=!0),i.color)Array.isArray(i.color)&&(i.color=new m(...i.color));else{let l=f.HSLToRGB(360*(r/n)%360,100,50,1);a.initial.lines[o].color=[...l,1],i.color=new m(...l,1)}let h;if(i.nPoints?h=i.nPoints:i.nSec&&i.sps?h=Math.ceil(i.nSec*i.sps):i.values?h=i.values.length:h||(h=1e3),!h)return;if(i.points=h,e.lines[o].viewing!==!1){if(i.width?i.line=new v(i.color,h,i.width):i.line=new y(i.color,h),i.line.arrangeX(),i.values?.length===i.points){if(e.overlay){let l=Math.max(...i.values),c=Math.min(...i.values);i.ymin=c,i.ymax=l;let g=Math.abs(i.ymin);i.absmax=g>i.ymax?g:i.ymax}i.values.length!==h&&(i.interpolate?i.values.length>h?i.values=f.downsample(i.values,h):i.values.length<h&&(i.values=f.upsample(i.values,h)):i.values.length>i.points?i.values=i.values.slice(i.values.length-i.points):i.values=[...new Array(i.points-i.values.length).fill(0),...i.values])}else Array.isArray(i.values)?i.values=[...new Array(h-i.values.length).fill(0),...i.values]:i.values=new Array(i.points).fill(0);if("autoscale"in i||(i.autoscale=!0),i.points>5e3&&(i.autoscale=!1),i.position||(i.position=e.nLines-r-1),i.autoscale&&(i.values=f.autoscale(i.values,i.position?i.position:r,n,i.centerZero)),i.values.forEach((l,c)=>i.line.setY(c,l)),t.addDataLine(i.line),"xAxis"in i||(i.xAxis=!0),i.xAxis){i.xColor?Array.isArray(i.xColor)&&(i.xColor=new m(...i.xColor)):i.xColor=new m(1,1,1,.3);let l=new y(i.xColor,2),c=(r+1)*2/n-1-1/n;i.autoscale?l.constY(c):l.constY(.5),l.arrangeX(),l.xy[2]=1,i.x=l,t.addAuxLine(l)}if(n>1&&i.autoscale&&r!==n-1){e.dividerColor?Array.isArray(e.dividerColor)&&(e.dividerColor=new m(...e.dividerColor)):e.dividerColor=new m(1,1,1,1);let l=new y(e.dividerColor,2);l.constY((r+1)*2/n-1),l.arrangeX(),l.xy[2]=1,i.divider=l,t.addAuxLine(l)}r++}}if(typeof e.overlay=="object"){let o=e.overlay,i=e.overlayCtx;i.clearRect(0,0,e.overlay.width,e.overlay.height),i.font="1em Courier",i.fillStyle="white";for(let h in e.lines){let l=e.lines[h];if(l.useOverlay||!("useOverlay"in l)){let c=e.nLines-l.position-1;i.fillText(h,20,o.height*(c+.1)/e.nLines),i.fillText(l.ymax,o.width-70,o.height*(c+.1)/e.nLines),i.fillText(l.ymin,o.width-70,o.height*(c+.9)/e.nLines)}}}return requestAnimationFrame(a.anim),this.plots[e._id]}deinitPlot(e){return typeof e=="string"&&(e=this.plots[e]),e.plot.clear(),e.plot.removeAllLines(),!0}reinitPlot(e,t){if(typeof e=="string"){let s=e;e=this.plots[e],t._id||(t._id=s)}if(!!e.plot)return e.plot.clear(),e.plot.removeAllLines(),e.settings.overlayCtx&&e.settings.overlayCtx.clearRect(0,0,e.settings.overlay?.width,e.settings.overlay?.height),this.initPlot(t,e.plot)}getChartSettings(e){let t=this.plots[e];if(t){let s=Object.assign({},t.initial);return delete s.canvas,delete s.overlay,delete s.overlayCtx,s}}update(e,t,s=!0){if(typeof e=="string"&&(e=this.plots[e]),!e)return!1;if(t){let a=!1;for(let r in t)if(e.settings.lines[r]&&e.settings.lines[r].line){if(e.settings.lines[r]?.viewing===!1)continue;let n=e.settings.lines[r],o=n.values;if(Array.isArray(t[r])?n.values=t[r]:Object.assign(n,t[r]),n.values){if(e.settings.overlay||n.autoscale){if(n.values.length>1){let i=Math.max(...n.values),h=Math.min(...n.values);n.ymin=h,n.ymax=i;let l=Math.abs(n.ymin);n.absmax=l>n.ymax?l:n.ymax}else if(!("ymax"in n)||n.values[0]>n.ymax){n.ymax=n.values[0];let i=Math.abs(n.ymin);n.absmax=i>n.ymax?i:n.ymax}else if(!("ymin"in n)||n.values[0]<n.ymin){n.ymin=n.values[0];let i=Math.abs(n.ymin);n.absmax=i>n.ymax?i:n.ymax}}n.autoscale&&(n.values=f.autoscale(n.values,n.position,e.settings.nLines,n.centerZero,n.ymin,n.ymax)),n.values.length!==n.points&&(n.interpolate?n.values.length>n.points?n.values=f.downsample(n.values,n.points):n.values.length<n.points&&(n.values=f.upsample(n.values,n.points)):n.values.length>n.points?n.values=n.values.slice(n.values.length-n.points):n.values=[...o.slice(n.values.length),...n.values]),n.values.forEach((i,h)=>{!n.autoscale&&n.absmax>1?n.line.setY(h,i/n.absmax):n.line.setY(h,i)})}}else e.settings.generateNewLines&&!r.includes("timestamp")&&(Array.isArray(t[r])&&(t[r]={values:t[r]}),!t[r].nSec&&!t[r].nPoints&&(t[r].nPoints=1e3),a=!0);if(a)return e.settings.cleanGeneration||Object.keys(e.initial.lines).forEach(r=>{t[r]?t[r]=Object.assign(e.initial.lines[r],t[r]):t[r]=e.initial.lines[r]}),this.reinitPlot(e,{_id:e.settings._id,lines:t}),!0}if(typeof e.settings.overlay=="object"){let a=e.settings.overlay,r=e.settings.overlayCtx;r.clearRect(0,0,e.settings.overlay.width,e.settings.overlay.height),r.font="1em Courier",r.fillStyle="white";for(let n in e.settings.lines){let o=e.settings.lines[n];if(o.useOverlay||!("useOverlay"in o)){let i=e.settings.nLines-o.position-1;r.fillText(n,20,a.height*(i+.1)/e.settings.nLines),r.fillText(o.ymax,a.width-70,a.height*(i+.1)/e.settings.nLines),r.fillText(o.ymin,a.width-70,a.height*(i+.9)/e.settings.nLines)}}}return s&&requestAnimationFrame(e.anim),!0}updateLine(e,t,s,a,r,n,o){return e.numPoints!==t.length&&(s?e.numPoints>t.length?t=f.downsample(t,e.numPoints):e.numPoints<t.length&&(t=f.upsample(t,e.numPoints)):t.length>e.numPoints?t=t.slice(t.length-e.numPoints):t=[...new Array(t.length).fill(0),...t]),a&&(t=f.autoscale(t,r,n,o)),t.forEach((i,h)=>e.setY(h,i)),!0}static autoscale(e,t=0,s=1,a=!1,r,n){if(e?.length===0)return e;let o=n||Math.max(...e),i=r||Math.min(...e),h=1/s,l=1;if(a){let c=Math.max(Math.abs(i),Math.abs(o));return c!==0&&(l=h/c),e.map(g=>g*l+(h*(t+1)*2-1-h))}else return o===i?o!==0&&(l=h/o):l=h/(o-i),e.map(c=>2*((c-i)*l-1/(2*s))+(h*(t+1)*2-1-h))}static absmax(e){return Math.max(Math.abs(Math.min(...e)),Math.max(...e))}static downsample(e,t,s=1){if(e.length>t){let a=new Array(t),r=e.length/t,n=e.length-1,o=0,i=0;for(let h=r;h<e.length;h+=r){let l=Math.round(h);l>n&&(l=n);for(let c=o;c<l;c++)a[i]+=e[c];a[i]/=(l-o)*s,i++,o=l}return a}else return e}static upsample(e,t,s=1){var a=function(g,p,P){return(g+(p-g)*P)*s},r=new Array(t),n=(e.length-1)/(t-1);r[0]=e[0];for(var o=1;o<t-1;o++){var i=o*n,h=Math.floor(i),l=Math.ceil(i),c=i-h;r[o]=a(e[h],e[l],c)}return r[t-1]=e[e.length-1],r}static interpolate(e,t,s=1){return e.length>t?f.downsample(e,t,s):e.length<t?f.upsample(e,t,s):e}static HSLToRGB(e,t,s,a=255){t/=100,s/=100;let r=(1-Math.abs(2*s-1))*t,n=r*(1-Math.abs(e/60%2-1)),o=s-r/2,i=0,h=0,l=0;return 0<=e&&e<60?(i=r,h=n,l=0):60<=e&&e<120?(i=n,h=r,l=0):120<=e&&e<180?(i=0,h=r,l=n):180<=e&&e<240?(i=0,h=n,l=r):240<=e&&e<300?(i=n,h=0,l=r):300<=e&&e<360&&(i=r,h=0,l=n),i=(i+o)*a,h=(h+o)*a,l=(l+o)*a,[i,h,l]}static circularBuffer(e,t){return t.length<e.length?e.splice(0,e.length-t.length,...e.slice(t.length)).splice(t.length,e.length,...t):t.length>e.length?e.splice(0,e.length,t.slice(t.length-e.length)):e.splice(0,e.length,...t),e}static formatDataForCharts(e,t){if(Array.isArray(e)){if(Array.isArray(e[0])){let s={};if(e.forEach((a,r)=>{s[r]=a}),e=s,isNaN(e[0][0]))return}else if(t){if(e={[t]:e},isNaN(e[t][0]))return}else if(e={0:e},isNaN(e[0][0]))return}else if(typeof e=="object"){for(let s in e)if(typeof e[s]=="number"?e[s]=[e[s]]:e[s]?.values&&typeof e[s].values=="number"&&(e[s].values=[e[s].values]),isNaN(e[s][0]))return}else if(typeof e=="string"){let s;e.includes("	")?s=e.split("	"):e.includes(",")&&(s=e.split(",")),e={},s&&s.forEach((a,r)=>{if(a.includes(":")){let[n,o]=a.split(":"),i=parseFloat(o);if(i)e[n]=[i];else return}else{let n=parseFloat(a);if(n)e[r]=[n];else return}})}else typeof e=="number"&&(t?e={[t]:[e]}:e={0:[e]});return e}static padTime(e,t,s,a){let r=(e[0]-t)/s/a;return[...new Array(a-e.length).map((o,i)=>t+r*(i+1)),...e]}static interpolateForTime(e,t,s){return f.interpolate(e,Math.ceil(s*t))}};})();
