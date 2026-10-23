// Deterministic atlas packing: retain RGBA, isolate cells and use nearest-neighbor.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets','v36'),catalog=JSON.parse(fs.readFileSync(path.join(dir,'catalog.json'),'utf8'));
const allowed=new Set(catalog.items.map(i=>i.source+'-source.png'));
const server=http.createServer((req,res)=>{const name=req.url.slice(1);if(!allowed.has(name))return res.writeHead(404).end();res.writeHead(200,{'Content-Type':'image/png','Access-Control-Allow-Origin':'*'});res.end(fs.readFileSync(path.join(dir,name)))});let browser;
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();
  const result=await page.evaluate(async({catalog,base})=>{
    const out=[],manifest={version:1,cell:catalog.cell,sheets:catalog.sheets,frames:{}};
    // Find whole connected objects before assigning quadrants. This preserves
    // feet that cross a nominal grid line and excludes fragments of a neighbor.
    function splitObjects(source,pixels){
      const w=source.width,h=source.height,seen=new Uint8Array(w*h),queue=new Int32Array(w*h),parts=[];
      const opaque=(x,y)=>pixels[(y*w+x)*4+3]>32;
      for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
        const at=yy*w+xx;if(seen[at]||!opaque(xx,yy))continue;
        let head=0,tail=1;queue[0]=at;seen[at]=1;const p={area:0,left:xx,top:yy,right:xx,bottom:yy};
        while(head<tail){const n=queue[head++],x=n%w,y=Math.floor(n/w);p.area++;p.left=Math.min(p.left,x);p.top=Math.min(p.top,y);p.right=Math.max(p.right,x);p.bottom=Math.max(p.bottom,y);
          for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const i=ny*w+nx;if(!seen[i]&&opaque(nx,ny)){seen[i]=1;queue[tail++]=i}}
        }parts.push(p);
      }
      const slot=p=>((p.left+p.right)/2<w/2?0:1)+((p.top+p.bottom)/2<h/2?0:2),anchors=[0,1,2,3].map(i=>parts.filter(p=>slot(p)===i).sort((a,b)=>b.area-a.area)[0]);
      if(anchors.some(p=>!p))throw Error('A fonte não contém quatro objetos completos.');
      const distance=(a,b)=>Math.hypot(Math.max(0,a.left-b.right,b.left-a.right),Math.max(0,a.top-b.bottom,b.top-a.bottom));
      const groups=[[],[],[],[]];
      for(const p of parts){const nearest=anchors.map((a,i)=>({i,d:distance(a,p)})).sort((a,b)=>a.d-b.d)[0].i;if(p.area>=Math.max(32,anchors[nearest].area*.01))groups[nearest].push(p)}
      return groups.map(group=>({left:Math.min(...group.map(p=>p.left)),top:Math.min(...group.map(p=>p.top)),right:Math.max(...group.map(p=>p.right)),bottom:Math.max(...group.map(p=>p.bottom))}));
    }
    const sources={};
    for(const name of new Set(catalog.items.map(i=>i.source))){
      const image=new Image();image.crossOrigin='anonymous';image.src=base+'/'+name+'-source.png';await image.decode();
      if(image.width<128||image.height<128)throw Error('Folha muito pequena: '+name);
      const source=document.createElement('canvas');source.width=image.width;source.height=image.height;const ctx=source.getContext('2d');ctx.drawImage(image,0,0);
      sources[name]={source,frames:splitObjects(source,ctx.getImageData(0,0,source.width,source.height).data)};
    }
    for(const sheet of Object.keys(catalog.sheets)){
      const atlas=document.createElement('canvas');atlas.width=atlas.height=catalog.cell*2;const g=atlas.getContext('2d');g.imageSmoothingEnabled=false;
      for(const item of catalog.items.filter(i=>i.sheet===sheet)){
        const{source,frames}=sources[item.source],{left,top,right,bottom}=frames[item.sourceSlot];
        if(right<left)throw Error('Sprite vazio: '+item.id);
        const [tw,th]=item.size,x=item.slot%2*catalog.cell+Math.floor((catalog.cell-tw)/2),y=Math.floor(item.slot/2)*catalog.cell+88-th;
        g.drawImage(source,left,top,right-left+1,bottom-top+1,x,y,tw,th);
        manifest.frames[item.id]={sheet,x,y,w:tw,h:th,anchor:[tw/2,th],sourceName:item.source,source:[left,top,right-left+1,bottom-top+1]};
      }
      out.push({name:catalog.sheets[sheet],data:atlas.toDataURL().split(',')[1]});
    }
    const preview=document.createElement('canvas');preview.width=2020;preview.height=900;const pg=preview.getContext('2d');pg.fillStyle='#eee7d2';pg.fillRect(0,0,preview.width,preview.height);pg.imageSmoothingEnabled=false;
    for(let i=0;i<out.length;i++){const im=new Image();im.src='data:image/png;base64,'+out[i].data;await im.decode();const c=catalog.collections[i],x=i%5*404,y=Math.floor(i/5)*450;pg.fillStyle='#8d7952';pg.font='11px Tahoma';pg.fillText(c.scope==='office'?'ESCRITÓRIO':'EXTERIOR',x+18,y+20);pg.fillStyle='#334e45';pg.font='bold 15px Tahoma';pg.fillText(c.name,x+18,y+44);pg.drawImage(im,x+10,y+62,384,384)}
    out.push({name:'atlas-preview.png',data:preview.toDataURL().split(',')[1]});return{out,manifest};
  },{catalog,base:'http://127.0.0.1:'+server.address().port});
  for(const file of result.out)fs.writeFileSync(path.join(dir,file.name),Buffer.from(file.data,'base64'));fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(result.manifest,null,2)+'\n');console.log('Dez atlas RGBA e quarenta recortes prontos para o jogo.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.close()});
