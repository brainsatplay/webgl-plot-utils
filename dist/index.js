(()=>{var F=Object.defineProperty;var T=(u,t,s)=>t in u?F(u,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):u[t]=s;var Y=(u,t,s)=>(T(u,typeof t!="symbol"?t+"":t,s),s);var w=class{constructor(t,s,e,o){this.r=t,this.g=s,this.b=e,this.a=o}},L=class{constructor(){this.scaleX=1,this.scaleY=1,this.offsetX=0,this.offsetY=0,this.loop=!1,this._vbuffer=0,this._coord=0,this.visible=!0,this.intensity=1,this.xy=new Float32Array([]),this.numPoints=0,this.color=new w(0,0,0,1),this.webglNumPoints=0}},x=class extends L{constructor(t,s){super(),this.currentIndex=0,this.webglNumPoints=s,this.numPoints=s,this.color=t,this.xy=new Float32Array(2*this.webglNumPoints)}setX(t,s){this.xy[t*2]=s}setY(t,s){this.xy[t*2+1]=s}getX(t){return this.xy[t*2]}getY(t){return this.xy[t*2+1]}lineSpaceX(t,s){for(let e=0;e<this.numPoints;e++)this.setX(e,t+s*e)}arrangeX(){this.lineSpaceX(-1,2/this.numPoints)}constY(t){for(let s=0;s<this.numPoints;s++)this.setY(s,t)}shiftAdd(t){let s=t.length;for(let e=0;e<this.numPoints-s;e++)this.setY(e,this.getY(e+s));for(let e=0;e<s;e++)this.setY(e+this.numPoints-s,t[e])}addArrayY(t){if(this.currentIndex+t.length<=this.numPoints)for(let s=0;s<t.length;s++)this.setY(this.currentIndex,t[s]),this.currentIndex++}replaceArrayY(t){if(t.length==this.numPoints)for(let s=0;s<this.numPoints;s++)this.setY(s,t[s])}};var v=class{constructor(t,s){this.debug=!1,this.addLine=this.addDataLine,s==null?this.webgl=t.getContext("webgl",{antialias:!0,transparent:!1}):(this.webgl=t.getContext("webgl",{antialias:s.antialias,transparent:s.transparent,desynchronized:s.deSync,powerPerformance:s.powerPerformance,preserveDrawing:s.preserveDrawing}),this.debug=s.debug==null?!1:s.debug),this.log("canvas type is: "+t.constructor.name),this.log(`[webgl-plot]:width=${t.width}, height=${t.height}`),this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[],this.gScaleX=1,this.gScaleY=1,this.gXYratio=1,this.gOffsetX=0,this.gOffsetY=0,this.gLog10X=!1,this.gLog10Y=!1,this.webgl.clear(this.webgl.COLOR_BUFFER_BIT),this.webgl.viewport(0,0,t.width,t.height),this._progLine=this.webgl.createProgram(),this.initThinLineProgram(),this.webgl.enable(this.webgl.BLEND),this.webgl.blendFunc(this.webgl.SRC_ALPHA,this.webgl.ONE_MINUS_SRC_ALPHA)}get linesData(){return this._linesData}get linesAux(){return this._linesAux}get thickLines(){return this._thickLines}get surfaces(){return this._surfaces}_drawLines(t){let s=this.webgl;t.forEach(e=>{if(e.visible){s.useProgram(this._progLine);let o=s.getUniformLocation(this._progLine,"uscale");s.uniformMatrix2fv(o,!1,new Float32Array([e.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,e.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let n=s.getUniformLocation(this._progLine,"uoffset");s.uniform2fv(n,new Float32Array([e.offsetX+this.gOffsetX,e.offsetY+this.gOffsetY]));let r=s.getUniformLocation(this._progLine,"is_log");s.uniform2iv(r,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let h=s.getUniformLocation(this._progLine,"uColor");s.uniform4fv(h,[e.color.r,e.color.g,e.color.b,e.color.a]),s.bufferData(s.ARRAY_BUFFER,e.xy,s.STREAM_DRAW),s.drawArrays(e.loop?s.LINE_LOOP:s.LINE_STRIP,0,e.webglNumPoints)}})}_drawSurfaces(t){let s=this.webgl;t.forEach(e=>{if(e.visible){s.useProgram(this._progLine);let o=s.getUniformLocation(this._progLine,"uscale");s.uniformMatrix2fv(o,!1,new Float32Array([e.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,e.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let n=s.getUniformLocation(this._progLine,"uoffset");s.uniform2fv(n,new Float32Array([e.offsetX+this.gOffsetX,e.offsetY+this.gOffsetY]));let r=s.getUniformLocation(this._progLine,"is_log");s.uniform2iv(r,new Int32Array([this.gLog10X?1:0,this.gLog10Y?1:0]));let h=s.getUniformLocation(this._progLine,"uColor");s.uniform4fv(h,[e.color.r,e.color.g,e.color.b,e.color.a]),s.bufferData(s.ARRAY_BUFFER,e.xy,s.STREAM_DRAW),s.drawArrays(s.TRIANGLE_STRIP,0,e.webglNumPoints)}})}_drawTriangles(t){let s=this.webgl;s.bufferData(s.ARRAY_BUFFER,t.xy,s.STREAM_DRAW),s.useProgram(this._progLine);let e=s.getUniformLocation(this._progLine,"uscale");s.uniformMatrix2fv(e,!1,new Float32Array([t.scaleX*this.gScaleX*(this.gLog10X?1/Math.log(10):1),0,0,t.scaleY*this.gScaleY*this.gXYratio*(this.gLog10Y?1/Math.log(10):1)]));let o=s.getUniformLocation(this._progLine,"uoffset");s.uniform2fv(o,new Float32Array([t.offsetX+this.gOffsetX,t.offsetY+this.gOffsetY]));let n=s.getUniformLocation(this._progLine,"is_log");s.uniform2iv(n,new Int32Array([0,0]));let r=s.getUniformLocation(this._progLine,"uColor");s.uniform4fv(r,[t.color.r,t.color.g,t.color.b,t.color.a]),s.drawArrays(s.TRIANGLE_STRIP,0,t.xy.length/2)}_drawThickLines(){this._thickLines.forEach(t=>{if(t.visible){let s=Math.min(this.gScaleX,this.gScaleY);t.setActualThickness(t.getThickness()/s),t.convertToTriPoints(),this._drawTriangles(t)}})}update(){this.clear(),this.draw()}draw(){this._drawLines(this.linesData),this._drawLines(this.linesAux),this._drawThickLines(),this._drawSurfaces(this.surfaces)}clear(){this.webgl.clear(this.webgl.COLOR_BUFFER_BIT)}_addLine(t){t._vbuffer=this.webgl.createBuffer(),this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER,t._vbuffer),this.webgl.bufferData(this.webgl.ARRAY_BUFFER,t.xy,this.webgl.STREAM_DRAW),t._coord=this.webgl.getAttribLocation(this._progLine,"coordinates"),this.webgl.vertexAttribPointer(t._coord,2,this.webgl.FLOAT,!1,0,0),this.webgl.enableVertexAttribArray(t._coord)}addDataLine(t){this._addLine(t),this.linesData.push(t)}addAuxLine(t){this._addLine(t),this.linesAux.push(t)}addThickLine(t){this._addLine(t),this._thickLines.push(t)}addSurface(t){this._addLine(t),this.surfaces.push(t)}initThinLineProgram(){let t=`
      attribute vec2 coordinates;
      uniform mat2 uscale;
      uniform vec2 uoffset;
      uniform ivec2 is_log;

      void main(void) {
         float x = (is_log[0]==1) ? log(coordinates.x) : coordinates.x;
         float y = (is_log[1]==1) ? log(coordinates.y) : coordinates.y;
         vec2 line = vec2(x, y);
         gl_Position = vec4(uscale*line + uoffset, 0.0, 1.0);
      }`,s=this.webgl.createShader(this.webgl.VERTEX_SHADER);this.webgl.shaderSource(s,t),this.webgl.compileShader(s);let e=`
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`,o=this.webgl.createShader(this.webgl.FRAGMENT_SHADER);this.webgl.shaderSource(o,e),this.webgl.compileShader(o),this._progLine=this.webgl.createProgram(),this.webgl.attachShader(this._progLine,s),this.webgl.attachShader(this._progLine,o),this.webgl.linkProgram(this._progLine)}popDataLine(){this.linesData.pop()}removeAllLines(){this._linesData=[],this._linesAux=[],this._thickLines=[],this._surfaces=[]}removeDataLines(){this._linesData=[]}removeAuxLines(){this._linesAux=[]}viewport(t,s,e,o){this.webgl.viewport(t,s,e,o)}log(t){this.debug&&console.log("[webgl-plot]:"+t)}};var d=class{constructor(t,s=!0){Y(this,"updateAllLines",(t=[],s=[],e=!0,o=!1)=>{let n=!0,r=[...s];t.forEach((h,i)=>{h.length!==this.linesY[i]?.length?(h.length>this.linesY[i]?.length?this.linesY[i]=d.downsample(h,this.linesY[i].length):this.linesY[i]=d.upsample(h,this.linesY[i]),r[i]=Math.ceil(h.length/this.nSecGraph),e&&(this.linesY[i]=this.autoscale(h,i,this.nLines,o)),n=!1):e?this.linesY[i]=this.autoscale(h,i,this.nLines,o):this.linesY[i]=h}),n||(this.deinitPlot(),this.initPlot(t.length,r)),this.useOverlay&&(this.overlayctx.clearRect(0,0,this.overlay.width,this.overlay.height),this.overlayctx.font="1em Courier",this.overlayctx.fillStyle="white"),this.linesY.forEach((h,i)=>{if(h?.length>0){for(let l=0;l<h.length;l++)this.lines[i].setY(l,h[l]);this.useOverlay&&(this.overlayctx.fillText(this.lineSettings[i].ymax.toFixed(2),this.overlay.width-70,this.overlay.height*(i+.1)/this.lines.length),this.overlayctx.fillText(this.lineSettings[i].ymin.toFixed(2),this.overlay.width-70,this.overlay.height*(i+.9)/this.lines.length))}})});Y(this,"updateLine",(t=[],s=500,e=0,o=!0,n=!1)=>{t.length!==s*this.nSecGraph&&(s=t.length/this.nSecGraph,this.linesSPS[e]=s,this.deinitPlot(),this.initPlot(this.lines.length,this.linesSPS)),t.length!==this.linesY[e].length?(t.length>this.linesY[e].length?this.linesY[e]=d.downsample(t,this.linesY[e].length):this.linesY[e]=d.upsample(t,this.linesY[e]),o&&(this.linesY[e]=this.autoscale(t,e,this.nLines,n))):o?this.linesY[e]=this.autoscale(t,e,this.nLines,n):this.linesY[e]=t;for(let r=0;r<this.linesY[e].length;r++)this.lines[e].setY(r,this.linesY[e][r]);this.useOverlay&&(this.overlayctx.clearRect(0,this.overlay.height*e/this.lines.length,this.overlay.width,this.overlay.height*(e+1)/this.lines.length),this.overlayctx.fillText(this.lineSettings[e].ymax.toFixed(2),this.overlay.width-70,this.overlay.height*(e+.1)/this.lines.length),this.overlayctx.fillText(this.lineSettings[e].ymin.toFixed(2),this.overlay.width-70,this.overlay.height*(e+.9)/this.lines.length))});if(!t)throw new Error("Supply a canvas to the webgl plot!");this.canvas=t,this.useOverlay=s,this.overlay,this.overlayctx,this.plot=new v(t),this.useOverlay&&(this.overlay=document.createElement("canvas"),this.overlay.style=this.canvas.style,this.overlay.width=this.canvas.width,this.overlay.height=this.canvas.height,this.overlay.style.position="absolute",this.overlay.style.zIndex=this.canvas.style.zIndex+1,this.overlayctx=this.overlay.getContext("2d"),this.canvas.parentNode.insertAdjacentElement("afterbegin",this.overlay)),this.lines=[],this.linesY=[],this.linesSPS=[],this.axes=[],this.dividers=[],this.colors=[],this.lineSettings=[],this.axisscalar=1,this.nLines=0,this.nSecGraph=10,this.nMaxPointsPerSec=512,this.animationSpeed=6.9}autoscale(t,s=0,e=1,o=!1){if(t?.length===0||!this.lineSettings[s])return t;let n=Math.max(...t),r=Math.min(...t);this.lineSettings[s].ymax=n,this.lineSettings[s].ymin=r;let h=1/e,i;if(o){let l=Math.max(Math.abs(r),Math.abs(n));return i=h/l,t.map(a=>a*i+(h*(s+1)*2-1-h))}else return i=h/(n-r),t.map(l=>2*((l-r)*i-1/(2*e))+(h*(s+1)*2-1-h))}static absmax(t){return Math.max(Math.abs(Math.min(...t)),Math.max(...t))}static downsample(t,s,e=1){if(t.length>s){let o=new Array(s),n=t.length/s,r=t.length-1,h=0,i=0;for(let l=n;l<t.length;l+=n){let a=Math.round(l);a>r&&(a=r);for(let c=h;c<a;c++)o[i]+=t[c];o[i]/=(a-h)*e,i++,h=a}return o}else return t}static upsample(t,s,e=1){var o=function(f,m,g){return(f+(m-f)*g)*e},n=new Array(s),r=new Number((t.length-1)/(s-1));n[0]=t[0];for(var h=1;h<s-1;h++){var i=h*r,l=new Number(Math.floor(i)).toFixed(),a=new Number(Math.ceil(i)).toFixed(),c=i-l;n[h]=o(t[l],t[a],c)}return n[s-1]=t[t.length-1],n}deinitPlot(){this.plot?.clear(),this.plot?.removeAllLines()}HSLToRGB(t,s,e){s/=100,e/=100;let o=(1-Math.abs(2*e-1))*s,n=o*(1-Math.abs(t/60%2-1)),r=e-o/2,h=0,i=0,l=0;return 0<=t&&t<60?(h=o,i=n,l=0):60<=t&&t<120?(h=n,i=o,l=0):120<=t&&t<180?(h=0,i=o,l=n):180<=t&&t<240?(h=0,i=n,l=o):240<=t&&t<300?(h=n,i=0,l=o):300<=t&&t<360&&(h=o,i=0,l=n),h=Math.round((h+r)*255),i=Math.round((i+r)*255),l=Math.round((l+r)*255),[h,i,l]}initPlot(t=1,s=[],e=this.nSecGraph,o=this.nMaxPointsPerSec){this.nSecGraph=e,this.nMaxPointsPerSec=o;let n=new w(1,1,1,.3),r=new w(1,1,1,1),h=1/t;this.nLines=t,this.lines=[],this.linesSPS=s;for(let i=0;i<t;i++){let l=this.HSLToRGB(360*(i/t)%360,100,50),a=new w(l[0],l[1],l[2],1);this.colors.push(a);let c=10;s[i]>o?c=e*o:c=s[i]*e;let f=new x(a,c);f.arrangeX(),this.lines.push(f),this.linesY.length<this.lines.length&&this.linesY.push(new Array(c)),this.plot.addDataLine(f);let m=h*(i+1)*2-1-h,g=new x(n,2);if(g.constY(m),g.arrangeX(),g.xy[2]=1,this.plot.addAuxLine(g),this.axes.push(g),i!==t-1){let p=h*(i+1)*2-1,y=new x(r,2);y.constY(p),y.arrangeX(),y.xy[2]=1,this.plot.addAuxLine(y),this.dividers.push(y)}this.lineSettings[i]={color:a,sps:s[i],ymin:-1,ymax:1}}return this.linesY.length>this.lines.length&&this.linesY.splice(this.lines.length),!0}update(){this.plot.update()}animate(){this.update(),setTimeout(()=>{requestAnimationFrame(this.animate)},this.animationSpeed)}static test(t){let s=document.getElementById(t),e=window.devicePixelRatio||1;s.width=s.clientWidth*e,s.height=s.clientHeight*e;let o=512,n=256,r=3,h=512,i=1,l=.5,a=.5,c=new Array(o*r),f=new Array(n*r),m=new d(s);m.initPlot(2,[o,n],r,h);function g(y=[],A=512,_=10){let S=A*_,R=_/S,P=0;for(let b=0;b<A*_;b++){let M=Math.sin(Math.PI*P*i*Math.PI*2+performance.now()*.001),X=Math.random()-.5;y[b]=M*l+X*a,P+=R}}let p=()=>{g(c,o,r),g(f,n,r),m.updateAllLines([c,f],[o,n],!0),m.update(),requestAnimationFrame(p)};requestAnimationFrame(p)}};})();
