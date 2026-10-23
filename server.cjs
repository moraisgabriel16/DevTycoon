const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const root = __dirname;
const port = Number(process.env.PORT) || 4280;
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.png':'image/png' };
http.createServer((req,res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch { res.writeHead(400).end(); return; }
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (file === root) file = path.join(root,'index.html');
  fs.readFile(file,(err,data) => {
    if(err) { res.writeHead(404).end('Não encontrado'); return; }
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'}).end(data);
  });
}).listen(port,'0.0.0.0',() => {
  console.log(`DevCorp: http://localhost:${port}`);
  for(const values of Object.values(os.networkInterfaces())) for(const net of values||[]) if(net.family==='IPv4'&&!net.internal) console.log(`Celular na mesma rede: http://${net.address}:${port}`);
});
