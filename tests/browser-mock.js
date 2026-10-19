/* Fixture only; excluded from extension packages. Simulates extension storage. */
(() => {
  const listeners=[];
  const emit=(newValue)=>listeners.forEach(fn=>fn({settings:{newValue}},'local'));
  window.addEventListener('storage',event=>{if(event.key==='esp-fixture-settings')emit(JSON.parse(event.newValue ?? 'null'));});
  globalThis.browser={runtime:{getURL:name=>'/'+name,getManifest:()=>({version:'0.4.0 · DEMO'})},storage:{
    local:{get:async()=>({settings:JSON.parse(localStorage.getItem('esp-fixture-settings')??'null')??undefined}),
      set:async({settings})=>{localStorage.setItem('esp-fixture-settings',JSON.stringify(settings));emit(settings);}},
    onChanged:{addListener:fn=>listeners.push(fn)}}};
})();
