(() => {
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')) {
    navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('Modo offline indisponível:',error));
  }
  let installEvent;
  const button=document.createElement('button');
  button.id='installGame';button.textContent='＋ Instalar jogo';button.hidden=true;
  function attach(){const menu=document.querySelector('#ts .titleSecondary23');(menu||document.querySelector('.personalEntryBar'))?.append(button)}
  attach();
  const titleBeforeInstall=titleRender;titleRender=function(){titleBeforeInstall();attach()};
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installEvent=event;button.hidden=false;attach();});
  button.onclick=async()=>{if(!installEvent)return;await installEvent.prompt();installEvent=null;button.hidden=true;};
  window.addEventListener('appinstalled',()=>{button.hidden=true;});
})();
