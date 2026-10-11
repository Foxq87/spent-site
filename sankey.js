(function(){
var el=document.getElementById('sankey');if(!el)return;
var C=window.SPENT_FLOW,G=C.groups;
function fmt(m){var h=Math.floor(m/60),r=m%60;return h?(r?h+C.h+' '+(r<10?'0':'')+r+C.m:h+C.h):r+C.m}
G.forEach(function(g){g.m=g.a.reduce(function(t,x){return t+x.m},0)});
var T=G.reduce(function(t,g){return t+g.m},0);
function ns(t){return document.createElementNS('http://www.w3.org/2000/svg',t)}
function draw(){
 var mob=el.clientWidth<520;
 var W=mob?360:680,H=mob?440:500,k=mob?0.105:0.125,xl=0,xm=mob?112:230,xr=mob?236:470,bw=mob?10:14,fs=mob?12:14,gg=mob?44:52,ag=6,top=44;
 var svg=ns('svg');svg.setAttribute('viewBox','0 0 '+W+' '+H);
 var defs=ns('defs');svg.appendChild(defs);
 var gid=0;
 function grad(c1,c2,x1,x2){var id='g'+(gid++),l=ns('linearGradient');l.setAttribute('id',id);l.setAttribute('gradientUnits','userSpaceOnUse');l.setAttribute('x1',x1);l.setAttribute('x2',x2);l.setAttribute('y1',0);l.setAttribute('y2',0);
  [[c1,0],[c2,1]].forEach(function(p){var s=ns('stop');s.setAttribute('offset',p[1]);s.setAttribute('stop-color',p[0]);s.setAttribute('stop-opacity',.42);l.appendChild(s)});defs.appendChild(l);return 'url(#'+id+')'}
 function link(x1,y1a,y1b,x2,y2a,y2b,fill,i){var p=ns('path'),mx=(x1+x2)/2;
  p.setAttribute('d','M'+x1+','+y1a+'C'+mx+','+y1a+' '+mx+','+y2a+' '+x2+','+y2a+'L'+x2+','+y2b+'C'+mx+','+y2b+' '+mx+','+y1b+' '+x1+','+y1b+'Z');
  p.setAttribute('fill',fill);p.setAttribute('class','lnk');p.style.animationDelay=(i*90)+'ms';svg.appendChild(p)}
 function bar(x,y,h,c,r){var b=ns('rect');b.setAttribute('x',x);b.setAttribute('y',y);b.setAttribute('width',bw);b.setAttribute('height',Math.max(h,2));b.setAttribute('rx',4);b.setAttribute('fill',c);svg.appendChild(b)}
 function txt(x,y,s,fill,size,wt,anchor){var t=ns('text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('fill',fill);t.setAttribute('font-size',size);t.setAttribute('font-weight',wt||400);if(anchor)t.setAttribute('text-anchor',anchor);t.textContent=s;svg.appendChild(t)}
 var midH=T*k+gg*(G.length-1),leftH=T*k,y0=top,ly=y0+(midH-leftH)/2;
 var gy=y0,ly2=ly,ay=y0-1000,i=0,prevEnd=-1e9;
 G.forEach(function(g){
  var h=g.m*k,sh=h;
  link(xl+bw,ly2,ly2+h,xm,gy,gy+h,grad('#8e8e93',g.c,xl+bw,xm),i++);
  var cy=gy,cyEnd;
  var start=Math.max(gy,prevEnd+gg*0.7);
  var cur=start,ac=g.a.length;
  var src=gy;
  g.a.forEach(function(a){
   var ah=a.m*k;
   link(xm+bw,src,src+ah,xr,cur,cur+ah,grad(g.c,a.c,xm+bw,xr),i++);
   bar(xr,cur,ah,a.c);
   var cx=xr+bw+10,mid=cur+ah/2;
   if(ah>=fs*2.3){txt(cx,mid-1,a.n,'#f5f5f7',fs+1,600);txt(cx,mid+fs,fmt(a.m),'#9a9aa0',fs-1)}
   else{txt(cx,mid+4,a.n+'  '+fmt(a.m),'#f5f5f7',fs,600)}
   cur+=ah+ag;src+=ah;
  });
  prevEnd=cur-ag;
  bar(xm,gy,h,g.c);
  txt(xm,gy-22,g.n.toUpperCase(),g.c,fs-3,700);txt(xm,gy-6,fmt(g.m),'#f5f5f7',fs+1,700);
  ly2+=h;gy+=h+gg;
 });
 bar(xl,ly,leftH,'#e5e5ea');
 txt(xl,ly-22,C.total,'#9a9aa0',fs-3,700);txt(xl,ly-6,fmt(T),'#f5f5f7',fs+1,700);
 var maxY=Math.max(prevEnd+8,y0+midH);svg.setAttribute('viewBox','0 0 '+W+' '+Math.ceil(maxY+6));
 el.replaceChildren(svg);
}
draw();var last=el.clientWidth<520;
window.addEventListener('resize',function(){var m=el.clientWidth<520;if(m!==last){last=m;draw()}});
})();
