/* Validation shared by the popup and isolated content scripts. */
(() => {
  const defaults=Object.freeze({theme:'midnight',lastTheme:'midnight',font:'system',fontSize:16,lineHeight:1.6,radius:10,
    reduceMotion:false,underlineLinks:false,customColors:false,
    accent:'#4cc9f0',background:'#0e1218',surface:'#161c26',text:'#d7dee9'});
  const fonts=Object.freeze({system:'system-ui, "Segoe UI", sans-serif',arial:'Arial, Helvetica, sans-serif',
    verdana:'Verdana, Geneva, sans-serif',georgia:'Georgia, "Times New Roman", serif',
    trebuchet:'"Trebuchet MS", Arial, sans-serif',mono:'Consolas, "Courier New", monospace'});
  const clamp=(v,min,max,fallback)=>typeof v==='number' && Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback;
  const color=(v,fallback)=>typeof v==='string' && /^#[\da-f]{6}$/i.test(v)?v.toLowerCase():fallback;
  function normalize(input){
    const s=input && typeof input==='object' && !Array.isArray(input)?input:{};
    return {theme:typeof s.theme==='string' && /^(?:off|[a-z0-9-]{1,40})$/.test(s.theme)?s.theme:defaults.theme,
      lastTheme:typeof s.lastTheme==='string' && s.lastTheme!=='off' && /^[a-z0-9-]{1,40}$/.test(s.lastTheme)?s.lastTheme:defaults.lastTheme,
      font:Object.hasOwn(fonts,s.font)?s.font:defaults.font,
      fontSize:Math.round(clamp(s.fontSize,12,24,defaults.fontSize)),
      lineHeight:Math.round(clamp(s.lineHeight,1.2,2,defaults.lineHeight)*10)/10,
      radius:Math.round(clamp(s.radius,0,20,defaults.radius)),
      reduceMotion:s.reduceMotion===true,underlineLinks:s.underlineLinks===true,customColors:s.customColors===true,
      accent:color(s.accent,defaults.accent),background:color(s.background,defaults.background),
      surface:color(s.surface,defaults.surface),text:color(s.text,defaults.text)};
  }
  function luminance(hex){
    const v=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
    return .2126*v[0]+.7152*v[1]+.0722*v[2];
  }
  function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function ink(hex){return contrast(hex,'#ffffff')>contrast(hex,'#111827')?'#ffffff':'#111827';}
  globalThis.EspSettings=Object.freeze({defaults,fonts,normalize,contrast,ink,luminance});
})();
