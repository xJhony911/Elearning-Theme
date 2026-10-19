(() => {
  'use strict';
  const api=globalThis.browser ?? globalThis.chrome;
  const {defaults,normalize,ink,luminance,fonts}=globalThis.EspSettings;
  const previous=new Map();
  let current={...defaults},revision=0,ready=false;
  function apply(){
    const root=document.documentElement;
    if(!root || !ready)return;
    const s=current;
    for(const [prop,original] of previous){
      if(original.value)root.style.setProperty(prop,original.value,original.priority);
      else root.style.removeProperty(prop);
    }
    previous.clear();
    for(const attr of ['data-esp-theme','data-esp-scheme','data-esp-motion','data-esp-links'])root.removeAttribute(attr);
    if(s.theme==='off')return;
    root.setAttribute('data-esp-theme',s.theme);
    root.setAttribute('data-esp-motion',s.reduceMotion?'reduce':'normal');
    root.setAttribute('data-esp-links',s.underlineLinks?'underline':'normal');
    const set=(name,value)=>{
      if(!previous.has(name))previous.set(name,{value:root.style.getPropertyValue(name),priority:root.style.getPropertyPriority(name)});
      root.style.setProperty(name,value,'important');
    };
    set('--esp-font',fonts[s.font]);set('--esp-size',`${s.fontSize}px`);
    set('--esp-line-height',String(s.lineHeight));set('--radius',`${s.radius}px`);
    const light=s.customColors?luminance(s.background)>.35:['paper','sepia','lavender'].includes(s.theme);
    root.setAttribute('data-esp-scheme',light?'light':'dark');
    if(s.customColors){
      set('--accent',s.accent);set('--link',s.accent);set('--accent-ink',ink(s.accent));
      set('--accent-soft',`color-mix(in srgb, ${s.accent} 15%, ${s.surface})`);
      set('--bg',s.background);set('--surface',s.surface);
      for(const p of ['--surface-2','--header-bg','--nav-bg','--section-bar'])set(p,s.surface);
      set('--surface-3',`color-mix(in srgb, ${s.surface} 88%, ${s.text})`);
      for(const p of ['--text','--text-strong','--nav-text'])set(p,s.text);
      set('--muted',`color-mix(in srgb, ${s.text} 80%, ${s.surface})`);
      set('--border',`color-mix(in srgb, ${s.text} 24%, ${s.surface})`);
      set('--bg-image','none');set('--text-glow','none');set('--img-filter','none');
      set('--shadow','0 3px 16px rgb(0 0 0 / 10%)');
    }
  }
  // document_start may precede the creation of <html>.
  const observer=new MutationObserver(()=>{if(document.documentElement){apply();observer.disconnect();}});
  if(!document.documentElement)observer.observe(document,{childList:true});
  const restore=async()=>{
    const ticket=++revision;
    try{
      const stored=await api.storage.local.get(['settings','theme']);
      if(ticket!==revision)return;
      current=normalize(stored.settings ?? {theme:stored.theme ?? defaults.theme});ready=true;apply();
    }catch(error){console.warn('ESPOCH Themes: no se pudieron leer las preferencias.',error);}
  };
  api.storage.onChanged.addListener((changes,area)=>{
    if(area!=='local')return;
    if(changes.settings){++revision;current=normalize(changes.settings.newValue);ready=true;apply();}
    else if(changes.theme)void restore();
  });
  // Preferences never go in the university's localStorage.
  void restore();
})();
