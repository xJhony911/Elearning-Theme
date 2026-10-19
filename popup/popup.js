(() => {
  'use strict';
  const api=globalThis.browser ?? globalThis.chrome;
  const {defaults,normalize,contrast,fonts}=globalThis.EspSettings;
  const $=id=>document.getElementById(id);
  let settings={...defaults},themes=[],lastTheme=defaults.theme;
  let writes=Promise.resolve(),saveRevision=0;
  const status=(message,error=false)=>{$('status').textContent=message;$('status').classList.toggle('error',error);};
  function render(){
    const enabled=settings.theme!=='off';
    $('enabled').checked=enabled;document.body.classList.toggle('paused',!enabled);
    for(const key of ['font','fontSize','lineHeight','radius','accent','background','surface','text'])$(key).value=settings[key];
    for(const key of ['customColors','underlineLinks','reduceMotion'])$(key).checked=settings[key];
    $('fontSize-value').textContent=`${settings.fontSize} px`;
    $('lineHeight-value').textContent=settings.lineHeight.toFixed(1);
    $('radius-value').textContent=`${settings.radius} px`;
    $('colors').disabled=!settings.customColors;
    for(const btn of $('grid').children)btn.setAttribute('aria-pressed',String(btn.dataset.id===settings.theme));
    const theme=themes.find(t=>t.id===(enabled?settings.theme:lastTheme)) ?? themes[0];
    const colors=settings.customColors?[settings.background,settings.surface,settings.accent]:theme.colors;
    const text=settings.customColors?settings.text:theme.text ?? '#d7dee9';
    const preview=$('preview');
    preview.style.background=colors[1];preview.style.color=text;
    preview.style.borderColor=colors[2];preview.style.borderRadius=`${settings.radius}px`;
    preview.style.fontFamily=fonts[settings.font];preview.style.fontSize=`${settings.fontSize}px`;
    preview.style.lineHeight=settings.lineHeight;
    preview.querySelector('.preview-link').style.color=colors[2];
    preview.querySelector('.preview-link').style.textDecoration=settings.underlineLinks?'underline':'none';
    const ratios=[contrast(text,colors[0]),contrast(text,colors[1]),contrast(colors[2],colors[1])];
    const minimum=Math.min(...ratios);
    $('contrast').textContent=settings.customColors?
      `Contraste mínimo texto/enlaces: ${minimum.toFixed(1)}:1. ${minimum<4.5?'Ajusta los colores; se recomienda al menos 4.5:1 para texto normal.':'Buen contraste para texto normal.'}`:
      'Activa «Mis colores» para personalizar la paleta.';
    $('contrast').classList.toggle('warning',settings.customColors && minimum<4.5);
  }
  function save(){
    const snapshot=normalize(settings),ticket=++saveRevision;
    status('Guardando…');
    // Serialize writes so dragging a slider cannot let an older value win.
    writes=writes.catch(()=>{}).then(()=>api.storage.local.set({settings:snapshot})).then(()=>{
      if(ticket===saveRevision)status(snapshot.theme==='off'?'Aula original · ajustes desactivados':'Guardado · se aplica en las pestañas del aula');
    }).catch(error=>{if(ticket===saveRevision)status('No se guardó. Vuelve a intentarlo.',true);console.warn('ESPOCH Themes: error al guardar.',error);});
  }
  function update(patch){settings=normalize({...settings,...patch});render();save();}
  async function main(){
    try{
      const response=await fetch(api.runtime.getURL('themes.json'));
      if(!response.ok)throw new Error('Catálogo no disponible');
      themes=await response.json();
      if(!Array.isArray(themes)||!themes.length)throw new Error('Catálogo vacío');
      const stored=await api.storage.local.get(['settings','theme']);
      settings=normalize(stored.settings ?? {theme:stored.theme ?? defaults.theme});
      if(settings.theme!=='off'&&!themes.some(t=>t.id===settings.theme))settings.theme=defaults.theme;
      lastTheme=settings.theme!=='off'?settings.theme:settings.lastTheme;
      if(!themes.some(t=>t.id===lastTheme))lastTheme=defaults.theme;
      $('version').textContent='v'+api.runtime.getManifest().version;
      $('theme-count').textContent=`${themes.length} estilos`;
      for(const t of themes){
        const btn=document.createElement('button');btn.type='button';btn.className='theme';btn.dataset.id=t.id;
        btn.setAttribute('aria-label',`Tema ${t.name}`);
        const swatch=document.createElement('div');swatch.className='preview-swatch';swatch.style.background=t.colors[0];swatch.setAttribute('aria-hidden','true');
        for(const color of t.colors.slice(1)){const el=document.createElement('i');el.style.background=color;swatch.appendChild(el);}
        const name=document.createElement('div');name.className='label';name.textContent=t.name;
        btn.append(swatch,name);btn.addEventListener('click',()=>{lastTheme=t.id;update({theme:t.id,lastTheme:t.id,customColors:false});});
        $('grid').appendChild(btn);
      }
      $('enabled').addEventListener('change',()=>update({theme:$('enabled').checked?lastTheme:'off',lastTheme}));
      $('font').addEventListener('change',()=>update({font:$('font').value}));
      for(const id of ['fontSize','lineHeight','radius'])$(id).addEventListener('input',()=>update({[id]:Number($(id).value)}));
      for(const id of ['accent','background','surface','text'])$(id).addEventListener('input',()=>update({[id]:$(id).value}));
      for(const id of ['customColors','underlineLinks','reduceMotion'])$(id).addEventListener('change',()=>update({[id]:$(id).checked}));
      $('reset').addEventListener('click',()=>{settings={...defaults};lastTheme=defaults.theme;render();save();});
      render();$('controls').setAttribute('aria-busy','false');document.body.classList.remove('loading');
      $('enabled').disabled=false;$('reset').disabled=false;
      status(settings.theme==='off'?'Aula original · ajustes desactivados':'Ajustes listos · cambios automáticos');
    }catch(error){status('No se pudieron cargar los ajustes. Reabre el menú.',true);console.warn('ESPOCH Themes: error de inicio.',error);}
  }
  void main();
})();
