// Produce one complete static release; Vercel serves only this directory.
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname,out=path.join(root,'dist-web');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const worker=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const precache=worker.match(/const FILES = \[([^\]]+)\]/)?.[1];
if(!precache)throw Error('Lista de arquivos offline não encontrada.');
const files=new Set(['index.html','sw.js']);
for(const match of [...html.matchAll(/(?:src|href)="\.\/([^"?#]+)(?:[^" ]*)?"/g),...precache.matchAll(/'\.\/([^']+)'/g)])files.add(match[1]);
for(const name of ['customization-v37.js','customization-v37.css','office-atlas-v36.js','office-atlas-v36.css','assets/v36/catalog.json','assets/v36/manifest.json','assets/v36/creation-atlas.png','assets/v36/focus-atlas.png','assets/v36/social-atlas.png','assets/v36/wellbeing-atlas.png','assets/v36/reception-atlas.png','assets/v36/collaboration-atlas.png','assets/v36/garden-atlas.png','assets/v36/plaza-atlas.png','assets/v36/circulation-atlas.png','assets/v36/identity-atlas.png','story-v35.js','story-v35.css','district-v34.js','district-v34.css','neighborhood-v33.js','customization-v33.js','neighborhood-v33.css','management-v32.js','management-v32.css','assets/devcorp-logo.svg','assets/desk-double-empty.png']){
  if(!files.has(name))throw Error('A publicação está incompleta: '+name);
}
// Check every dependency before writing any output.
for(const name of files){
  const source=path.resolve(root,name);
  if(!source.startsWith(root+path.sep)||!fs.statSync(source).isFile())throw Error('Arquivo inválido na publicação: '+name);
}
fs.mkdirSync(out,{recursive:true});
for(const name of files){const destination=path.join(out,name);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(path.join(root,name),destination)}
console.log('DevCorp: '+files.size+' arquivos validados e copiados para dist-web.');
