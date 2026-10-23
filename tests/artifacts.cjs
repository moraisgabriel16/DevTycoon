// Keep generated reports and screenshots out of the source tree.
const fs=require('node:fs'),path=require('node:path');
const directory=path.resolve(__dirname,'..','test-artifacts');
module.exports=function artifact(name){
  const destination=path.resolve(directory,name);
  if(!destination.startsWith(directory+path.sep))throw Error('Caminho de resultado inválido: '+name);
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  return destination;
};
