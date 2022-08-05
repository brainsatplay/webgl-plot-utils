var f=class{constructor(e,t,i,l){this.r=e,this.g=t,this.b=i,this.a=l}},d=class{constructor(){this.scaleX=1,this.scaleY=1,this.offsetX=0,this.offsetY=0,this.loop=!1,this._vbuffer=0,this._coord=0,this.visible=!0,this.intensity=1,this.xy=new Float32Array([]),this.numPoints=0,this.color=new f(0,0,0,1),this.webglNumPoints=0}},m=class extends d{constructor(e,t){super(),this.currentIndex=0,this.webglNumPoints=t,this.numPoints=t,this.color=e,this.xy=new Float32Array(2*this.webglNumPoints)}setX(e,t){this.xy[e*2]=t}setY(e,t){this.xy[e*2+1]=t}getX(e){return this.xy[e*2]}getY(e){return this.xy[e*2+1]}lineSpaceX(e,t){for(let i=0;i<this.numPoints;i++)this.setX(i,e+t*i)}arrangeX(){this.lineSpaceX(-1,2/this.numPoints)}constY(e){for(let t=0;t<this.numPoints;t++)this.setY(t,e)}shiftAdd(e){let t=e.length;for(let i=0;i<this.numPoints-t;i++)this.setY(i,this.getY(i+t));for(let i=0;i<t;i++)this.setY(i+this.numPoints-t,e[i])}addArrayY(e){if(this.currentIndex+e.length<=this.numPoints)for(let t=0;t<e.length;t++)this.setY(this.currentIndex,e[t]),this.currentIndex++}replaceArrayY(e){if(e.length==this.numPoints)for(let t=0;t<this.numPoints;t++)this.setY(t,e[t])}};var A=(h,e,t)=>{let i={x:0,y:0};return i.x=h.x+e.x*t,i.y=h.y+e.y*t,i},x=h=>L(-h.y,h.x),y=(h,e)=>{let t=T(h,e);return t=_(t),t},Y=(h,e)=>{let t={x:0,y:0};return t.x=h.x+e.x,t.y=h.y+e.y,t},R=(h,e)=>h.x*e.x+h.y*e.y,_=h=>{let e={x:0,y:0},t=h.x*h.x+h.y*h.y;return t>0&&(t=1/Math.sqrt(t),e.x=h.x*t,e.y=h.y*t),e},L=(h,e)=>{let t={x:0,y:0};return t.x=h,t.y=e,t},T=(h,e)=>{let t={x:0,y:0};return t.x=h.x-e.x,t.y=h.y-e.y,t},M=h=>{let e,t={x:0,y:0},i={x:0,y:0},l=[],r=(o,a)=>{l.push({vec2:o,miterLength:a})},n=o=>({x:h[o*2],y:h[o*2+1]});t=y(n(1),n(0)),e=x(t),r(e,1);let s=h.length/2;for(let o=1;o<s-1;o++){let a=n(o-1),u=n(o),g=n(o+1);t=y(u,a),e=x(t),i=y(g,u);let b=S(t,i),w=X(t,b,1);r(b,w)}return t=y(n(s-1),n(s-2)),e=x(t),r(e,1),l},S=(h,e)=>{let t=Y(h,e);return t=_(t),L(-t.y,t.x)},X=(h,e,t)=>{let i=L(-h.y,h.x);return t/R(e,i)},p=class extends d{constructor(e,t,i){super(),this.currentIndex=0,this._thicknessRequested=0,this._actualThickness=0,this.webglNumPoints=t*2,this.numPoints=t,this.color=e,this._thicknessRequested=i,this._linePoints=new Float32Array(t*2),this.xy=new Float32Array(2*this.webglNumPoints)}convertToTriPoints(){let e=this._actualThickness/2,t=M(this._linePoints);for(let i=0;i<this.numPoints;i++){let l=this._linePoints[2*i],r=this._linePoints[2*i+1],n={x:l,y:r},s=A(n,t[i].vec2,t[i].miterLength*e),o=A(n,t[i].vec2,-t[i].miterLength*e);this.xy[i*4]=s.x,this.xy[i*4+1]=s.y,this.xy[i*4+2]=o.x,this.xy[i*4+3]=o.y}}setX(e,t){this._linePoints[e*2]=t}setY(e,t){this._linePoints[e*2+1]=t}lineSpaceX(e,t){for(let i=0;i<this.numPoints;i++)this.setX(i,e+t*i)}setThickness(e){this._thicknessRequested=e}getThickness(){return this._thicknessRequested}setActualThickness(e){this._actualThickness=e}},v=class{constructor(e,t){this.debug=!1,this.addLine=this.addDataLine,t==null?this.webgl=e.getContext("webgl",{antialias:!0,transparent:!1}):(this.webgl=e.getContext("webgl",{antialias:t.antialias,transparent:t.transparent,desynchronized:t.deSync,powerPerformance:t.powerPerformance,preserveDrawing:t.preserveDrawing}),this.debug=t.debug==null?!1:t.debug),this.log("canvas type is: "+e.constructor.name),this.log(`[webgl-plot]:width=${e.width}, height=${e.height}`),this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[],this.gScaleX=1,this.gScaleY=1,this.gXYratio=1,this.gOffsetX=0,this.gOffsetY=0,this.gLog10X=!1,this.gLog10Y=!1,this.webgl.clear(this.webgl.COLOR_BUFFER_BIT),this.webgl.viewport(0,0,e.width,e.height),this._progLine=this.webgl.createProgram(),this.initThinLineProgram(),this.webgl.enable(this.webgl.BLEND),this.webgl.blendFunc(this.webgl.SRC_ALPHA,this.webgl.ONE_MINUS_SRC_ALPHA)}get linesData(){return this._linesData}get linesAux(){return this._linesAux}get thickLines(){return this._thickLines}get surfaces(){return this._surfaces}_drawLines(e){let t=this.webgl;e.forEach(i=>{if(i.visible){t.useProgram(this._progLine);let l=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(l,!1,new Float32Array([i.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,i.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let r=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(r,new Float32Array([i.offsetX+this.gOffsetX,i.offsetY+this.gOffsetY]));let n=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(n,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let s=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(s,[i.color.r,i.color.g,i.color.b,i.color.a]),t.bufferData(t.ARRAY_BUFFER,i.xy,t.STREAM_DRAW),t.drawArrays(i.loop?t.LINE_LOOP:t.LINE_STRIP,0,i.webglNumPoints)}})}_drawSurfaces(e){let t=this.webgl;e.forEach(i=>{if(i.visible){t.useProgram(this._progLine);let l=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(l,!1,new Float32Array([i.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,i.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let r=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(r,new Float32Array([i.offsetX+this.gOffsetX,i.offsetY+this.gOffsetY]));let n=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(n,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let s=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(s,[i.color.r,i.color.g,i.color.b,i.color.a]),t.bufferData(t.ARRAY_BUFFER,i.xy,t.STREAM_DRAW),t.drawArrays(t.TRIANGLE_STRIP,0,i.webglNumPoints)}})}_drawTriangles(e){let t=this.webgl;t.bufferData(t.ARRAY_BUFFER,e.xy,t.STREAM_DRAW),t.useProgram(this._progLine);let i=t.getUniformLocation(this._progLine,"uscale");t.uniformMatrix2fv(i,!1,new Float32Array([e.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,e.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let l=t.getUniformLocation(this._progLine,"uoffset");t.uniform2fv(l,new Float32Array([e.offsetX+this.gOffsetX,e.offsetY+this.gOffsetY]));let r=t.getUniformLocation(this._progLine,"is_log");t.uniform2iv(r,new Int32Array([0,0]));let n=t.getUniformLocation(this._progLine,"uColor");t.uniform4fv(n,[e.color.r,e.color.g,e.color.b,e.color.a]),t.drawArrays(t.TRIANGLE_STRIP,0,e.xy.length/2)}_drawThickLines(){this._thickLines.forEach(e=>{if(e.visible){let t=Math.min(this.gScaleX,this.gScaleY);e.setActualThickness(e.getThickness()/t),e.convertToTriPoints(),this._drawTriangles(e)}})}update(){this.clear(),this.draw()}draw(){this._drawLines(this.linesData),this._drawLines(this.linesAux),this._drawThickLines(),this._drawSurfaces(this.surfaces)}clear(){this.webgl.clear(this.webgl.COLOR_BUFFER_BIT)}_addLine(e){e._vbuffer=this.webgl.createBuffer(),this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER,e._vbuffer),this.webgl.bufferData(this.webgl.ARRAY_BUFFER,e.xy,this.webgl.STREAM_DRAW),e._coord=this.webgl.getAttribLocation(this._progLine,"coordinates"),this.webgl.vertexAttribPointer(e._coord,2,this.webgl.FLOAT,!1,0,0),this.webgl.enableVertexAttribArray(e._coord)}addDataLine(e){this._addLine(e),this.linesData.push(e)}addAuxLine(e){this._addLine(e),this.linesAux.push(e)}addThickLine(e){this._addLine(e),this._thickLines.push(e)}addSurface(e){this._addLine(e),this.surfaces.push(e)}initThinLineProgram(){let e=`
      attribute vec2 coordinates;
      uniform mat2 uscale;
      uniform vec2 uoffset;
      uniform ivec2 is_log;

      void main(void) {
         float x = (is_log[0]==1) ? log(coordinates.x) : coordinates.x;
         float y = (is_log[1]==1) ? log(coordinates.y) : coordinates.y;
         vec2 line = vec2(x, y);
         gl_Position = vec4(uscale*line + uoffset, 0.0, 1.0);
      }`,t=this.webgl.createShader(this.webgl.VERTEX_SHADER);this.webgl.shaderSource(t,e),this.webgl.compileShader(t);let i=`
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`,l=this.webgl.createShader(this.webgl.FRAGMENT_SHADER);this.webgl.shaderSource(l,i),this.webgl.compileShader(l),this._progLine=this.webgl.createProgram(),this.webgl.attachShader(this._progLine,t),this.webgl.attachShader(this._progLine,l),this.webgl.linkProgram(this._progLine)}popDataLine(){this.linesData.pop()}removeAllLines(){this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[]}removeDataLines(){this._linesData=[]}removeAuxLines(){this._linesAux=[]}viewport(e,t,i,l){this.webgl.viewport(e,t,i,l)}log(e){this.debug&&console.log("[webgl-plot]:"+e)}};var c=class{constructor(){this.plots={}}initPlot(e,t){t||(t=new v(e.canvas,e.webglOptions)),e._id||(e._id=`plot${Math.floor(Math.random()*1e15)}`);let i={plot:t,settings:e};this.plots[e._id]=i,e.overlay&&(typeof e.overlay!="object"&&(e.overlay=document.createElement("canvas"),e.overlay.style.position="absolute",e.overlay.width=e.canvas.width,e.overlay.height=e.canvas.height,e.canvas.appendChild(e.overlay)),e.overlayCtx=e.overlay.getContext("2d")),e.width&&(e.canvas.width=e.width,e.canvas.style&&(e.canvas.style.width=e.width+"px"),typeof e.overlay=="object"&&(e.overlay.width=e.width,e.overlay.style&&(e.overlay.style.width=e.width+"px"))),e.height&&(e.canvas.height=e.height,e.canvas.style&&(e.canvas.style.height=e.height+"px"),typeof e.overlay=="object"&&(e.overlay.height=e.height,e.overlay.style&&(e.overlay.style.height=e.height+"px")));let l=0,r=Object.keys(e.lines).length;e.nLines=r;for(let n in e.lines){let s=e.lines[n];if(Array.isArray(s)&&(s={values:s},e.lines[n]=s),s.color)Array.isArray(s.color)&&(s.color=new f(...s.color));else{let a=c.HSLToRGB(360*(l/r)%360,100,50,1);s.color=new f(...a,1)}let o;if(s.nPoints?o=s.nPoints:s.nSec&&s.sps?o=Math.ceil(s.nSec*s.sps):s.values&&(o=s.values.length),!o)return;if(s.points=o,s.width?s.line=new p(s.color,o,s.width):s.line=new m(s.color,o),s.line.arrangeX(),s.values){if(e.overlay){let a=Math.max(...s.values),u=Math.min(...s.values);s.ymin=u,s.ymax=a}s.values.length!==o&&(s.interpolate?s.values.length>o?s.values=c.downsample(s.values,o):s.values.length<o&&(s.values=c.upsample(s.values,o)):s.values.length>s.points?s.values=s.values.slice(s.values.length-s.points):s.values=[...new Array(s.points-s.values.length).fill(0),...s.values])}else s.values=new Array(o).fill(0);if("autoscale"in s||(s.autoscale=!0),s.position||(s.position=e.nLines-l-1),s.autoscale&&(s.values=c.autoscale(s.values,s.position?s.position:l,r,s.centerZero)),s.values.forEach((a,u)=>s.line.setY(u,a)),t.addDataLine(s.line),"xAxis"in s||(s.xAxis=!0),s.xAxis){s.xColor?Array.isArray(s.xColor)&&(s.xColor=new f(...s.xColor)):s.xColor=new f(1,1,1,.3);let a=new m(s.xColor,2),u=(l+1)*2/r-1-1/r;s.autoscale?a.constY(u):a.constY(.5),a.arrangeX(),a.xy[2]=1,s.x=a,t.addAuxLine(a)}if(r>1&&s.autoscale&&l!==r-1){e.dividerColor?Array.isArray(e.dividerColor)&&(e.dividerColor=new f(...e.dividerColor)):e.dividerColor=new f(1,1,1,1);let a=new m(e.dividerColor,2);a.constY((l+1)*2/r-1),a.arrangeX(),a.xy[2]=1,s.divider=a,t.addAuxLine(a)}l++}if(typeof e.overlay=="object"){let n=e.overlay,s=e.overlayCtx;s.clearRect(0,0,e.overlay.width,e.overlay.height),s.font="1em Courier",s.fillStyle="white";for(let o in e.lines){let a=e.lines[o];if(a.useOverlay||!("useOverlay"in a)){let u=e.nLines-a.position-1;s.fillText(o,20,n.height*(u+.1)/e.nLines),s.fillText(a.ymax,n.width-70,n.height*(u+.1)/e.nLines),s.fillText(a.ymin,n.width-70,n.height*(u+.9)/e.nLines)}}}return t.update(),this.plots[e._id]}deinitPlot(e){return typeof e=="string"&&(e=this.plots[e]),e.plot.clear(),e.plot.removeAllLines(),!0}reinitPlot(e,t){if(typeof e=="string"&&(e=this.plots[e]),!!e.plot)return e.plot.clear(),e.plot.removeAllLines(),this.initPlot(t,e.plot)}update(e,t,i=!0){if(typeof e=="string"&&(e=this.plots[e]),!e)return!1;if(t){let l=!1;for(let r in t)if(e.settings.lines[r]){let n=e.settings.lines[r],s=n.values;if(Array.isArray(t[r])?n.values=t[r]:Object.assign(n,t[r]),n.values){if(e.settings.overlay){let o=Math.max(...n.values),a=Math.min(...n.values);n.ymin=a,n.ymax=o}n.autoscale&&(n.values=c.autoscale(n.values,n.position,e.settings.nLines,n.centerZero)),n.values.length!==n.points&&(n.interpolate?n.values.length>n.points?n.values=c.downsample(n.values,n.points):n.values.length<n.points&&(n.values=c.upsample(n.values,n.points)):n.values.length>n.points?n.values=n.values.slice(n.values.length-n.points):n.values=[...s.slice(n.values.length),...n.values]),n.values.forEach((o,a)=>n.line.setY(a,o))}}else e.settings.generateNewLines&&(Array.isArray(t[r])&&(t[r]={values:t[r]}),!t[r].nSec&&!t[r].nPoints&&(t[r].nPoints=1e3),e.settings.lines[r]=t[r],l=!0);if(l){if(e.settings.cleanGeneration){let r=Object.assign({},e.settings.lines);for(let n in e.settings.lines)t[n]||delete r[n];e.settings.lines=r}return this.reinitPlot(e,e.settings),!0}}if(typeof e.settings.overlay=="object"){let l=e.settings.overlay,r=e.settings.overlayCtx;r.clearRect(0,0,e.settings.overlay.width,e.settings.overlay.height),r.font="1em Courier",r.fillStyle="white";for(let n in e.settings.lines){let s=e.settings.lines[n];if(s.useOverlay||!("useOverlay"in s)){let o=e.settings.nLines-s.position-1;r.fillText(n,20,l.height*(o+.1)/e.settings.nLines),r.fillText(s.ymax,l.width-70,l.height*(o+.1)/e.settings.nLines),r.fillText(s.ymin,l.width-70,l.height*(o+.9)/e.settings.nLines)}}}return i&&e.plot.update(),!0}updateLine(e,t,i,l,r,n,s){return e.numPoints!==t.length&&(i?e.numPoints>t.length?t=c.downsample(t,e.numPoints):e.numPoints<t.length&&(t=c.upsample(t,e.numPoints)):t.length>e.numPoints?t=t.slice(t.length-e.numPoints):t=[...new Array(t.length).fill(0),...t]),l&&(t=c.autoscale(t,r,n,s)),t.forEach((o,a)=>e.setY(a,o)),!0}static autoscale(e,t=0,i=1,l=!1){if(e?.length===0)return e;let r=Math.max(...e),n=Math.min(...e),s=1/i,o=1;if(l){let a=Math.max(Math.abs(n),Math.abs(r));return a!==0&&(o=s/a),e.map(u=>u*o+(s*(t+1)*2-1-s))}else return r===n?r!==0&&(o=s/r):o=s/(r-n),e.map(a=>2*((a-n)*o-1/(2*i))+(s*(t+1)*2-1-s))}static absmax(e){return Math.max(Math.abs(Math.min(...e)),Math.max(...e))}static downsample(e,t,i=1){if(e.length>t){let l=new Array(t),r=e.length/t,n=e.length-1,s=0,o=0;for(let a=r;a<e.length;a+=r){let u=Math.round(a);u>n&&(u=n);for(let g=s;g<u;g++)l[o]+=e[g];l[o]/=(u-s)*i,o++,s=u}return l}else return e}static upsample(e,t,i=1){var l=function(b,w,P){return(b+(w-b)*P)*i},r=new Array(t),n=(e.length-1)/(t-1);r[0]=e[0];for(var s=1;s<t-1;s++){var o=s*n,a=Math.floor(o),u=Math.ceil(o),g=o-a;r[s]=l(e[a],e[u],g)}return r[t-1]=e[e.length-1],r}static interpolate(e,t,i=1){return e.length>t?c.downsample(e,t,i):e.length<t?c.upsample(e,t,i):e}static HSLToRGB(e,t,i,l=255){t/=100,i/=100;let r=(1-Math.abs(2*i-1))*t,n=r*(1-Math.abs(e/60%2-1)),s=i-r/2,o=0,a=0,u=0;return 0<=e&&e<60?(o=r,a=n,u=0):60<=e&&e<120?(o=n,a=r,u=0):120<=e&&e<180?(o=0,a=r,u=n):180<=e&&e<240?(o=0,a=n,u=r):240<=e&&e<300?(o=n,a=0,u=r):300<=e&&e<360&&(o=r,a=0,u=n),o=(o+s)*l,a=(a+s)*l,u=(u+s)*l,[o,a,u]}static circularBuffer(e,t){return t.length<e.length?e.splice(0,e.length-t.length,...e.slice(t.length)).splice(t.length,e.length,...t):t.length>e.length?e.splice(0,e.length,t.slice(t.length-e.length)):e.splice(0,e.length,...t),e}static formatDataForCharts(e,t){if(Array.isArray(e)){if(Array.isArray(e[0])){let i={};if(e.forEach((l,r)=>{i[r]=l}),e=i,isNaN(e[0][0]))return}else if(t){if(e={[t]:e},isNaN(e[t][0]))return}else if(e={0:e},isNaN(e[0][0]))return}else if(typeof e=="object"){for(let i in e)if(typeof e[i]=="number"?e[i]=[e[i]]:e[i]?.values&&typeof e[i].values=="number"&&(e[i].values=[e[i].values]),isNaN(e[i][0]))return}else if(typeof e=="string"){let i;e.includes("	")?i=e.split("	"):e.includes(",")&&(i=e.split(",")),e={},i.forEach((l,r)=>{if(l.includes(":")){let[n,s]=l.split(":");e[n]=[parseFloat(s)]}else e[r]=[parseFloat(l)];isNaN(e[r])})}else typeof e=="number"&&(t?e={[t]:[e]}:e={0:[e]});return e}static padTime(e,t,i,l){let r=(e[0]-t)/i/l;return[...new Array(l-e.length).map((s,o)=>t+r*(o+1)),...e]}static interpolateForTime(e,t,i){return c.interpolate(e,Math.ceil(i*t))}};export{c as WebglLinePlotUtil};
