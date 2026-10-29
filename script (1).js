var cv=document.getElementById('stars'),cx=cv.getContext('2d'),stars=[],mx=0,my=0,W,H;
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;stars=[];for(var i=0;i<Math.floor(W*H/5500);i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.3,z:Math.random()*.8+.2,p:Math.random()*6})}
size();addEventListener('resize',size);
var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(t){
  cx.clearRect(0,0,W,H);
  stars.forEach(function(s){
    var a=still?.8:.45+.55*Math.abs(Math.sin(t/900*s.z+s.p));
    var x=s.x+mx*s.z*-18,y=s.y+my*s.z*-18+((scrollY*s.z*.15)%H);
    y=((y%H)+H)%H;
    cx.fillStyle='rgba(235,240,255,'+a+')';cx.beginPath();cx.arc(x,y,s.r,0,6.3);cx.fill();
  });
  // shooting star
  var k=(t%7000)/7000;if(k<.08&&!still){var q=k/.08;cx.strokeStyle='rgba(94,242,255,'+(1-q)+')';cx.lineWidth=2;cx.beginPath();cx.moveTo(W*.2+q*W*.4,H*.1+q*H*.3);cx.lineTo(W*.2+q*W*.4-70,H*.1+q*H*.3-30);cx.stroke()}
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Hero letters
var t=document.getElementById('title');
t.innerHTML=t.innerHTML.split('<br>').map(function(w){return w.split('').map(function(c){return '<span aria-hidden="true">'+c+'</span>'}).join('')}).join('<br>');

// Cute astronaut follows cursor / finger
var as=document.getElementById('astro'),body=document.getElementById('astroBody');
var tx=innerWidth*.6,ty=innerHeight*.4,ax=tx,ay=ty,vx=0;
function aim(e){var p=e.touches?e.touches[0]:e;tx=p.clientX+30;ty=p.clientY+24;mx=p.clientX/innerWidth-.5;my=p.clientY/innerHeight-.5;
  document.querySelectorAll('.planet').forEach(function(b){var s=+b.dataset.s;b.style.transform='translate('+mx*s*2+'px,'+my*s*2+'px)'})}
addEventListener('mousemove',aim);addEventListener('touchmove',aim,{passive:true});addEventListener('touchstart',aim,{passive:true});
function fly(t){
  var ox=ax;ax+=(tx-ax)*.07;ay+=(ty-ay)*.07;vx+=((ax-ox)-vx)*.2;
  var bob=still?0:Math.sin(t/450)*6;
  as.style.transform='translate('+(ax-38)+'px,'+(ay-40+bob)+'px) rotate('+Math.max(-30,Math.min(30,vx*3))+'deg)';
  requestAnimationFrame(fly);
}
requestAnimationFrame(fly);

// Filters
var chips=document.querySelectorAll('.chip'),cards=document.querySelectorAll('.proj');
chips.forEach(function(c){c.addEventListener('click',function(){
  chips.forEach(function(x){x.setAttribute('aria-pressed',x===c)});
  cards.forEach(function(k){k.classList.toggle('hide',c.dataset.f!=='all'&&k.dataset.t!==c.dataset.f)});
})});

// Count-up
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;io.unobserve(e.target);
  var el=e.target,end=+el.dataset.n,i=0;
  var id=setInterval(function(){i++;el.textContent=i;if(i>=end)clearInterval(id)},900/end);
})},{threshold:.6});
document.querySelectorAll('[data-n]').forEach(function(n){io.observe(n)});

// Form
document.getElementById('form').addEventListener('submit',function(e){
  e.preventDefault();var n=this.n.value;this.reset();
  var t=document.getElementById('toast');t.textContent='🚀 Thanks '+n+'! Message launched.';t.classList.add('show');
  setTimeout(function(){t.classList.remove('show')},3000);
});
