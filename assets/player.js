(() => {
 'use strict';
 const video=document.querySelector('#video'), pip=document.querySelector('#pip'), status=document.querySelector('#player-status');
 const rows=[...document.querySelectorAll('[data-level]')];
 let selected=null;
 const standard=!!document.pictureInPictureEnabled && typeof video.requestPictureInPicture==='function';
 const safari=typeof video.webkitSetPresentationMode==='function';
 const isPip=()=>document.pictureInPictureElement===video || video.webkitPresentationMode==='picture-in-picture';
 const syncPip=()=>{pip.textContent=isPip()?'Exit picture-in-picture':'Picture-in-picture';pip.setAttribute('aria-pressed',String(isPip()));pip.disabled=video.readyState<2 || !!video.error;};
 function select(row,announce=false){
  if(!row || row===selected)return;
  selected=row;video.pause();
  const link=row.querySelector('[data-watch]');
  video.poster=row.dataset.poster;video.src=link.getAttribute('href');video.load();
  document.querySelector('#playing-title').textContent=row.dataset.title;
  document.querySelector('#playing-number').textContent=`Level ${row.dataset.level.slice(6)}`;
  document.querySelector('#playing-duration').textContent=row.querySelector('.duration').textContent;
  document.querySelector('#current-download').href=link.href;
  for(const r of rows){const a=r.querySelector('[data-watch]');if(r===row)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');}
  status.textContent=announce?`Selected level ${row.dataset.level.slice(6)}: ${row.dataset.title}.`:'';
  document.title=`${row.dataset.title} — Baba Is You · jehlp.net`;syncPip();
 }
 for(const row of rows)row.querySelector('[data-watch]').addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();select(row,true);history.pushState(null,'',`#${row.dataset.level}`);
  document.querySelector('#player').focus({preventScroll:true});document.querySelector('#player').scrollIntoView({block:'nearest',behavior:'instant'});
 });
 function fromHash(){select(rows.find(r=>`#${r.dataset.level}`===location.hash)||rows[0]);}
 window.addEventListener('popstate',fromHash);window.addEventListener('hashchange',fromHash);fromHash();
 if(standard||safari){pip.hidden=false;document.querySelector('#pip-note').hidden=true;}
 for(const name of ['loadeddata','emptied','enterpictureinpicture','leavepictureinpicture','webkitpresentationmodechanged'])video.addEventListener(name,syncPip);
 video.addEventListener('error',()=>{status.textContent='This clip could not be loaded. Try its download link or reload the page.';syncPip();});
 pip.addEventListener('click',async()=>{
  try{
   if(standard){if(document.pictureInPictureElement===video)await document.exitPictureInPicture();else await video.requestPictureInPicture();}
   else video.webkitSetPresentationMode(isPip()?'inline':'picture-in-picture');
   status.textContent='';syncPip();
  }catch{status.textContent='Picture-in-picture is unavailable right now. You can keep watching in the player.';}
 });
})();
