const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,'src',name),'utf8');
function harness(stored={},noRoot=false){
  const attrs=new Map(),styles=new Map();
  const element={setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:k=>attrs.delete(k),
    style:{setProperty:(k,v)=>styles.set(k,v),removeProperty:k=>styles.delete(k),
      getPropertyValue:k=>styles.get(k)??'',getPropertyPriority:()=>''}};
  let changed,observer,resolveGet;
  const document={documentElement:noRoot?null:element};
  const context=vm.createContext({console,document,MutationObserver:class{
    constructor(fn){observer=fn;}observe(){}disconnect(){}} ,
    browser:{storage:{local:{get:()=>new Promise(resolve=>{resolveGet=resolve;})},
      onChanged:{addListener:fn=>{changed=fn;}}}}});
  vm.runInContext(source('settings.js'),context);vm.runInContext(source('content.js'),context);
  return {attrs,styles,context,element,document,load:async()=>{resolveGet(stored);await new Promise(setImmediate);},
    rootReady:()=>{document.documentElement=element;observer();},change:s=>changed({settings:{newValue:s}},'local')};
}
test('document_start waits for html and migrates legacy theme',async()=>{
  const h=harness({theme:'neon'},true);await h.load();assert.equal(h.attrs.size,0);
  h.rootReady();assert.equal(h.attrs.get('data-esp-theme'),'neon');assert.equal(h.styles.get('--esp-size'),'16px');
});
test('live updates, custom colors and disabling fully clear extension overrides',async()=>{
  const h=harness();await h.load();h.change({theme:'paper',font:'georgia',fontSize:21,customColors:true,
    background:'#ffffff',surface:'#fafafa',text:'#112233',accent:'#663399'});
  assert.equal(h.attrs.get('data-esp-scheme'),'light');assert.equal(h.styles.get('--esp-size'),'21px');
  assert.equal(h.styles.get('--text'),'#112233');assert.match(h.styles.get('--esp-font'),/Georgia/);
  h.change({theme:'off'});assert.equal(h.attrs.size,0);assert.equal(h.styles.size,0);
});
test('latest storage change wins over a delayed initial read',async()=>{
  const h=harness({theme:'neon'});h.change({theme:'sepia',fontSize:19});await h.load();
  assert.equal(h.attrs.get('data-esp-theme'),'sepia');assert.equal(h.styles.get('--esp-size'),'19px');
});
test('disabling restores pre-existing page CSS variables',async()=>{
  const h=harness();h.styles.set('--accent','#123456');await h.load();
  h.change({theme:'midnight',customColors:true,accent:'#abcdef'});
  assert.equal(h.styles.get('--accent'),'#abcdef');h.change({theme:'off'});
  assert.equal(h.styles.get('--accent'),'#123456');
});
test('settings reject CSS injection and invalid numeric/boolean input',async()=>{
  const h=harness();await h.load();
  const s=h.context.EspSettings.normalize({theme:'x"] body',accent:'red; color:black',font:'evil',fontSize:999,
    lineHeight:NaN,radius:-20,reduceMotion:'false',customColors:1});
  assert.equal(s.theme,'midnight');assert.equal(s.font,'system');assert.equal(s.accent,'#4cc9f0');
  assert.equal(s.fontSize,24);assert.equal(s.lineHeight,1.6);assert.equal(s.radius,0);assert.equal(s.reduceMotion,false);assert.equal(s.customColors,false);
  assert.equal(h.context.EspSettings.contrast('#000000','#ffffff'),21);
});
test('catalog and manifests reference only packaged files, with minimal permissions',()=>{
  const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
  const themes=JSON.parse(fs.readFileSync(path.join(root,'themes.json')));
  assert.deepEqual(m.permissions,['storage']);assert.deepEqual(m.content_scripts[0].matches,['https://elearning.espoch.edu.ec/*']);
  assert.equal(new Set(themes.map(t=>t.id)).size,themes.length);assert.equal(themes.length,8);
  for(const file of [...m.content_scripts[0].css,...m.content_scripts[0].js,m.action.default_popup,m.options_ui.page])assert.ok(fs.existsSync(path.join(root,file)),file);
  assert.equal(m.content_scripts[0].css.at(-1),'css/accessibility.css');
  assert.equal(m.browser_specific_settings.gecko.id,'espoch-themes@jonathan');
  for(const t of themes)assert.ok(m.content_scripts[0].css.includes(`css/themes/${t.id}.css`));
});
