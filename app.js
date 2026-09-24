'use strict';
/* =====================================================================
  DeBadger Studio — customer app + owner console
   Storage: shared `db` capability when available, else this device only.
   ===================================================================== */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const peso=n=>'₱'+Number(n||0).toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
const clone=o=>JSON.parse(JSON.stringify(o));
const uid=()=>Math.random().toString(36).slice(2,9);
const LS={get(k,d){try{const v=localStorage.getItem('pm_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('pm_'+k,JSON.stringify(v));return true}catch(e){return false}}};
let DEV=LS.get('dev')||(()=>{const v='d'+uid()+uid();LS.set('dev',v);return v})();
const FONT="Bricolage Grotesque,Figtree,Arial,sans-serif";

/* ---------- icons ---------- */
const IC={
home:'<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
shop:'<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>',
design:'<path d="M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3"/>',
orders:'<path d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8"/>',
account:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
search:'<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/>',
bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
cart:'<path d="M3 4h3l2 12h10l2-8H7"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/>',
heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2 4.5 4.5 0 0 1 8 2c0 6-8 11-8 11z"/>',
check:'<path d="M5 12l5 5 9-10"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
camera:'<path d="M4 8h4l2-3h4l2 3h4v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
image:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M4 17l5-4 4 3 3-2 4 3"/>',
file:'<path d="M6 3h8l4 4v14H6zM14 3v4h4"/>',
text:'<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
crop:'<path d="M7 3v14h14M3 7h14v14"/>',
rotate:'<path d="M20 12a8 8 0 1 1-3-6M20 4v5h-5"/>',
zoom:'<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5M8 11h6M11 8v6"/>',
bg:'<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
move:'<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
sticker:'<circle cx="12" cy="12" r="9"/><path d="M8 14c2 3 6 3 8 0M9 9.5v.5M15 9.5v.5"/>',
warn:'<path d="M12 4l9 16H3zM12 10v4M12 17v.5"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
truck:'<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
chev:'<path d="M9 6l6 6-6 6"/>',back:'<path d="M15 6l-6 6 6 6"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
gift:'<rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0"/>',
pin:'<path d="M12 21v-6M8 4h8l-1 6 3 3H6l3-3z"/>',
pkg:'<path d="M3 8l9-5 9 5v8l-9 5-9-5zM7.5 5.5l9 5M3 8l9 5 9-5"/>',
help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.5"/>',
out:'<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
card:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M17 5a3.5 3.5 0 0 1 0 7M19 15c2 .6 3 2.2 3 5"/>',
chart:'<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8"/>',
star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
dl:'<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>'
};
const ic=(n,extra='')=>`<i class="ic" ${extra}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg></i>`;

/* ---------- ready-made artwork (100x100, also rendered onto the print canvas) ---------- */
const SF='font-family="Arial,Helvetica,sans-serif" font-weight="800"';
const flw=(x,y,r,c)=>{let s='';for(let a=0;a<360;a+=72)s+=`<circle cx="${(x+Math.cos(a*Math.PI/180)*r).toFixed(1)}" cy="${(y+Math.sin(a*Math.PI/180)*r).toFixed(1)}" r="${(r*.85).toFixed(1)}" fill="${c}"/>`;return s+`<circle cx="${x}" cy="${y}" r="${(r*.7).toFixed(1)}" fill="#FFC94D"/>`};
const confetti=()=>{const c=['#E4505A','#3F9E6E','#5B8DEF','#fff','#F2A03A'],p=[[10,14],[24,30],[82,12],[90,34],[8,58],[92,64],[18,88],[80,90],[60,8],[38,10],[70,26],[30,52]];return p.map((q,i)=>`<rect x="${q[0]}" y="${q[1]}" width="5" height="2.6" rx="1" fill="${c[i%5]}" transform="rotate(${i*37} ${q[0]} ${q[1]})"/>`).join('')};
const A={
pet:'<rect width="100" height="100" fill="#FFD9D2"/><circle cx="50" cy="104" r="36" fill="#E4505A"/><ellipse cx="22" cy="36" rx="11" ry="20" fill="#A8683F" transform="rotate(18 22 36)"/><ellipse cx="78" cy="36" rx="11" ry="20" fill="#A8683F" transform="rotate(-18 78 36)"/><circle cx="50" cy="54" r="29" fill="#F6DFC2"/><ellipse cx="50" cy="65" rx="14" ry="11" fill="#fff"/><circle cx="39" cy="50" r="3.4" fill="#2b2020"/><circle cx="61" cy="50" r="3.4" fill="#2b2020"/><ellipse cx="50" cy="59" rx="5" ry="3.6" fill="#2b2020"/><path d="M44 68q6 6 12 0" stroke="#2b2020" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M47 69q3 9 6 0z" fill="#E4505A"/><circle cx="50" cy="88" r="4.5" fill="#FFD166"/>',
floral:'<rect width="100" height="100" fill="#FFF3E4"/><path d="M50 104C50 74 34 62 22 42M50 104C52 78 66 66 78 44" stroke="#5FA777" stroke-width="3" fill="none"/><ellipse cx="34" cy="70" rx="9" ry="4" fill="#7DBE8F" transform="rotate(-30 34 70)"/><ellipse cx="66" cy="72" rx="9" ry="4" fill="#7DBE8F" transform="rotate(30 66 72)"/>'+flw(50,46,10,'#F2828B')+flw(22,26,6.5,'#F6B6BC')+flw(80,28,7,'#FFA9A0')+flw(26,72,5.5,'#FFD1D5')+flw(76,74,7,'#E4505A'),
name:`<rect width="100" height="100" fill="#EE6A73"/><circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-dasharray="2 3"/><text x="50" y="61" text-anchor="middle" ${SF} font-size="38" fill="#fff">Mia</text><text x="26" y="30" font-size="12" fill="#FFD6DA" text-anchor="middle">♥</text><text x="76" y="80" font-size="10" fill="#FFD6DA" text-anchor="middle">♥</text>`,
logo:`<rect width="100" height="100" fill="#262122"/><polygon points="50,18 68,28 68,48 50,58 32,48 32,28" fill="#F2A03A"/><path d="M43 31v14h12" stroke="#262122" stroke-width="4.5" fill="none" stroke-linejoin="round"/><text x="50" y="76" text-anchor="middle" ${SF} font-size="13" fill="#fff" letter-spacing="2.4">LUMEN</text><text x="50" y="87" text-anchor="middle" ${SF} font-size="6" fill="#F2A03A" letter-spacing="1.6">COFFEE CO.</text>`,
bday:`<rect width="100" height="100" fill="#FFE08A"/>${confetti()}<text x="50" y="62" text-anchor="middle" ${SF} font-size="46" fill="#E4505A">30</text><text x="50" y="78" text-anchor="middle" ${SF} font-size="8" fill="#231F20">Happy Birthday</text>`,
grad:`<rect width="100" height="100" fill="#21356B"/><polygon points="50,20 86,36 50,52 14,36" fill="#111"/><path d="M30 44v12c0 6 40 6 40 0V44l-20 9z" fill="#2c2c2c"/><path d="M84 37v16" stroke="#F5C34D" stroke-width="2"/><circle cx="84" cy="56" r="3" fill="#F5C34D"/><text x="50" y="71" text-anchor="middle" ${SF} font-size="7" fill="#fff" letter-spacing="1.5">CLASS OF</text><text x="50" y="88" text-anchor="middle" ${SF} font-size="19" fill="#F5C34D">2026</text>`,
photo:'<defs><linearGradient id="pg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD9B8"/><stop offset="1" stop-color="#F7A6B0"/></linearGradient></defs><rect width="100" height="100" fill="url(#pg2)"/><circle cx="78" cy="22" r="10" fill="#FFF1D6" opacity=".8"/><ellipse cx="50" cy="104" rx="34" ry="30" fill="#E4505A"/><rect x="43" y="66" width="14" height="14" rx="5" fill="#E2AE8E"/><ellipse cx="50" cy="50" rx="17" ry="20" fill="#EDBE9F"/><path d="M32 48c-3-22 12-30 24-28 12 2 16 14 12 30-3-10-8-14-14-15-8 4-16 3-22 13z" fill="#3B2A28"/><circle cx="43" cy="52" r="1.8" fill="#2b2020"/><circle cx="57" cy="52" r="1.8" fill="#2b2020"/><path d="M45 61q5 4 10 0" stroke="#B5554F" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
};
const PRESETS=[
{id:'pet',name:'Good Boy Portrait',tags:['cute','personalized'],type:'mirror'},
{id:'floral',name:'Spring Bloom',tags:['cute','minimal'],type:'pin'},
{id:'name',name:'Name Love',tags:['personalized','cute'],type:'mirror'},
{id:'logo',name:'Simple Logo',tags:['business','minimal'],type:'pin'},
{id:'bday',name:'Birthday Bash',tags:['events','cute'],type:'pin'},
{id:'grad',name:'Class of 2026',tags:['school','events'],type:'mirror'},
{id:'photo',name:'Portrait Frame',tags:['personalized','minimal'],type:'mirror'}
];

/* ---------- product renders (SVG) ---------- */
const faceInner=f=>f.u?`<image href="${f.u}" width="100" height="100" preserveAspectRatio="xMidYMid slice"/>`:(A[f.p]||'<rect width="100" height="100" fill="#FFE9EA"/>');
function kc(f,side,w){
  const h=Math.round(w*204/140);
  const hw='<ellipse cx="70" cy="13" rx="9" ry="11" fill="none" stroke="url(#metal2)" stroke-width="3.2"/><ellipse cx="70" cy="13" rx="6.2" ry="8.6" fill="none" stroke="#7d7679" stroke-width=".7" opacity=".55"/><rect x="66" y="25" width="8" height="15" rx="4" fill="none" stroke="#A49D9F" stroke-width="2.4"/><rect x="66" y="36" width="8" height="15" rx="4" fill="none" stroke="#B8B1B3" stroke-width="2.4"/><rect x="66" y="47" width="8" height="15" rx="4" fill="none" stroke="#A49D9F" stroke-width="2.4"/><rect x="60" y="60" width="20" height="24" rx="8" fill="url(#metal)" stroke="#9A9394" stroke-width=".9"/><circle cx="70" cy="67" r="3.2" fill="#6F696B"/>';
  const body='<circle cx="70" cy="134" r="60" fill="url(#metal)" stroke="#9A9394"/><circle cx="70" cy="134" r="56.2" fill="none" stroke="#fff" stroke-opacity=".8"/><circle cx="70" cy="134" r="54.4" fill="none" stroke="#8C8587" stroke-opacity=".6" stroke-width=".8"/>';
  const face=side==='front'
    ?`<g transform="translate(17 81) scale(1.06)" clip-path="url(#ac)">${faceInner(f)}</g><circle cx="70" cy="134" r="53" fill="url(#gl)"/>`
    :'<circle cx="70" cy="134" r="53" fill="url(#mir)"/><g clip-path="url(#mc)"><polygon points="18,112 56,78 80,78 26,152" fill="#fff" opacity=".62"/><polygon points="88,78 104,78 46,178 32,178" fill="#fff" opacity=".28"/><ellipse cx="100" cy="176" rx="40" ry="24" fill="#F2A3A8" opacity=".24"/></g><circle cx="70" cy="134" r="53" fill="none" stroke="#7F8E9B" stroke-width=".9" opacity=".7"/>';
  return `<svg width="${w}" height="${h}" viewBox="0 0 140 204" role="img" aria-label="58 mm mirror keychain, ${side==='front'?'printed front':'mirror back'}">${hw+body+face}</svg>`;
}
function pinSvg(f,w,side){
  if(side==='back')return `<svg width="${w}" height="${w}" viewBox="0 0 100 100" role="img" aria-label="Pin badge back"><circle cx="50" cy="50" r="48" fill="url(#metal)" stroke="#9A9394"/><circle cx="50" cy="50" r="42" fill="none" stroke="#8C8587" stroke-opacity=".35"/><rect x="24" y="44" width="52" height="7" rx="3.5" fill="#B4AEB0" stroke="#8C8587" stroke-width=".8" transform="rotate(-12 50 50)"/><circle cx="28" cy="54" r="5" fill="#8C8587"/><rect x="66" y="34" width="12" height="12" rx="3" fill="#A29B9D" transform="rotate(-12 72 40)"/></svg>`;
  return `<svg width="${w}" height="${w}" viewBox="0 0 100 100" role="img" aria-label="Pin badge front"><circle cx="50" cy="50" r="49" fill="url(#metal)" stroke="#9A9394" stroke-width=".8"/><g transform="translate(5 5) scale(.9)" clip-path="url(#ac)">${faceInner(f)}</g><circle cx="50" cy="50" r="45" fill="url(#gl)"/></svg>`;
}
const KV=(f,side,w,rot=0,cls='')=>`<span class="kv ${cls}" style="${rot?`transform:rotate(${rot}deg)`:''}">${kc(f,side,w)}</span>`;
const PV=(f,w,side='front',cls='')=>`<span class="kv ${cls}">${pinSvg(f,w,side)}</span>`;
const sideSvg=`<svg width="150" height="70" viewBox="0 0 60 30"><rect x="4" y="9" width="52" height="13" rx="5" fill="url(#metal)" stroke="#9a9394"/><rect x="6" y="10.5" width="48" height="4.5" rx="2" fill="#F58A90"/><rect x="6" y="17" width="48" height="3.5" rx="1.5" fill="url(#mir)"/></svg>`;
const ringSvg=`<svg width="70" height="120" viewBox="0 0 40 50"><ellipse cx="20" cy="9" rx="7" ry="8" fill="none" stroke="#9f989a" stroke-width="2.4"/><rect x="16.5" y="16" width="7" height="12" rx="3.5" fill="none" stroke="#a49d9f" stroke-width="2"/><rect x="16.5" y="25" width="7" height="12" rx="3.5" fill="none" stroke="#a49d9f" stroke-width="2"/></svg>`;

/* ---------- shop configuration (owner editable) ---------- */
const DEF={
  tiers:[{min:1,label:'Regular price'},{min:10,label:'Bulk Discount Level 1'},{min:50,label:'Bulk Discount Level 2'},{min:100,label:'Bulk Discount Level 3'}],
  mirror:{size:58,price:[85,75,65,55],promo:{on:false,price:0}},
  pins:[{id:'s',label:'Small',mm:37,on:true,price:[30,26,22,18]},{id:'m',label:'Medium',mm:50,on:true,price:[40,35,30,25]},{id:'l',label:'Large',mm:58,on:true,price:[50,44,38,32]}],
  shipping:[{id:'std',label:'Standard Delivery',fee:100,on:true,note:'Usually 3–7 days'},{id:'exp',label:'Express Delivery',fee:200,on:true,note:'Usually 1–3 days'},{id:'pick',label:'Pickup',fee:0,on:true,note:'Pick up at the studio'}],
  pay:[{id:'gcash',label:'GCash',on:true,info:'Send payment to the studio GCash number (09260456426). We will confirm once received.'},{id:'maya',label:'Maya',on:true,info:'Send payment to the studio Maya account. We will confirm once received.'},{id:'bank',label:'Bank Transfer',on:true,info:'Transfer to the studio bank account and send us the receipt.'},{id:'cod',label:'Cash on Delivery',on:true,info:'Pay in cash when your order arrives or when you pick it up.'},{id:'card',label:'Credit / Debit Card',on:false,info:'Card payment link will be sent to you.'}],
  loyalty:{on:true,per:10,rewards:[{pts:300,off:50},{pts:600,off:120}]},
  inv:[
    {id:'shell',name:'58 mm Mirror Keychain Shells',stock:500,low:100,use:{mirror:1}},
    {id:'mirror',name:'58 mm Mirror Components',stock:500,low:100,use:{mirror:1}},
    {id:'ring',name:'Keyrings',stock:400,low:100,use:{mirror:1}},
    {id:'chain',name:'Chains',stock:400,low:100,use:{mirror:1}},
    {id:'pshell',name:'Pin Badge Shells',stock:800,low:150,use:{pin:1}},
    {id:'pback',name:'Pin Badge Backs',stock:800,low:150,use:{pin:1}},
    {id:'pack',name:'Packaging',stock:300,low:60,use:{mirror:1,pin:1}},
    {id:'ink',name:'Printing Materials',stock:2000,low:400,use:{mirror:1,pin:1}}
  ]
};
const store={cfg:clone(DEF),orders:LS.get('orders',{}),bulk:LS.get('bulk',{}),db:null,user:null,dl:null,shared:false,allSub:false};
const cfg=()=>store.cfg;
{const c=LS.get('cfg');if(c)store.cfg=Object.assign(clone(DEF),c)}

const activePins=()=>cfg().pins.filter(p=>p.on);
const pinOf=id=>cfg().pins.find(p=>p.id===id)||activePins()[0]||cfg().pins[0];
const tierIdx=q=>{let i=0;cfg().tiers.forEach((t,k)=>{if(q>=t.min)i=k});return i};
function rangeLabel(i){const t=cfg().tiers,a=t[i].min,b=t[i+1]?t[i+1].min-1:null;return b===null?`${a}+ pieces`:(a===b?`${a} piece`:`${a}–${b} pieces`)}
function priceOf(product,sizeId,q){
  const arr=product==='mirror'?cfg().mirror.price:pinOf(sizeId).price;
  const i=tierIdx(q);let unit=Number(arr[i]),promo=false;const regular=Number(arr[0]);
  if(product==='mirror'&&cfg().mirror.promo.on&&Number(cfg().mirror.promo.price)>0&&Number(cfg().mirror.promo.price)<unit){unit=Number(cfg().mirror.promo.price);promo=true}
  return{unit,regular,tier:i,promo,discount:Math.max(0,(regular-unit)*q),subtotal:unit*q};
}
const fromPrice=product=>Number((product==='mirror'?cfg().mirror.price:pinOf().price)[0]);
const itemLabel=(product,sizeId)=>product==='mirror'?'Custom Mirror Keychain — 58 mm':`Custom Pin Badge — ${pinOf(sizeId).label} ${pinOf(sizeId).mm} mm`;

/* ---------- persistence: Supabase when configured, else local ---------- */
let softRenderHook=()=>{};
const sbConfig=window.SUPABASE_CONFIG||{};
const sbReady=Boolean(sbConfig.url&&sbConfig.anonKey&&window.supabase?.createClient);
const sb=sbReady?window.supabase.createClient(sbConfig.url,sbConfig.anonKey):null;
const isAdmin=async()=>{if(!sb||!store.user||store.user.is_anonymous)return false;const {data,error}=await sb.from('admin_users').select('user_id').eq('user_id',store.user.id).maybeSingle();return !error&&Boolean(data)};
function browserOrderAlert(o){
  if(!o||!('Notification' in window)||Notification.permission!=='granted')return;
  new Notification('New DeBadger order', {body:`${o.id} from ${o.customer?.name||'a customer'} · ${orderQty(o)} item${orderQty(o)===1?'':'s'}`});
}
async function saveCfg(){LS.set('cfg',store.cfg);if(sb){const {error}=await sb.from('shop_config').upsert({id:'default',data:clone(store.cfg),updated_at:new Date().toISOString()});if(error)toast('Could not save settings')}}
async function saveOrder(o){store.orders[o.id]=o;if(sb){const {error}=await sb.from('orders').upsert({id:o.id,owner_key:o.ownerKey,data:clone(o),created_at:new Date(o.createdAt).toISOString()});if(error){toast('Could not save order');throw error}}else LS.set('orders',store.orders)}
async function saveBulk(b){store.bulk[b.id]=b;if(sb){const {error}=await sb.from('bulk_requests').upsert({id:b.id,owner_key:b.ownerKey,data:clone(b),created_at:new Date(b.at).toISOString()});if(error){toast('Could not save request');throw error}}else LS.set('bulk',store.bulk)}
async function putArt(id,print){if(sb){const {error}=await sb.from('artwork').upsert({id,print,updated_at:new Date().toISOString()});if(error)throw error}else LS.set('art_'+id,print)}
async function getArt(id){if(sb){try{const {data,error}=await sb.from('artwork').select('print').eq('id',id).maybeSingle();return error?null:data?.print||null}catch(e){return null}}return LS.get('art_'+id,null)}
async function initStore(){
  if(!sb)return;
  let {data:{user}}=await sb.auth.getUser();
  if(!user){const result=await sb.auth.signInAnonymously();user=result.data?.user||null}
  store.user=user||null;
  if(user){DEV=user.id;LS.set('dev',DEV)}
  try{
    const {data:config}=await sb.from('shop_config').select('data').eq('id','default').maybeSingle();
    if(config?.data)store.cfg=Object.assign(clone(DEF),clone(config.data));
    const {data:orders}=await sb.from('orders').select('data').eq('owner_key',DEV);
    (orders||[]).forEach(row=>{store.orders[row.data.id]=clone(row.data)});
    softRenderHook();
    sb.channel('customer-data').on('postgres_changes',{event:'*',schema:'public',table:'shop_config'},payload=>{if(payload.new?.data){store.cfg=Object.assign(clone(DEF),clone(payload.new.data));softRenderHook()}}).on('postgres_changes',{event:'*',schema:'public',table:'orders',filter:`owner_key=eq.${DEV}`},payload=>{if(payload.new?.data){store.orders[payload.new.data.id]=clone(payload.new.data);softRenderHook()}}).subscribe();
  }catch(e){toast('Could not connect to Supabase')}
}
function subscribeAll(){
  if(!sb||store.allSub)return;store.allSub=true;
  sb.from('orders').select('data').then(({data})=>{(data||[]).forEach(row=>{store.orders[row.data.id]=clone(row.data)});softRenderHook()});
  sb.from('bulk_requests').select('data').then(({data})=>{(data||[]).forEach(row=>{store.bulk[row.data.id]=clone(row.data)});softRenderHook()});
  sb.channel('owner-data').on('postgres_changes',{event:'*',schema:'public',table:'orders'},payload=>{if(payload.new?.data){store.orders[payload.new.data.id]=clone(payload.new.data);if(payload.eventType==='INSERT')browserOrderAlert(payload.new.data);softRenderHook()}}).on('postgres_changes',{event:'*',schema:'public',table:'bulk_requests'},payload=>{if(payload.new?.data){store.bulk[payload.new.data.id]=clone(payload.new.data);softRenderHook()}}).subscribe();
}

/* ---------- order model ---------- */
const T=['Order received','Design received','Artwork review','Artwork confirmed','Printing','Assembly','Quality check','Ready','Shipped','Completed'];
const MSG=['We received your order.','We received your design.','Your design is being reviewed.','Your design has been confirmed.','Your order is now being printed.','Your order is being assembled.','Your order passed quality checking.','READY','Your order has been shipped.','Your order is complete. Thank you!'];
const PAYST=['Awaiting payment','Deposit received','Paid','Refunded'];
const isPaid=o=>o?.payment?.status==='Paid';
const stepLabel=(o,i)=>i===7?(o.pickup?'Ready for pickup':'Ready for shipping'):T[i];
const stepMsg=(o,i)=>i===7?(o.pickup?'Your order is ready for pickup.':'Your order is packed and ready to ship.'):MSG[i];
const stepsOf=o=>T.map((_,i)=>i).filter(i=>!(o.pickup&&i===8));
const orderCode=()=>'PM-'+String(Date.now()%1e6).padStart(6,'0');
const orderQty=o=>o.items.reduce((s,i)=>s+i.qty,0);
const orderSummary=o=>o.items.length===1?o.items[0].label:`${o.items[0].label} + ${o.items.length-1} more`;
function deliveryStatus(o){
  if(o.pickup)return o.stage<7?'Preparing':o.stage===7?'Ready for pickup':o.stage>=9?'Picked up':'Ready for pickup';
  return o.stage<7?'Preparing':o.stage===7?'Packed':o.stage===8?'In transit':'Delivered';
}
const pillFor=o=>o.stage>=9?'ok':o.stage===2?'warn':o.stage>=7?'ok':'pk';
const fmtDate=t=>new Date(t).toLocaleDateString('en-PH',{month:'short',day:'numeric'});
const fmtTime=t=>new Date(t).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
const myOrders=()=>Object.values(store.orders).filter(o=>o.ownerKey===DEV).sort((a,b)=>b.createdAt-a.createdAt);
const allOrders=()=>Object.values(store.orders).sort((a,b)=>b.createdAt-a.createdAt);
function myPoints(){
  const L=cfg().loyalty;if(!L.on)return 0;
  return myOrders().reduce((s,o)=>s+(o.pointsAwarded||0)-(o.redeemedPts||0),0);
}

/* ---------- app state ---------- */
const S={view:'home',p:{},hist:[],
  cart:LS.get('cart',[]),later:LS.get('later',[]),favs:LS.get('favs',[]),designs:LS.get('designs',[]),
  profile:LS.get('profile',{name:'',phone:'',email:'',street:'',city:'',prov:'',zip:''}),
  draft:null,shopTab:'mirror',ready:{type:'all',tag:'all'},form:{},note:'',err:{},adminPage:'dash',aq:'',afilter:'all',rep:'day',placing:false,gal:0,prevSide:'front'};
const persist={cart:()=>LS.set('cart',S.cart),later:()=>LS.set('later',S.later),favs:()=>LS.set('favs',S.favs),designs:()=>{if(!LS.set('designs',S.designs))toast('Device storage is full — delete old designs.')},profile:()=>LS.set('profile',S.profile)};

/* ---------- design engine ---------- */
const imgCache={};
const loadImg=src=>imgCache[src]||(imgCache[src]=new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src}));
const svgURL=inner=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="600" height="600">${inner}</svg>`);
const artImage=art=>!art?Promise.resolve(null):(art.kind==='preset'?loadImg(svgURL(A[art.id])):loadImg(art.src));
const geoOf=mm=>({cut:mm/(mm+6),safe:(mm-6)/(mm+6)});
const newModel=(mm,preset)=>({mm,art:preset?{kind:'preset',id:preset}:null,bg:'#ffffff',tx:0,ty:0,scale:1,rot:0,fit:false,texts:[],stickers:[]});
function drawDesign(ctx,S_,m,img,noBg){
  ctx.save();ctx.clearRect(0,0,S_,S_);
  if(!noBg){ctx.fillStyle=m.bg;ctx.fillRect(0,0,S_,S_)}
  if(img){
    const iw=img.naturalWidth||1000,ih=img.naturalHeight||1000;
    const base=m.fit?Math.min(S_/iw,S_/ih):Math.max(S_/iw,S_/ih),sc=base*m.scale;
    ctx.save();ctx.translate(S_/2+m.tx*S_,S_/2+m.ty*S_);ctx.rotate(m.rot*Math.PI/180);ctx.scale(sc,sc);ctx.drawImage(img,-iw/2,-ih/2,iw,ih);ctx.restore();
  }
  ctx.textAlign='center';ctx.textBaseline='middle';
  m.stickers.forEach(s=>{ctx.font=`${s.size*S_}px serif`;ctx.fillText(s.e,s.x*S_,s.y*S_)});
  m.texts.forEach(t=>{
    ctx.font=`800 ${t.size*S_}px ${FONT}`;ctx.lineJoin='round';ctx.lineWidth=t.size*S_*.12;
    ctx.strokeStyle=(t.color==='#ffffff'||t.color==='#FFE08A')?'rgba(35,31,32,.45)':'rgba(255,255,255,.8)';
    ctx.strokeText(t.t,t.x*S_,t.y*S_);ctx.fillStyle=t.color;ctx.fillText(t.t,t.x*S_,t.y*S_);
  });
  ctx.restore();
}
async function renderOut(m){
  const img=await artImage(m.art);const P=720,c=document.createElement('canvas');c.width=c.height=P;
  drawDesign(c.getContext('2d'),P,m,img);
  let q=.86,print=c.toDataURL('image/jpeg',q);while(print.length>230000&&q>.4){q-=.1;print=c.toDataURL('image/jpeg',q)}
  const g=geoOf(m.mm),cut=P*g.cut,off=(P-cut)/2,T_=240,t=document.createElement('canvas');t.width=t.height=T_;
  t.getContext('2d').drawImage(c,off,off,cut,cut,0,0,T_,T_);
  return{print,thumb:t.toDataURL('image/jpeg',.84)};
}
async function runChecks(m){
  const list=[];const img=await artImage(m.art);const g=geoOf(m.mm);
  if(!m.art){return[{s:'er',t:'Add your design first',d:'Upload a photo, logo or artwork, or pick a ready-made design.'}]}
  if(m.art.kind==='upload'){
    const ow=m.art.ow||img.naturalWidth,oh=m.art.oh||img.naturalHeight;
    const iw=img.naturalWidth,ih=img.naturalHeight;
    const base=m.fit?Math.min(1/iw,1/ih):Math.max(1/iw,1/ih);
    const drawnFrac=iw*base*m.scale;
    const mmW=drawnFrac*(m.mm+6);
    const dpi=ow/(mmW/25.4);
    if(dpi<200)list.push({s:'wn',t:'Your image may appear blurry when printed.',d:`Your file is ${ow} × ${oh} px. At this zoom it prints at about ${Math.round(dpi)} dpi; 300 dpi is ideal. Use a larger file or zoom out.`});
    else list.push({s:'ok',t:'Image resolution looks good',d:`${ow} × ${oh} px (about ${Math.min(999,Math.round(dpi))} dpi at this size).`});
  }
  const R=g.safe/2;const near=[];
  const measure=document.createElement('canvas').getContext('2d');
  m.texts.forEach(t=>{measure.font=`800 ${t.size*1000}px ${FONT}`;const w=measure.measureText(t.t).width/1000,h=t.size;
    const cs=[[-w/2,-h/2],[w/2,-h/2],[-w/2,h/2],[w/2,h/2]];if(cs.some(c=>Math.hypot(t.x+c[0]-.5,t.y+c[1]-.5)>R))near.push(`“${t.t}”`)});
  m.stickers.forEach(s=>{if(Math.hypot(s.x-.5,s.y-.5)+s.size*.5>R)near.push(s.e)});
  if(near.length)list.push({s:'wn',t:'Text or artwork is too close to the edge',d:`${near.slice(0,3).join(', ')} may be trimmed. Keep important text and faces inside the safe area.`});
  else list.push({s:'ok',t:'Text and stickers are inside the safe area'});
  const N=120,c=document.createElement('canvas');c.width=c.height=N;const cx=c.getContext('2d');drawDesign(cx,N,m,img,true);
  const px=cx.getImageData(0,0,N,N).data;let tot=0,emp=0;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(Math.hypot(x+.5-N/2,y+.5-N/2)<=N*g.cut/2){tot++;if(px[(y*N+x)*4+3]<20)emp++}}
  const pe=emp/tot;
  if(pe>.08)list.push({s:'wn',t:pe>.5?'Large empty area':'Some areas are empty',d:`About ${Math.round(pe*100)}% of the front shows only the backdrop color. Zoom the image or change to Fill if that is not intended.`});
  else list.push({s:'ok',t:'No empty areas on the front'});
  return list;
}

/* ---------- ui helpers ---------- */
const root=$('#root');
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2400)}
function modal(html,cls=''){const m=$('#modal');m.innerHTML=`<div class="mo ${cls.includes('wide')?'c':''}" data-act="mclose"><div class="sheet ${cls}" role="dialog" aria-modal="true" data-stop="1">${html}</div></div>`}
function closeModal(){$('#modal').innerHTML=''}
function go(view,p={},opts={}){
  if(opts.reset)S.hist=[];else if(!opts.replace&&S.view!==view)S.hist.push({v:S.view,p:S.p});
  S.view=view;S.p=p;closeModal();render(true);
}
function back(){const h=S.hist.pop();S.view=h?h.v:'home';S.p=h?h.p:{};closeModal();render(true)}
const cartCount=()=>S.cart.reduce((s,i)=>s+1,0);
const isFav=id=>S.favs.includes(id);
function topbar(){return `<div class="top"><div class="logo"><span class="lm"></span><b>DeBadger</b><span>Studio</span></div><div class="ics"><button class="ib" data-act="search" aria-label="Search">${ic('search')}</button><button class="ib" data-act="nav" data-v="notif" aria-label="Notifications">${ic('bell',notifCount()?`data-badge="${notifCount()}"`:'')}</button><button class="ib" data-act="nav" data-v="cart" aria-label="Cart">${ic('cart',cartCount()?`data-badge="${cartCount()}"`:'')}</button></div></div>`}
const bk=(title,extra='')=>`<div class="bk"><button class="ib" data-act="back" aria-label="Back">${ic('back')}</button><div class="ttl s f1">${title}</div>${extra}</div>`;
function navHTML(){
  const cur={home:'home',shop:'shop',product:'shop',ready:'shop',designer:'design',qty:'design',preview:'design',cart:'orders',checkout:'orders',confirm:'orders',orders:'orders',track:'orders',account:'account',designs:'account',favs:'account',notif:'account',bulk:'shop'}[S.view];
  return `<nav class="nv" aria-label="Main">${[['home','Home'],['shop','Shop'],['design','Design'],['orders','Orders'],['account','Account']].map(([k,l])=>`<button data-act="tabnav" data-v="${k}" class="${cur===k?'on':''}">${ic(k)}${l}</button>`).join('')}</nav>`;
}
function notifs(){
  const out=[];myOrders().forEach(o=>(o.log||[]).forEach(l=>out.push({t:l.t,msg:l.msg,o})));
  return out.sort((a,b)=>b.t-a.t);
}
function notifCount(){const seen=LS.get('nseen',0);return notifs().filter(n=>n.t>seen).length}

/* ---------- views ---------- */
const V={};
function pcard(o){
  return `<div class="card pc" data-act="${o.act}" ${o.attrs||''}>
    <div class="imgbox" style="height:${o.h||120}px">${o.vis}${o.fav?`<button class="heart ${isFav(o.fav)?'on':''}" data-act="fav" data-id="${o.fav}" aria-label="Favorite">${ic('heart')}</button>`:''}${o.spec?`<span class="spec" style="position:absolute;left:8px;top:8px">${o.spec}</span>`:''}</div>
    <div class="n">${o.name}</div><div class="p">${o.sub||''}</div>${o.price?`<div class="p">${o.price}</div>`:''}${o.btn?`<button class="btn sm w mt8" data-act="${o.act}" ${o.attrs||''}>${o.btn}</button>`:''}</div>`;
}
const priceTxt=p=>`From <b>${peso(p)}</b>`;
V.home=()=>({body:`${topbar()}
<div class="hero"><div class="ht">Custom Pin Badges &amp; Mirror Keychains</div><p>Turn Your Ideas Into Something Special.</p>
<button class="btn" data-act="start" data-p="mirror">Start Designing</button>
<div class="hv"><div style="text-align:center">${KV({p:'pet'},'front',104,-7)}<div class="lb">Custom design front</div></div><span class="pl">+</span><div style="text-align:center">${KV({p:'pet'},'back',104,6)}<div class="lb">Mirror back</div></div><span class="hp">${PV({p:'name'},56)}</span></div></div>
<div class="cats"><button class="cat" data-act="shoptab" data-t="mirror">${ic('sticker')}Mirror Keychains</button><button class="cat" data-act="shoptab" data-t="pin">${ic('pin')}Pin Badges</button><button class="cat" data-act="start" data-p="mirror">${ic('design')}Custom Design</button><button class="cat" data-act="nav" data-v="bulk">${ic('pkg')}Bulk Orders</button></div>
<div class="row sp mb8"><h3 class="ttl s">Featured products</h3><button class="btn t sm" data-act="nav" data-v="shop">See all</button></div>
<div class="hscroll">
${[['mirror','','58 mm Custom Mirror Keychain','pet','mirror'],['pin','','Custom Pin Badge','floral','f-Custom Pin Badge'],['pin','photo','Photo Badge','photo','f-Photo Pin Badge'],['pin','logo','Logo Badge','logo','f-Logo Pin Badge'],['pin','bday','Event Badge','bday','f-Event Pin Badge']].map(([t,pr,n,art,fid])=>`<div style="width:158px;flex:none">${pcard({act:'start',attrs:`data-p="${t}" ${pr?`data-preset="${pr}"`:''} data-name="${esc(n)}"`,vis:t==='mirror'?KV({p:art},'front',72):PV({p:art},76),h:118,name:n,price:priceTxt(fromPrice(t)),btn:'Design Yours',fav:fid})}</div>`).join('')}
</div>
<div class="card row g12 mt8" style="background:var(--pink);color:#fff"><div class="f1"><div class="b">Ordering for a school, church or event?</div><div class="sm" style="opacity:.9">Get a bulk price for 50 pieces or more.</div></div><button class="btn sm" style="background:#fff;color:var(--pink-d)" data-act="nav" data-v="bulk">Get Bulk Price</button></div>`});

V.shop=()=>{
  const t=S.shopTab;
  let body='';
  if(t==='mirror'){
    body=`<div class="card"><div class="imgbox w" style="height:210px"><span style="position:absolute;left:14%;top:14px">${KV({p:'pet'},'front',110,-8)}</span><span style="position:absolute;right:14%;top:24px">${KV({p:'pet'},'back',110,8)}</span><span class="spec" style="position:absolute;left:10px;top:10px">58 mm</span><button class="heart ${isFav('mirror')?'on':''}" data-act="fav" data-id="mirror" aria-label="Favorite">${ic('heart')}</button></div>
    <div class="ttl s mt12">Custom Mirror Keychain</div><div class="mut sm mb8">Your design on the front. Mirror on the back.</div>
    <div class="row sp"><div><span class="mut sm">From </span><b style="font-size:17px">${peso(fromPrice('mirror'))}</b><div class="mut xs">Bulk pricing available</div></div><div class="row g6"><button class="btn o sm" data-act="product" data-t="mirror">Details</button><button class="btn" data-act="start" data-p="mirror">Customize</button></div></div></div>
    <div class="row sp mt16 mb8"><h3 class="ttl s">Also popular: Pin Badges</h3><button class="btn t sm" data-act="shoptab" data-t="pin">See all</button></div>${pinGrid(2)}`;
  }else if(t==='pin'){body=pinGrid(5)}
  else{body=readyBody()}
  return{body:`${topbar()}<h1 class="ttl mb8">Shop</h1><div class="tabs">${[['mirror','Mirror Keychains'],['pin','Pin Badges'],['ready','Ready-Made Designs']].map(([k,l])=>`<button data-act="shoptab" data-t="${k}" class="${t===k?'on':''}">${l}</button>`).join('')}</div>${body}`};
};
const PINITEMS=[['Custom Pin Badge','floral',''],['Photo Pin Badge','photo','photo'],['Logo Pin Badge','logo','logo'],['Event Pin Badge','bday','bday'],['Name Pin Badge','name','name']];
const pinGrid=n=>`<div class="grid2">${PINITEMS.slice(0,n).map(([nm,art,pr])=>pcard({act:'start',attrs:`data-p="pin" ${pr?`data-preset="${pr}"`:''} data-name="${esc(nm)}"`,vis:PV({p:art},74),h:108,name:nm,price:priceTxt(fromPrice('pin')),fav:'f-'+nm})).join('')}</div>`;
function readyBody(){
  const {type,tag}=S.ready;
  const chips=(arr,key)=>arr.map(([k,l])=>`<button class="chip ${S.ready[key]===k?'on':''}" data-act="rfilter" data-k="${key}" data-v="${k}">${l}</button>`).join('');
  const items=PRESETS.filter(p=>(type==='all'||p.type===type)&&(tag==='all'||p.tags.includes(tag)));
  return `<div class="hscroll" style="margin-bottom:0">${chips([['all','All'],['mirror','Mirror Keychains'],['pin','Pin Badges']],'type')}</div>
  <div class="hscroll">${chips([['all','Any style'],['cute','Cute'],['minimal','Minimal'],['events','Events'],['business','Business'],['school','School'],['personalized','Personalized']],'tag')}</div>
  <div class="grid2">${items.map(p=>pcard({act:'start',attrs:`data-p="${p.type}" data-preset="${p.id}" data-name="${esc(p.name)}"`,vis:p.type==='mirror'?KV({p:p.id},'front',68):PV({p:p.id},80),h:126,name:p.name,sub:p.type==='mirror'?'58 mm Mirror Keychain':'Pin Badge',price:`<b>${peso(fromPrice(p.type))}</b>`,fav:'r-'+p.id})).join('')||'<div class="mut">No designs match. Try another filter.</div>'}</div>`;
}
V.ready=()=>({body:`${bk('Ready-Made Designs')}${readyBody()}`});

V.product=()=>{
  const t=S.p.t||'mirror';
  if(t==='pin'){
    return{body:`${bk('Custom Pin Badge')}<div class="imgbox w" style="height:220px">${PV({p:'floral'},150)}</div>
    <div class="ttl mt12">Custom Pin Badge</div><p class="mut">Printed front with a pin back. Choose a size in the designer.</p>
    ${activePins().map(s=>`<div class="sumr"><span>${esc(s.label)} · ${s.mm} mm</span><b>from ${peso(s.price[0])}</b></div>`).join('')}<div class="row g6 wrap mt8"><span class="chip pk">Bulk pricing available</span><span class="chip pk">Custom artwork</span></div>`,
    ft:`<button class="btn f" data-act="start" data-p="pin">Customize Yours</button>`};
  }
  const g=S.gal,imgs=[KV({p:'pet'},'front',150,-4),KV({p:'pet'},'back',150,4),sideSvg,ringSvg];
  return{body:`${bk('Custom Mirror Keychain',`<button class="ib" data-act="fav" data-id="mirror" aria-label="Favorite">${ic('heart',isFav('mirror')?'style="color:var(--pink)"':'')}</button>`)}
  <div class="imgbox w" style="height:240px">${imgs[g]}<span class="spec" style="position:absolute;left:10px;top:10px">${['Front','Mirror back','Side','Keyring'][g]}</span></div>
  <div class="row g6 mt8">${imgs.map((_,i)=>`<button data-act="gal" data-i="${i}" class="imgbox" style="flex:1;height:64px;border:2px solid ${g===i?'var(--pink)':'transparent'};cursor:pointer;padding:0">${[KV({p:'pet'},'front',34,0,'n'),KV({p:'pet'},'back',34,0,'n'),sideSvg.replace('width="150" height="70"','width="46" height="24"'),ringSvg.replace('width="70" height="120"','width="26" height="44"')][i]}</button>`).join('')}</div>
  <div class="ttl mt12" style="font-size:20px">Custom Mirror Keychain — 58 mm</div>
  <p class="mut">Create a personalized 58 mm mirror keychain with your own design printed on the front and a functional mirror on the back.</p>
  <div class="card"><div class="sumr"><span class="mut">Diameter</span><b>58 mm</b></div><div class="hr"></div><div class="sumr"><span class="mut">Front</span><b>Custom printed design</b></div><div class="hr"></div><div class="sumr"><span class="mut">Back</span><b>Functional mirror</b></div><div class="hr"></div><div class="sumr"><span class="mut">Attachment</span><b>Metal keyring</b></div></div>
  <div class="row g6 wrap mt12"><span class="chip pk">Bulk pricing available</span><span class="chip pk">Custom artwork</span><span class="chip pk">Mirror back</span><span class="chip pk">Quality printing</span></div>
  <div class="mt12"><span class="mut">From </span><b style="font-size:20px">${peso(fromPrice('mirror'))}</b> <span class="mut">each</span></div>`,
  ft:`<button class="btn o ib2" style="width:48px;padding:0" data-act="fav" data-id="mirror" aria-label="Add to Favorites">${ic('heart')}</button><button class="btn f" data-act="start" data-p="mirror">Customize Yours</button>`};
};

/* ---------- designer ---------- */
const ED={};
V.designer=()=>{
  const d=S.draft;if(!d){return{body:'',mount:()=>startDesign('mirror')}}
  const mirror=d.product==='mirror';
  return{body:`${bk(mirror?'Customize Your Mirror Keychain':'Customize Your Pin Badge')}
  <div class="steps"><div class="on">1 Design</div><div>2 Quantity</div><div>3 Preview</div></div>
  <div class="row sp mb8"><div class="b">${mirror?'Custom Mirror Keychain':'Custom Pin Badge'} ${mirror?'<span class="spec">58 mm</span>':''}</div>
   ${mirror?`<span class="row g6 mut xs b">${KV({p:'pet'},'back',20,0,'n')}Back: Mirror ${ic('lock','style="width:13px;height:13px"')}</span>`:`<span class="mut xs b">Front + pin back</span>`}</div>
  ${mirror?'':`<div class="row g6 wrap mb8" id="sizes">${activePins().map(s=>`<button class="chip ${s.id===d.sizeId?'on':''}" data-act="psize" data-id="${s.id}">${esc(s.label)} · ${s.mm} mm</button>`).join('')}</div>`}
  <div class="card" style="padding:12px 12px 8px"><div class="mut xs b" style="text-align:center;margin-bottom:6px">Front · Your design</div>
    <div class="cvbox" id="cvbox"><canvas id="cv" aria-label="Design canvas. Drag to move, pinch to zoom."></canvas><svg class="gd" id="gd" viewBox="0 0 100 100"></svg><div class="empty" id="empty"></div></div>
    <div class="row g6 wrap mt8" style="justify-content:center"><span class="pill warn">Bleed</span><span class="pill gr">Cut edge</span><span class="pill pk">Safe area</span><button class="chip" style="height:26px;font-size:11px" data-act="guides" id="gbtn">Hide guides</button></div>
    <div class="mut xs mt4" style="text-align:center">Keep important text and faces inside the safe area.</div></div>
  <div class="row g8 mt12"><label class="btn f" style="cursor:pointer" for="f1">${ic('plus')}Upload Your Design</label></div>
  <div class="row g6 mt8"><label class="chip f1" style="justify-content:center;cursor:pointer" for="f1">${ic('image')}Photo Library</label><label class="chip f1" style="justify-content:center;cursor:pointer" for="f2">${ic('camera')}Camera</label><label class="chip f1" style="justify-content:center;cursor:pointer" for="f3">${ic('file')}Files</label></div>
  <input type="file" id="f1" accept="image/*" hidden><input type="file" id="f2" accept="image/*" capture="environment" hidden><input type="file" id="f3" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" hidden>
  <div class="tools" id="tabs"></div><div id="panel"></div>`,
  ft:`<button class="btn o" data-act="resetdesign">Reset Design</button><button class="btn f" data-act="check">Check My Design</button>`,mount:mountEditor};
};
function startDesign(product,o={}){
  const sizes=activePins();const sizeId=o.sizeId||(sizes[0]&&sizes[0].id)||'s';
  const mm=product==='mirror'?58:pinOf(sizeId).mm;
  S.draft={product,sizeId,name:o.name||'',qty:o.qty||(product==='mirror'?10:25),m:newModel(mm,o.preset),out:null,designId:null,cartId:null};
  S.gal=0;go('designer',{},{})
}
function mountEditor(){
  const d=S.draft,m=d.m;
  Object.assign(ED,{panel:'photo',sel:null,guides:true,ptr:new Map(),img:null});
  const cv=$('#cv'),box=$('#cvbox'),dpr=Math.min(2,window.devicePixelRatio||1);
  const size=Math.round(box.clientWidth||300);cv.width=cv.height=Math.round(size*dpr);ED.size=size;
  ED.cv=cv;ED.ctx=cv.getContext('2d');
  ED.draw=()=>{drawDesign(ED.ctx,cv.width,m,ED.img);$('#empty').innerHTML=m.art?`<div class="empty-state"></div>`:`${ic('image','style="width:34px;height:34px"')}<div>Upload a photo, logo or artwork to begin</div>`};
  ED.guideSvg=()=>{const g=geoOf(m.mm);$('#gd').innerHTML=ED.guides?`<path d="M0 0h100v100H0zM50 ${50-50*g.cut}a${50*g.cut} ${50*g.cut} 0 1 0 .01 0z" fill="rgba(255,255,255,.62)" fill-rule="evenodd"/><circle cx="50" cy="50" r="49.4" fill="none" stroke="#E8A03A" stroke-width=".7" stroke-dasharray="2 1.5"/><circle cx="50" cy="50" r="${50*g.cut}" fill="none" stroke="#231F20" stroke-width=".55"/><circle cx="50" cy="50" r="${50*g.safe}" fill="none" stroke="#E4505A" stroke-width=".7" stroke-dasharray="2.4 1.6"/>`:'';const b=$('#gbtn');if(b)b.textContent=ED.guides?'Hide guides':'Show guides'};
  ED.tabs=()=>{$('#tabs').innerHTML=[['photo','image','Photo'],['text','text','Text'],['stick','sticker','Stickers'],['bgc','bg','Backdrop']].map(([k,i,l])=>`<button data-act="etab" data-k="${k}" class="${ED.panel===k?'on':''}">${ic(i)}${l}</button>`).join('')};
  ED.render=()=>{ED.tabs();$('#panel').innerHTML=panelHTML()};
  ED.change=()=>{ED.draw();const z=$('#zoom'),r=$('#rot');if(z)z.value=m.scale;if(r)r.value=m.rot};
  artImage(m.art).then(i=>{ED.img=i;ED.draw()}).catch(()=>{});
  ED.guideSvg();ED.draw();ED.render();
  const pos=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}};
  const hit=p=>{
    const meas=ED.ctx;
    for(let i=m.stickers.length-1;i>=0;i--){const s=m.stickers[i];if(Math.abs(p.x-s.x)<s.size*.6&&Math.abs(p.y-s.y)<s.size*.6)return{k:'stickers',o:s}}
    for(let i=m.texts.length-1;i>=0;i--){const t=m.texts[i];meas.font=`800 ${t.size*1000}px ${FONT}`;const w=meas.measureText(t.t).width/1000;if(Math.abs(p.x-t.x)<w/2+.02&&Math.abs(p.y-t.y)<t.size*.65)return{k:'texts',o:t}}
    return null;
  };
  cv.addEventListener('pointerdown',e=>{
    cv.setPointerCapture(e.pointerId);const p=pos(e);ED.ptr.set(e.pointerId,p);
    if(ED.ptr.size===1){const h=hit(p);ED.sel=h;ED.drag=h?h.o:null;if(h){ED.panel=h.k==='texts'?'text':'stick';ED.render()}else if(ED.panel==='text'){ED.render()}}
    if(ED.ptr.size===2){const [a,b]=[...ED.ptr.values()];ED.d0=Math.hypot(a.x-b.x,a.y-b.y);ED.a0=Math.atan2(b.y-a.y,b.x-a.x);ED.s0=ED.sel?ED.sel.o.size:m.scale;ED.r0=m.rot}
    cv.style.cursor='grabbing';
  });
  cv.addEventListener('pointermove',e=>{
    if(!ED.ptr.has(e.pointerId))return;const p=pos(e),prev=ED.ptr.get(e.pointerId);ED.ptr.set(e.pointerId,p);
    if(ED.ptr.size===1){const dx=p.x-prev.x,dy=p.y-prev.y;if(ED.drag){ED.drag.x+=dx;ED.drag.y+=dy}else{m.tx+=dx;m.ty+=dy}}
    else if(ED.ptr.size===2){const [a,b]=[...ED.ptr.values()];const dist=Math.hypot(a.x-b.x,a.y-b.y),ang=Math.atan2(b.y-a.y,b.x-a.x),k=dist/(ED.d0||1);
      if(ED.sel){ED.sel.o.size=Math.max(.05,Math.min(.6,ED.s0*k))}else{m.scale=Math.max(.3,Math.min(5,ED.s0*k));m.rot=Math.round(((ED.r0+(ang-ED.a0)*180/Math.PI+540)%360)-180)}}
    ED.change();
  });
  const up=e=>{ED.ptr.delete(e.pointerId);if(ED.ptr.size===0){ED.drag=null;cv.style.cursor='grab'}};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();m.scale=Math.max(.3,Math.min(5,m.scale*(e.deltaY<0?1.06:.94)));ED.change()},{passive:false});
  ['f1','f2','f3'].forEach(id=>$('#'+id).addEventListener('change',e=>{ingest(e.target.files[0]);e.target.value=''}));
}
async function ingest(file){
  if(!file)return;const m=S.draft.m;
  try{
    const url=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)});
    const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
    const ow=img.naturalWidth||1000,oh=img.naturalHeight||1000,k=Math.min(1,1400/Math.max(ow,oh)),c=document.createElement('canvas');
    c.width=Math.max(1,Math.round(ow*k));c.height=Math.max(1,Math.round(oh*k));
    const cx=c.getContext('2d');const keepAlpha=/png|svg|webp|gif/.test(file.type);
    if(!keepAlpha){cx.fillStyle='#fff';cx.fillRect(0,0,c.width,c.height)}
    cx.drawImage(img,0,0,c.width,c.height);
    let src=keepAlpha?c.toDataURL('image/png'):c.toDataURL('image/jpeg',.86);
    if(keepAlpha&&src.length>1000000){const c2=document.createElement('canvas');c2.width=c.width;c2.height=c.height;const x2=c2.getContext('2d');x2.fillStyle='#fff';x2.fillRect(0,0,c.width,c.height);x2.drawImage(c,0,0);src=c2.toDataURL('image/jpeg',.86)}
    m.art={kind:'upload',src,ow:file.type==='image/svg+xml'?Math.max(ow,2000):ow,oh};
    Object.assign(m,{tx:0,ty:0,scale:1,rot:0,fit:false});
    ED.img=await artImage(m.art);ED.draw();ED.render();toast('Design uploaded');
  }catch(e){toast('That file could not be opened. Try a JPG or PNG.')}
}
const SWATCH=['#ffffff','#FFE9EA','#FFD9D2','#FFE08A','#CDE8D6','#CFE3FF','#E4505A','#231F20'];
const TXTC=['#231F20','#ffffff','#E4505A','#FFE08A','#3F9E6E','#2F5DA8'];
function panelHTML(){
  const m=S.draft.m,p=ED.panel;
  if(p==='photo')return `<div class="card"><div class="row sp"><b class="sm">Zoom</b><span class="mut xs">Pinch or scroll on the canvas</span></div><input id="zoom" type="range" min=".3" max="5" step=".01" value="${m.scale}" data-in="zoom" aria-label="Zoom">
   <div class="row sp"><b class="sm">Rotate</b><span class="mut xs">Two-finger twist also works</span></div><input id="rot" type="range" min="-180" max="180" step="1" value="${m.rot}" data-in="rot" aria-label="Rotate">
   <div class="row g6 mt8"><button class="chip f1" style="justify-content:center" data-act="fitfill">${ic('crop')}${m.fit?'Fit inside':'Fill (crop)'}</button><button class="chip f1" style="justify-content:center" data-act="center">${ic('move')}Center</button><button class="chip" data-act="rot90">${ic('rotate')}90°</button></div></div>`;
  if(p==='text'){
    const s=ED.sel&&ED.sel.k==='texts'?ED.sel.o:null;
    if(s)return `<div class="card"><label class="lab" style="margin-top:0" for="tt">Edit text</label><input id="tt" class="in" value="${esc(s.t)}" maxlength="24" data-in="ttext">
      <div class="lab">Color</div><div class="sw">${TXTC.map(c=>`<button style="background:${c}" class="${s.color===c?'on':''}" data-act="tcolor" data-c="${c}" aria-label="Text color ${c}"></button>`).join('')}</div>
      <div class="lab">Size</div><input type="range" min=".06" max=".4" step=".005" value="${s.size}" data-in="tsize" aria-label="Text size">
      <div class="row g8 mt8"><button class="btn o sm f" data-act="tdone">Done</button><button class="btn g sm" data-act="tdel">${ic('trash')}Delete</button></div></div>`;
    return `<div class="card"><label class="lab" style="margin-top:0" for="tn">Add text</label><div class="row g8"><input id="tn" class="in" placeholder="Name, event, message…" maxlength="24"><button class="btn" data-act="tadd">Add</button></div><div class="mut xs mt8">Drag text on the canvas to place it. Tap it to edit.</div></div>`;
  }
  if(p==='stick')return `<div class="card"><div class="emo">${['⭐','❤️','🌸','🎉','🐾','🎓','✨','🌈','🦋','🍀','🎂','☕'].map(e=>`<button data-act="sadd" data-e="${e}" aria-label="Add sticker ${e}">${e}</button>`).join('')}</div>${ED.sel&&ED.sel.k==='stickers'?`<button class="btn g sm mt8" data-act="sdel">${ic('trash')}Remove selected sticker</button>`:'<div class="mut xs mt8">Drag stickers to place them. Pinch to resize.</div>'}</div>`;
  return `<div class="card"><div class="lab" style="margin-top:0">Backdrop color</div><div class="sw">${SWATCH.map(c=>`<button style="background:${c}" class="${m.bg===c?'on':''}" data-act="bgc" data-c="${c}" aria-label="Backdrop ${c}"></button>`).join('')}<label class="chip" style="height:34px" title="Custom color">Custom<input type="color" value="${m.bg}" data-in="bgcolor" style="width:22px;height:22px;border:0;padding:0;background:none"></label></div><div class="mut xs mt8">Shows behind the image and in any empty areas.</div></div>`;
}
async function openChecks(){
  const m=S.draft.m;const list=await runChecks(m);
  const bad=list.some(x=>x.s==='er'),warn=list.some(x=>x.s==='wn');
  modal(`<div class="ttl s mb8">Check your design</div>
   ${list.map(x=>`<div class="chk ${x.s}">${ic(x.s==='ok'?'check':x.s==='wn'?'warn':'x')}<div><b>${esc(x.t)}</b>${x.d?`<small>${esc(x.d)}</small>`:''}</div></div>`).join('')}
   <div class="mut xs mt12 mb8">This check is a guide. A screen preview cannot promise exact print results, so colors and cropping can differ slightly.</div>
   <div class="row g8">${warn||bad?`<button class="btn o f" data-act="replace">Replace Image</button>`:`<button class="btn o f" data-act="mclose2">Keep Editing</button>`}${bad?'':`<button class="btn f" data-act="finish">${warn?'Continue Anyway':'Continue'}</button>`}</div>`);
}
async function finishDesign(){
  const d=S.draft;closeModal();toast('Preparing print file…');
  try{d.out=await renderOut(d.m);}catch(e){toast('Could not prepare the design');return}
  go('qty');
}

/* ---------- quantity / preview ---------- */
function qtyBody(){
  const d=S.draft,q=d.qty,pr=priceOf(d.product,d.sizeId,q),t=cfg().tiers;
  const nxt=t[pr.tier+1];
  return `<div class="ttl s mb8">Save more when you order in bulk.</div>
  <div class="col g6">${t.map((x,i)=>`<div class="tier ${i===pr.tier?'on':''}"><span>${rangeLabel(i)}${i===pr.tier?'<small>You are here</small>':''}</span><span style="text-align:right">${i===0?'Regular price':esc(x.label)}<small>${peso(d.product==='mirror'?cfg().mirror.price[i]:pinOf(d.sizeId).price[i])} each</small></span></div>`).join('')}</div>
  ${nxt?`<div class="pill pk mt8">Add ${nxt.min-q} more to reach ${esc(nxt.label)}</div>`:'<div class="pill ok mt8">Best bulk price applied</div>'}
  ${pr.promo?'<div class="pill warn mt8" style="margin-left:6px">Promotional price applied</div>':''}
  <div class="card mt12"><div class="sumr"><span class="mut">Unit price</span><span>${peso(pr.unit)}</span></div><div class="sumr"><span class="mut">Quantity</span><span>${q}</span></div><div class="sumr"><span class="mut">Discount</span><span style="color:var(--green)">−${peso(pr.discount)}</span></div><div class="sumr t"><span>Subtotal</span><span>${peso(pr.subtotal)}</span></div></div>`;
}
V.qty=()=>{
  const d=S.draft;if(!d||!d.out)return{body:'',mount:()=>go('designer',{},{replace:true})};
  const mirror=d.product==='mirror';
  return{body:`${bk('Choose Quantity')}<div class="steps"><div class="on">1 Design</div><div class="on">2 Quantity</div><div>3 Preview</div></div>
  <div class="card row g12"><div class="imgbox" style="width:74px;height:74px;flex:none">${mirror?KV({u:d.out.thumb},'front',38,0,'n'):PV({u:d.out.thumb},52,'front','n')}</div><div><div class="b">${mirror?'58 mm Custom Mirror Keychain':`Custom Pin Badge`}</div><div class="mut sm">${mirror?'Custom printed front · Mirror back':'Printed front · Pin back'}</div></div></div>
  <div class="lab">Size</div>
  ${mirror?`<div class="lock"><span>58 mm — fixed</span>${ic('lock')}</div>`:`<div class="row g6 wrap">${activePins().map(s=>`<button class="chip ${s.id===d.sizeId?'on':''}" data-act="qsize" data-id="${s.id}">${esc(s.label)} · ${s.mm} mm</button>`).join('')}</div>`}
  <div class="lab mt12">Quantity</div>
  <div class="qty"><button class="qb" data-act="qty" data-d="-1" aria-label="Decrease">${ic('minus')}</button><input class="qin" id="qin" inputmode="numeric" value="${d.qty}" data-in="qty" aria-label="Quantity"><button class="qb" data-act="qty" data-d="1" aria-label="Increase">${ic('plus')}</button></div>
  <div class="mut xs mb8" style="text-align:center;margin-top:4px">Tap the number to type any quantity</div>
  <div id="qbody">${qtyBody()}</div>`,
  ft:`<button class="btn w" data-act="toPreview">Continue to Preview</button>`};
};
function updQty(){const b=$('#qbody');if(b)b.innerHTML=qtyBody()}
V.preview=()=>{
  const d=S.draft;if(!d||!d.out)return{body:'',mount:()=>go('designer',{},{replace:true})};
  const mirror=d.product==='mirror',side=S.prevSide,pr=priceOf(d.product,d.sizeId,d.qty);
  const f={u:d.out.thumb};
  return{body:`${bk('Preview Your '+(mirror?'Keychain':'Badge'))}<div class="steps"><div class="on">1 Design</div><div class="on">2 Quantity</div><div class="on">3 Preview</div></div>
  <div class="toggle mb8"><button class="${side==='front'?'on':''}" data-act="pside" data-s="front">Front view</button><button class="${side==='back'?'on':''}" data-act="pside" data-s="back">${mirror?'Mirror back':'Pin back'}</button></div>
  <div class="imgbox w" style="height:300px">${mirror?KV(f,side,170,side==='front'?-3:3):PV(f,190,side)}</div>
  <div class="mut xs mb8" style="text-align:center;margin-top:6px">${side==='back'&&mirror?'The back is always a plain reflective mirror.':'Digital preview. Printed colors may vary slightly.'}</div>
  <div class="card"><div class="sumr"><b>${itemLabel(d.product,d.sizeId)}</b></div><div class="sumr"><span class="mut">Quantity</span><span>${d.qty}</span></div><div class="sumr"><span class="mut">Unit price</span><span>${peso(pr.unit)}</span></div><div class="sumr"><span class="mut">Discount</span><span style="color:var(--green)">−${peso(pr.discount)}</span></div><div class="sumr t"><span>Subtotal</span><span>${peso(pr.subtotal)}</span></div></div>`,
  ft:`<button class="btn o sm" data-act="editdesign">Edit Design</button><button class="btn g sm" data-act="savedesign">Save Design</button><button class="btn f" data-act="addcart">Add to Cart</button>`};
};
function saveDesignModal(after){
  const d=S.draft;modal(`<div class="ttl s mb8">Save this design</div><label class="lab" for="dn" style="margin-top:0">Design name</label><input id="dn" class="in" value="${esc(d.name||'')}" placeholder="e.g. Birthday 2026" maxlength="40"><div class="row g8 mt12"><button class="btn o f" data-act="mclose2">Cancel</button><button class="btn f" data-act="dosave" data-after="${after||''}">Save</button></div>`);
  setTimeout(()=>{const i=$('#dn');if(i)i.focus()},50);
}
function commitDesign(name){
  const d=S.draft;d.name=name||d.name||'My design';
  const rec={id:d.designId||'ds'+uid(),name:d.name,product:d.product,sizeId:d.sizeId,m:clone(d.m),thumb:d.out.thumb,qty:d.qty,at:Date.now()};
  const i=S.designs.findIndex(x=>x.id===rec.id);if(i>=0)S.designs[i]=rec;else S.designs.unshift(rec);
  d.designId=rec.id;persist.designs();return rec;
}
function addToCart(){
  const d=S.draft;const item={id:d.cartId||'c'+uid(),product:d.product,sizeId:d.sizeId,qty:d.qty,m:clone(d.m),thumb:d.out.thumb,name:d.name,dk:d.designId||null};
  const i=S.cart.findIndex(x=>x.id===item.id);if(i>=0)S.cart[i]=item;else S.cart.push(item);
  if(!LS.set('cart',S.cart)){S.cart.pop();toast('Device storage is full. Remove an item and try again.');return false}
  return true;
}

/* ---------- cart / checkout ---------- */
const cartTotals=()=>{
  let sub=0,disc=0;const rows=S.cart.map(i=>{const p=priceOf(i.product,i.sizeId,i.qty);sub+=p.subtotal;disc+=p.discount;return{i,p}});
  return{rows,sub,disc};
};
V.cart=()=>{
  const {rows,sub,disc}=cartTotals();
  const later=S.later.length?`<div class="ttl s mt16 mb8">Saved for later</div>${S.later.map(i=>`<div class="card row g12 mb8"><div class="imgbox" style="width:56px;height:56px;flex:none">${i.product==='mirror'?KV({u:i.thumb},'front',30,0,'n'):PV({u:i.thumb},42,'front','n')}</div><div class="f1"><div class="b sm">${itemLabel(i.product,i.sizeId)}</div><div class="mut xs">Qty ${i.qty}</div></div><button class="btn sm g" data-act="movecart" data-id="${i.id}">Move to cart</button></div>`).join('')}`:'';
  if(!rows.length)return{body:`${bk('Your Cart')}<div class="card" style="text-align:center;padding:30px 16px"><div class="ttl s">Your cart is empty</div><p class="mut">Design a mirror keychain or pin badge to get started.</p><button class="btn" data-act="start" data-p="mirror">Start Designing</button></div>${later}`};
  return{body:`${bk('Your Cart',`<span class="mut b">${rows.length} item${rows.length>1?'s':''}</span>`)}
  ${rows.map(({i,p})=>`<div class="card mb8"><div class="row g12"><div class="imgbox" style="width:76px;height:76px;flex:none">${i.product==='mirror'?KV({u:i.thumb},'front',40,0,'n'):PV({u:i.thumb},56,'front','n')}</div><div class="f1"><div class="b">${i.product==='mirror'?'Custom Mirror Keychain':'Custom Pin Badge'}</div><div class="mut xs">${i.product==='mirror'?'58 mm':esc(pinOf(i.sizeId).label)+' · '+pinOf(i.sizeId).mm+' mm'} · Custom Design${i.name?' · '+esc(i.name):''}</div><div class="b mt4">${peso(p.subtotal)}</div><div class="mut xs">${peso(p.unit)} each${p.discount?' · bulk pricing applied':''}</div></div></div>
   <div class="row sp mt8"><div class="qty" style="gap:10px"><button class="qb s" data-act="cqty" data-id="${i.id}" data-d="-1" aria-label="Decrease">${ic('minus')}</button><b style="font:800 17px var(--d);min-width:34px;text-align:center">${i.qty}</b><button class="qb s" data-act="cqty" data-id="${i.id}" data-d="1" aria-label="Increase">${ic('plus')}</button></div>
   <div class="row g4"><button class="btn t sm" data-act="cedit" data-id="${i.id}">Edit Design</button><button class="btn t sm" data-act="clater" data-id="${i.id}">Save for Later</button><button class="btn t sm" data-act="cdel" data-id="${i.id}">Remove</button></div></div></div>`).join('')}
  <label class="lab" for="note">Add a note for your order</label><textarea id="note" class="in" data-in="note" placeholder="Special request, deadline, packaging instructions, etc.">${esc(S.note)}</textarea>
  <div class="card mt12"><div class="sumr"><span class="mut">Subtotal</span><span>${peso(sub+disc)}</span></div><div class="sumr"><span class="mut">Discount</span><span style="color:var(--green)">−${peso(disc)}</span></div><div class="sumr"><span class="mut">Shipping</span><span class="mut">At checkout</span></div><div class="sumr t"><span>Total</span><span>${peso(sub)}</span></div></div>${later}`,
  ft:`<button class="btn w" data-act="tocheckout">Proceed to Checkout</button>`};
};
const F=k=>S.form[k]!==undefined?S.form[k]:(S.profile[k]||'');
function checkoutCalc(){
  const {sub,disc}=cartTotals();const sh=cfg().shipping.find(x=>x.id===S.form.ship);const fee=sh?Number(sh.fee):0;
  let off=0,pts=0;
  if(S.form.redeem!==undefined&&cfg().loyalty.on){const r=cfg().loyalty.rewards[S.form.redeem];if(r&&myPoints()>=r.pts){off=Math.min(r.off,sub);pts=r.pts}}
  return{sub,disc,fee,off,pts,total:Math.max(0,sub-off)+fee,sh};
}
V.checkout=()=>{
  if(!S.cart.length)return{body:'',mount:()=>go('cart',{},{replace:true})};
  const ships=cfg().shipping.filter(x=>x.on),pays=cfg().pay.filter(x=>x.on);
  if(!S.form.ship||!ships.find(x=>x.id===S.form.ship))S.form.ship=ships[0]&&ships[0].id;
  if(!S.form.pay||!pays.find(x=>x.id===S.form.pay))S.form.pay=pays[0]&&pays[0].id;
  const c=checkoutCalc(),pick=c.sh&&c.sh.id==='pick',E=S.err;
  const fld=(k,label,type='text',ph='')=>`<div><label class="lab" for="f-${k}">${label}</label><input id="f-${k}" class="in ${E[k]?'err':''}" type="${type}" data-f="${k}" value="${esc(F(k))}" placeholder="${ph}" autocomplete="on">${E[k]?`<div class="errt">${E[k]}</div>`:''}</div>`;
  const pts=myPoints(),L=cfg().loyalty;
  return{body:`${bk('Checkout')}
  <div class="ttl s mt4">Customer information</div>${fld('name','Full Name')}<div class="g2">${fld('phone','Phone Number','tel')}${fld('email','Email','email')}</div>
  <div class="ttl s mt16">Shipping</div><div class="col g6 mt8">${ships.map(x=>`<button class="opt ${S.form.ship===x.id?'on':''}" data-act="ship" data-id="${x.id}"><i class="rd"></i><span class="f1">${esc(x.label)}<small>${esc(x.note||'')}</small></span><b>${Number(x.fee)?peso(x.fee):'Free'}</b></button>`).join('')||'<div class="mut">No shipping options are available right now.</div>'}</div>
  ${pick?`<div class="pinfo mt8">Pickup at the studio. We will message you when your order is ready.</div>`:`<div class="ttl s mt16">Delivery information</div>${fld('street','Street / Barangay')}<div class="g2">${fld('city','City / Municipality')}${fld('prov','Province')}</div>${fld('zip','Postal Code','text')}`}
  <div class="ttl s mt16">Payment</div><div class="col g6 mt8">${pays.map(x=>`<button class="opt ${S.form.pay===x.id?'on':''}" data-act="pay" data-id="${x.id}"><i class="rd"></i><span class="f1">${esc(x.label)}</span></button>`).join('')||'<div class="mut">No payment methods are available right now.</div>'}</div>${E.pay?`<div class="errt">${E.pay}</div>`:''}
  ${L.on&&pts>0?`<div class="ttl s mt16">Loyalty rewards <span class="pill pk">${pts} pts</span></div><div class="col g6 mt8">${L.rewards.map((r,i)=>pts>=r.pts?`<button class="opt ${S.form.redeem===i?'on':''}" data-act="redeem" data-i="${i}"><i class="rd"></i><span class="f1">Use ${r.pts} pts<small>${peso(r.off)} off this order</small></span></button>`:'').join('')}</div>`:''}
  <div class="ttl s mt16">Order summary</div>
  <div class="card mt8">${S.cart.map(i=>{const p=priceOf(i.product,i.sizeId,i.qty);return `<div class="row g8 mb8"><div class="imgbox" style="width:44px;height:44px;flex:none">${i.product==='mirror'?KV({u:i.thumb},'front',24,0,'n'):PV({u:i.thumb},34,'front','n')}</div><div class="f1 sm"><b>${itemLabel(i.product,i.sizeId)}</b><div class="mut xs">${i.qty} × ${peso(p.unit)}</div></div><b class="sm">${peso(p.subtotal)}</b></div>`}).join('')}
  <div class="hr"></div><div class="sumr"><span class="mut">Discount</span><span style="color:var(--green)">−${peso(c.disc)}</span></div>${c.off?`<div class="sumr"><span class="mut">Loyalty reward</span><span style="color:var(--green)">−${peso(c.off)}</span></div>`:''}<div class="sumr"><span class="mut">Shipping</span><span>${c.fee?peso(c.fee):'Free'}</span></div><div class="sumr t"><span>Total</span><span>${peso(c.total)}</span></div></div>`,
  ft:`<button class="btn w" data-act="place" ${S.placing?'disabled':''}>${S.placing?'Placing order…':`Place Order · ${peso(c.total)}`}</button>`};
};
async function placeOrder(){
  if(S.placing)return;
  const c=checkoutCalc(),pick=c.sh&&c.sh.id==='pick',e={};
  const v=k=>String(F(k)).trim();
  if(!v('name'))e.name='Enter your full name';
  if(!/^[0-9+()\-\s]{7,}$/.test(v('phone')))e.phone='Enter a phone number';
  if(!/^\S+@\S+\.\S+$/.test(v('email')))e.email='Enter a valid email';
  if(!pick){if(!v('street'))e.street='Enter your street or barangay';if(!v('city'))e.city='Enter your city';if(!v('prov'))e.prov='Enter your province'}
  if(!S.form.pay)e.pay='Choose a payment method';
  if(!c.sh)e.ship='x';
  S.err=e;if(Object.keys(e).length){render();toast('Please complete the highlighted fields');return}
  S.placing=true;render();
  try{
    const id=orderCode(),now=Date.now(),{rows}=cartTotals(),items=[];
    for(let n=0;n<rows.length;n++){
      const {i,p}=rows[n],out=await renderOut(i.m);
      await putArt(id+'_'+n,out.print);
      let dk=i.dk;
      if(!dk||!S.designs.find(x=>x.id===dk)){const rec={id:'ds'+uid(),name:i.name||`Order ${id}${rows.length>1?' #'+(n+1):''}`,product:i.product,sizeId:i.sizeId,m:clone(i.m),thumb:out.thumb,qty:i.qty,at:now};S.designs.unshift(rec);dk=rec.id}
      items.push({product:i.product,label:itemLabel(i.product,i.sizeId),sizeMm:i.product==='mirror'?58:pinOf(i.sizeId).mm,qty:i.qty,unit:p.unit,regular:p.regular,discount:p.discount,subtotal:p.subtotal,thumb:out.thumb,name:i.name||'',dk,art:id+'_'+n});
    }
    persist.designs();
    const pay=cfg().pay.find(x=>x.id===S.form.pay);
    const L=cfg().loyalty;
    const o={id,ownerKey:DEV,createdAt:now,customer:{name:v('name'),phone:v('phone'),email:v('email')},
      delivery:pick?null:{street:v('street'),city:v('city'),prov:v('prov'),zip:v('zip')},pickup:!!pick,ship:{id:c.sh.id,label:c.sh.label,fee:c.fee},
      payment:{id:pay.id,label:pay.label,status:PAYST[0],info:pay.info||''},items,note:S.note.trim(),internal:'',
      subtotal:c.sub+c.disc,discount:c.disc,redeem:c.off,redeemedPts:c.pts,total:c.total,stage:2,seen:false,consumed:false,pointsAwarded:0,
      log:[{t:now,msg:MSG[0]},{t:now+1,msg:MSG[1]}]};
    await saveOrder(o);
    Object.assign(S.profile,{name:o.customer.name,phone:o.customer.phone,email:o.customer.email},o.delivery||{});persist.profile();
    S.cart=[];persist.cart();S.note='';S.form={};S.err={};S.placing=false;
    go('confirm',{id},{reset:true});
  }catch(err){S.placing=false;render();toast('Something went wrong. Please try again.')}
}
V.confirm=()=>{
  const o=store.orders[S.p.id];if(!o)return{body:'',mount:()=>go('home',{},{reset:true})};
  return{body:`<div style="text-align:center;padding-top:22px"><div style="width:84px;height:84px;border-radius:50%;background:var(--green-l);display:grid;place-items:center;margin:0 auto 14px"><div style="width:58px;height:58px;border-radius:50%;background:var(--green);color:#fff;display:grid;place-items:center">${ic('check','style="width:32px;height:32px"')}</div></div>
  <h1 class="ttl">Order Successfully Placed!</h1><p class="mut">We received your order and your design.</p></div>
  <div class="card mt12"><div class="row g12 mb8"><div class="imgbox" style="width:60px;height:60px;flex:none">${o.items[0].product==='mirror'?KV({u:o.items[0].thumb},'front',32,0,'n'):PV({u:o.items[0].thumb},44,'front','n')}</div><div><div class="mut xs">Order number</div><div class="ttl s">${o.id}</div></div></div><div class="hr"></div>
  <div class="sumr"><span class="mut">Product</span><b style="text-align:right">${esc(orderSummary(o))}</b></div><div class="sumr"><span class="mut">Quantity</span><b>${orderQty(o)}</b></div><div class="sumr"><span class="mut">Total</span><b>${peso(o.total)}</b></div><div class="sumr"><span class="mut">Delivery method</span><b>${esc(o.ship.label)}</b></div><div class="sumr"><span class="mut">Payment status</span><span class="pill warn">${o.payment.status}</span></div></div>
  <div class="pinfo mt12"><b>${esc(o.payment.label)}:</b> ${esc(o.payment.info)} Use <b>${o.id}</b> as your reference.</div>`,
  ft:`<div class="col g8" style="width:100%"><button class="btn w" data-act="track" data-id="${o.id}">Track My Order</button><div class="row g8"><button class="btn o f" data-act="track" data-id="${o.id}">View Order</button><button class="btn g f" data-act="nav" data-v="shop">Continue Shopping</button></div></div>`};
};
V.orders=()=>{
  const list=myOrders(),tab=S.p.tab||'active';
  const shown=list.filter(o=>tab==='active'?o.stage<9:o.stage>=9);
  return{body:`${topbar()}<h1 class="ttl mb8">Orders</h1><div class="tabs"><button class="${tab==='active'?'on':''}" data-act="otab" data-t="active">In progress</button><button class="${tab==='done'?'on':''}" data-act="otab" data-t="done">Completed</button></div>
  ${shown.map(o=>`<div class="card mb8"><div class="row g12" data-act="track" data-id="${o.id}" style="cursor:pointer"><div class="imgbox" style="width:64px;height:64px;flex:none">${o.items[0].product==='mirror'?KV({u:o.items[0].thumb},'front',34,0,'n'):PV({u:o.items[0].thumb},48,'front','n')}</div><div class="f1"><div class="row sp"><b>${o.id}</b><span class="pill ${pillFor(o)}">${stepLabel(o,o.stage)}</span></div><div class="mut xs">${esc(orderSummary(o))}</div><div class="mut xs">${fmtDate(o.createdAt)} · Qty ${orderQty(o)} · ${peso(o.total)}</div></div></div>
  <div class="row g8 mt8"><button class="btn sm f" data-act="track" data-id="${o.id}">Track Order</button><button class="btn sm o f" data-act="reorder" data-id="${o.id}">Order Again</button></div></div>`).join('')||`<div class="card" style="text-align:center;padding:26px"><div class="ttl s">${tab==='active'?'No orders in progress':'No completed orders yet'}</div><p class="mut">Your orders and their production progress appear here.</p><button class="btn" data-act="start" data-p="mirror">Start Designing</button></div>`}`};
};
V.track=()=>{
  const o=store.orders[S.p.id];if(!o)return{body:`${bk('Order Tracking')}<div class="card">Order not found.</div>`};
  const steps=stepsOf(o);
  return{body:`${bk('Order Tracking')}
  <div class="card"><div class="row g12"><div class="imgbox" style="width:72px;height:72px;flex:none">${o.items[0].product==='mirror'?KV({u:o.items[0].thumb},'front',38,0,'n'):PV({u:o.items[0].thumb},54,'front','n')}</div><div class="f1 sm"><div class="ttl s">${o.id}</div><div class="mut">Ordered ${fmtDate(o.createdAt)} · Qty ${orderQty(o)}</div><div class="mut">${esc(o.ship.label)}</div><span class="pill ${o.payment.status==='Paid'?'ok':'warn'} mt4">${o.payment.status}</span></div></div></div>
  <div class="card row g12 mt8" style="background:var(--pink);color:#fff">${ic('design','style="width:24px;height:24px"')}<div><div class="xs" style="opacity:.85">Current stage</div><div class="b" style="font-size:17px">${stepLabel(o,o.stage)} — ${o.stage>=9?'Done':'In Progress'}</div></div></div>
  <div class="tl mt16">${steps.map(i=>`<div class="s ${i<o.stage?'d':i===o.stage?'c':''}">${stepLabel(o,i)}${i===o.stage?`<small>${esc(stepMsg(o,i))}</small>`:''}</div>`).join('')}</div>
  ${o.payment.status==='Awaiting payment'?`<div class="pinfo"><b>${esc(o.payment.label)}:</b> ${esc(o.payment.info)} Use <b>${o.id}</b> as your reference.</div>`:''}
  <div class="card mt12"><div class="ttl s mb8">Items</div>${o.items.map(i=>`<div class="sumr"><span>${esc(i.label)} × ${i.qty}</span><b>${peso(i.subtotal)}</b></div>`).join('')}<div class="hr"></div><div class="sumr t"><span>Total</span><span>${peso(o.total)}</span></div></div>
  <button class="btn o w mt12" data-act="reorder" data-id="${o.id}">Order Again</button>`};
};
V.notif=()=>{
  LS.set('nseen',Date.now());const list=notifs();
  return{body:`${bk('Notifications')}${list.map(n=>`<div class="card row g12 mb8"><div class="imgbox" style="width:40px;height:40px;flex:none;color:var(--pink)">${ic('bell')}</div><div class="f1"><div class="b sm">${esc(n.msg)}</div><div class="mut xs">${n.o.id} · ${fmtTime(n.t)}</div></div></div>`).join('')||'<div class="card" style="text-align:center;padding:26px"><div class="ttl s">No notifications yet</div><p class="mut">Order updates show up here.</p></div>'}`};
};

/* ---------- account ---------- */
V.account=()=>{
  const p=S.profile,pts=myPoints(),L=cfg().loyalty;
  const initials=(p.name||'You').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const isAdminOK=store.user===null||store.user?.is_anonymous||store.adminOK!==false;
  return{body:`${topbar()}<h1 class="ttl mb8">Account</h1>
  <div class="card row g12"><div style="width:52px;height:52px;border-radius:50%;background:var(--pink-l);color:var(--pink-d);display:grid;place-items:center;font:800 18px var(--d)">${esc(initials)}</div><div class="f1"><div class="b">${esc(p.name||'Guest')}</div><div class="mut sm">${myOrders().length} orders${p.phone?' · '+esc(p.phone):''}</div></div>${L.on?`<span class="pill pk">${ic('star','style="width:12px;height:12px"')}${pts} pts</span>`:''}</div>
  <div class="row sp mt16 mb8"><h3 class="ttl s">My Designs</h3><button class="btn t sm" data-act="nav" data-v="designs">See all</button></div>
  ${S.designs.slice(0,3).map(designRow).join('')||'<div class="card mut sm">Designs you save or order appear here, ready to order again.</div>'}
  <div class="menu mt16">
   <button data-act="nav" data-v="orders">${ic('orders')}My Orders</button><button data-act="nav" data-v="designs">${ic('design')}Saved Designs</button>
   <button data-act="nav" data-v="favs">${ic('heart')}Favorites</button><button data-act="modal" data-m="profile">${ic('pin')}Address Book</button>
   <button data-act="modal" data-m="paymethods">${ic('card')}Payment Methods</button><button data-act="modal" data-m="loyalty">${ic('gift')}Loyalty Rewards</button>
   <button data-act="nav" data-v="notif">${ic('bell')}Notifications</button><button data-act="modal" data-m="help">${ic('help')}Help &amp; Support</button>
   <button data-act="nav" data-v="bulk">${ic('pkg')}Bulk Orders</button><button data-act="modal" data-m="logout">${ic('out')}Clear My Data</button>
   ${isAdminOK?`<button data-act="admin" style="grid-column:1/-1;background:#2A2324;color:#fff">${ic('gear','style="color:#fff"')}Owner console</button>`:''}
  </div>`};
};
function designRow(d){
  return `<div class="card mb8"><div class="row g12"><div class="imgbox" style="width:60px;height:60px;flex:none">${d.product==='mirror'?KV({u:d.thumb},'front',32,0,'n'):PV({u:d.thumb},46,'front','n')}</div><div class="f1"><div class="b sm">${esc(d.name)}</div><div class="mut xs">${d.product==='mirror'?'58 mm Mirror Keychain':'Pin Badge · '+esc(pinOf(d.sizeId).label)+' '+pinOf(d.sizeId).mm+' mm'}</div></div><button class="btn sm" data-act="dorder" data-id="${d.id}">Order Again</button></div>
  <div class="row g4 mt8"><button class="btn t sm" data-act="dview" data-id="${d.id}">${ic('eye')}View</button><button class="btn t sm" data-act="dedit" data-id="${d.id}">${ic('design')}Edit</button><button class="btn t sm" data-act="ddup" data-id="${d.id}">${ic('copy')}Duplicate</button><button class="btn t sm" data-act="ddel" data-id="${d.id}">${ic('trash')}</button></div></div>`;
}
V.designs=()=>({body:`${bk('My Designs')}${S.designs.map(designRow).join('')||'<div class="card" style="text-align:center;padding:26px"><div class="ttl s">No saved designs</div><p class="mut">Save a design from the preview screen and it will show up here.</p><button class="btn" data-act="start" data-p="mirror">Start Designing</button></div>'}`});
V.favs=()=>{
  const items=[];
  S.favs.forEach(id=>{if(id==='mirror')items.push(pcard({act:'product',attrs:'data-t="mirror"',vis:KV({p:'pet'},'front',64),name:'Custom Mirror Keychain',spec:'58 mm',price:priceTxt(fromPrice('mirror')),fav:'mirror'}));
    else if(id.startsWith('f-')){const it=PINITEMS.find(x=>'f-'+x[0]===id);if(it)items.push(pcard({act:'start',attrs:`data-p="pin" ${it[2]?`data-preset="${it[2]}"`:''} data-name="${esc(it[0])}"`,vis:PV({p:it[1]},70),name:it[0],price:priceTxt(fromPrice('pin')),fav:id}))}
    else if(id.startsWith('r-')){const p=PRESETS.find(x=>'r-'+x.id===id);if(p)items.push(pcard({act:'start',attrs:`data-p="${p.type}" data-preset="${p.id}" data-name="${esc(p.name)}"`,vis:p.type==='mirror'?KV({p:p.id},'front',64):PV({p:p.id},74),name:p.name,sub:p.type==='mirror'?'58 mm Mirror Keychain':'Pin Badge',price:`<b>${peso(fromPrice(p.type))}</b>`,fav:id}))}});
  return{body:`${bk('Favorites')}${items.length?`<div class="grid2">${items.join('')}</div>`:'<div class="card" style="text-align:center;padding:26px"><div class="ttl s">No favorites yet</div><p class="mut">Tap the heart on any product to save it here.</p></div>'}`};
};
V.bulk=()=>{
  const E=S.err,B=S.form.bulk||{};
  const f=(k,label,type='text',ph='')=>`<div><label class="lab" for="b-${k}">${label}</label><input id="b-${k}" class="in ${E['b'+k]?'err':''}" type="${type}" data-b="${k}" value="${esc(B[k]!==undefined?B[k]:(k==='name'?S.profile.name:k==='phone'?S.profile.phone:k==='email'?S.profile.email:''))}" placeholder="${ph}">${E['b'+k]?`<div class="errt">${E['b'+k]}</div>`:''}</div>`;
  const prod=B.product||'mirror';
  return{body:`${bk('Bulk & Business Orders')}
  <div class="card" style="background:var(--pink-l);box-shadow:none"><b>Ordering for your business, school, organization or event?</b><div class="mut sm mt4">Tell us what you need and we will send you a bulk price.</div></div>
  <div class="lab">Product</div>
  <div class="row g6 mb8"><button class="chip ${prod==='mirror'?'on':''}" data-act="bprod" data-p="mirror">Mirror Keychain</button><button class="chip ${prod==='pin'?'on':''}" data-act="bprod" data-p="pin">Pin Badge</button></div>
  ${prod==='mirror'?`<div class="lock"><span class="row g8">${KV({p:'pet'},'front',18,0,'n')}58 mm Mirror Keychain</span>${ic('lock')}</div>`:`<div class="row g6 wrap">${activePins().map(s=>`<button class="chip ${(B.size||activePins()[0].id)===s.id?'on':''}" data-act="bsize" data-id="${s.id}">${esc(s.label)} · ${s.mm} mm</button>`).join('')}</div>`}
  <div class="g2">${f('qty','Quantity','number','e.g. 250')}${f('need','Needed by','date')}</div>
  <div class="lab">Design upload</div><label class="dz" for="bf">${B.file?`${ic('check','style="width:18px;height:18px"')} ${esc(B.fileName||'Design attached')}`:`${ic('plus','style="width:18px;height:18px"')} Upload logo or artwork`}</label><input type="file" id="bf" accept="image/*" hidden>
  <div class="g2">${f('name','Your name')}${f('org','Organization / Business')}</div><div class="g2">${f('phone','Phone Number','tel')}${f('email','Email','email')}</div>
  <label class="lab" for="b-notes">Special instructions</label><textarea id="b-notes" class="in" data-b="notes" placeholder="Packaging, colors, delivery schedule…">${esc(B.notes||'')}</textarea>`,
  ft:`<button class="btn w" data-act="sendbulk">Get Bulk Price</button>`};
};

/* ---------- owner console ---------- */
const startOfDay=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d.getTime()};
function customers(){
  const map={};
  allOrders().forEach(o=>{const k=(o.customer.phone||o.customer.email||o.id).toLowerCase();const c=map[k]||(map[k]={name:o.customer.name,phone:o.customer.phone,email:o.customer.email,n:0,total:0,latest:0,designs:0});
    c.n++;c.total+=o.total;c.latest=Math.max(c.latest,o.createdAt);c.designs+=o.items.length});
  return Object.values(map).sort((a,b)=>b.latest-a.latest);
}
const ANAV=[['dash','home','Dashboard'],['orders','orders','Orders'],['pricing','card','Pricing'],['inv','pkg','Inventory'],['cust','users','Customers'],['rep','chart','Reports'],['loy','star','Loyalty'],['set','gear','Settings']];
function adminShell(){
  const pg=S.adminPage;let body='';
  if(!store.user||store.user.is_anonymous||store.adminOK!==true)body=`<div class="apg"><div class="card"><b>Owner access only</b><p class="mut">Sign in with an authorized owner account to open the console.</p></div></div>`;
  else body=`<div class="apg">${({dash:aDash,orders:aOrders,pricing:aPricing,inv:aInv,cust:aCust,rep:aRep,loy:aLoy,set:aSet})[pg]()}</div>`;
  return `<div class="ahd"><div class="logo"><span class="lm"></span><b>DeBadger</b><span>Owner console</span></div><span class="pill ${sb?'ok':'warn'}">${sb?'Supabase data':'This device only'}</span><span class="f1"></span>${sb?`<button class="btn sm" style="background:#fff;color:var(--pink-d)" data-act="requestAlerts">${ic('bell')}Enable alerts</button>`:''}<button class="btn sm" style="background:#fff;color:var(--pink-d)" data-act="exitadmin">Back to shop</button></div>
  <div class="anav">${ANAV.map(([k,i,l])=>`<button data-act="apage" data-k="${k}" class="${pg===k?'on':''}">${ic(i)}${l}</button>`).join('')}</div>${body}`;
}
function statusCounts(){
  const os=allOrders(),t0=startOfDay(Date.now()),m0=new Date();m0.setDate(1);m0.setHours(0,0,0,0);
  const sum=a=>a.reduce((s,o)=>s+o.total,0);
  const paid=os.filter(isPaid);
  return{today:os.filter(o=>o.createdAt>=t0).length,fresh:os.filter(o=>!o.seen).length,review:os.filter(o=>o.stage===2).length,prod:os.filter(o=>o.stage>=3&&o.stage<=6).length,ready:os.filter(o=>o.stage===7).length,shipped:os.filter(o=>o.stage===8).length,ts:sum(paid.filter(o=>o.createdAt>=t0)),ms:sum(paid.filter(o=>o.createdAt>=m0.getTime()))};
}
function ordersTable(list){
  return `<div class="tblw"><table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Design</th><th>Qty</th><th>Size</th><th>Ordered</th><th>Needed by</th><th>Payment</th><th>Production</th><th>Delivery</th><th></th></tr></thead><tbody>
  ${list.map(o=>{const it=o.items[0];return `<tr class="clk" data-act="aorder" data-id="${o.id}"><td><b>${o.id}</b>${o.seen?'':' <span class="pill pk">New</span>'}</td><td>${esc(o.customer.name)}</td><td>${esc(o.items.length>1?it.product==='mirror'?'Mirror Keychain +'+(o.items.length-1):'Pin Badge +'+(o.items.length-1):it.product==='mirror'?'Mirror Keychain':'Pin Badge')}</td><td>${it.product==='mirror'?KV({u:it.thumb},'front',26,0,'n'):PV({u:it.thumb},34,'front','n')}</td><td>${orderQty(o)}</td><td><b>${o.items.length>1?'Mixed':it.sizeMm+' mm'}</b></td><td>${fmtDate(o.createdAt)}</td><td>${esc(o.neededBy||'—')}</td><td><span class="pill ${o.payment.status==='Paid'?'ok':o.payment.status==='Refunded'?'gr':'warn'}">${o.payment.status}</span></td><td><span class="pill ${pillFor(o)}">${stepLabel(o,o.stage)}</span></td><td>${deliveryStatus(o)}</td><td><span class="chip" style="height:28px">View</span></td></tr>`}).join('')||'<tr><td colspan="12" class="mut" style="padding:26px;text-align:center">No orders yet. Orders placed in the app appear here.</td></tr>'}
  </tbody></table></div>`;
}
function aDash(){
  const c=statusCounts(),os=allOrders();
  return `<div class="ttl">Dashboard</div><div class="stats">
  <div class="stat hl"><small>Today’s orders</small><b>${c.today}</b></div><div class="stat"><small>New orders</small><b>${c.fresh}</b></div><div class="stat am"><small>Artwork to review</small><b>${c.review}</b></div><div class="stat"><small>In production</small><b>${c.prod}</b></div>
  <div class="stat"><small>Ready for pickup</small><b>${c.ready}</b></div><div class="stat"><small>Shipped</small><b>${c.shipped}</b></div><div class="stat"><small>Today’s sales</small><b>${peso(c.ts)}</b></div><div class="stat"><small>Monthly sales</small><b>${peso(c.ms)}</b></div></div>
  <div class="ttl s mb8">Recent orders</div>${ordersTable(os.slice(0,8))}`;
}
function aOrders(){
  const q=S.aq.toLowerCase(),f=S.afilter;
  let list=allOrders().filter(o=>(!q||(o.id+o.customer.name+o.customer.phone).toLowerCase().includes(q)));
  const fl={all:()=>true,review:o=>o.stage===2,prod:o=>o.stage>=3&&o.stage<=6,ready:o=>o.stage===7,shipped:o=>o.stage===8,done:o=>o.stage>=9,unpaid:o=>o.payment.status==='Awaiting payment'};
  list=list.filter(fl[f]);
  const bulk=Object.values(store.bulk).sort((a,b)=>b.at-a.at);
  return `<div class="row sp wrap g8"><div class="ttl">Orders</div><div class="row g8"><input class="ai" style="width:220px" placeholder="Search order, name or phone" value="${esc(S.aq)}" data-in="aq" aria-label="Search orders"><button class="btn sm o" data-act="exportcsv">${ic('dl')}Export CSV</button></div></div>
  <div class="row g6 wrap mt12 mb8">${[['all','All'],['unpaid','Unpaid'],['review','Artwork review'],['prod','In production'],['ready','Ready'],['shipped','Shipped'],['done','Completed']].map(([k,l])=>`<button class="chip ${f===k?'on':''}" data-act="afilter" data-k="${k}">${l}</button>`).join('')}</div>
  ${ordersTable(list)}
  <div class="ttl s mt16 mb8">Bulk price requests</div><div class="tblw"><table class="tbl" style="min-width:720px"><thead><tr><th>Received</th><th>Contact</th><th>Organization</th><th>Product</th><th>Qty</th><th>Needed by</th><th>Notes</th><th>Status</th></tr></thead><tbody>
  ${bulk.map(b=>`<tr><td>${fmtDate(b.at)}</td><td>${esc(b.name)}<div class="mut xs">${esc(b.phone)} · ${esc(b.email)}</div></td><td>${esc(b.org||'—')}</td><td>${esc(b.productLabel)}${b.file?`<div><img src="${b.file}" alt="Attached design" style="width:38px;height:38px;object-fit:cover;border-radius:8px;margin-top:4px"></div>`:''}</td><td><b>${esc(b.qty)}</b></td><td>${esc(b.need||'—')}</td><td style="white-space:normal;max-width:220px">${esc(b.notes||'')}</td><td><button class="chip ${b.quoted?'on':''}" data-act="bquote" data-id="${b.id}">${b.quoted?'Quoted':'Mark quoted'}</button></td></tr>`).join('')||'<tr><td colspan="8" class="mut" style="padding:20px;text-align:center">No bulk requests yet.</td></tr>'}</tbody></table></div>`;
}
const numIn=(v,attrs)=>`<input class="ai n" type="number" min="0" step="0.01" value="${v}" ${attrs}>`;
function aPricing(){
  const c=cfg();
  const priceRows=(arr,path)=>c.tiers.map((t,i)=>`<div class="ak"><span class="f1">${rangeLabel(i)}<div class="mut xs">${i===0?'Regular price':esc(t.label)}</div></span>${numIn(arr[i],`data-cfg="${path}.${i}" aria-label="Price ${rangeLabel(i)}"`)}</div>`).join('');
  return `<div class="ttl">Pricing</div><p class="mut">Changes apply to new quotes and carts immediately. Prices shown here are starter values — set your own.</p>
  <div class="two"><div class="acard"><h3>Mirror Keychain</h3><div class="ak"><b>58 mm Mirror Keychain</b><span class="pill gr">${ic('lock','style="width:11px;height:11px"')}Size 58 mm · locked</span></div>
  <div class="ak"><span>Base price (1 piece)</span><b>${peso(c.mirror.price[0])}</b></div>${priceRows(c.mirror.price,'mirror.price')}
  <div class="ak"><span class="f1">Promotional price<div class="mut xs">Overrides tier prices when lower</div></span><span class="row g8"><button class="switch ${c.mirror.promo.on?'on':''}" data-act="cfgtoggle" data-path="mirror.promo.on" aria-label="Promotional price on"></button>${numIn(c.mirror.promo.price,'data-cfg="mirror.promo.price"')}</span></div></div>
  <div class="acard"><h3>Quantity ranges</h3>${c.tiers.map((t,i)=>`<div class="ak"><input class="ai" style="max-width:190px" value="${esc(t.label)}" data-cfg="tiers.${i}.label" aria-label="Tier name"><span class="row g8"><span class="mut xs">starts at</span><input class="ai n" type="number" min="1" step="1" value="${t.min}" ${i===0?'disabled':''} data-cfg="tiers.${i}.min" aria-label="Tier starts at"></span></div>`).join('')}<div class="mut xs mt8">First tier always starts at 1. Keep tiers in ascending order.</div></div></div>
  <div class="acard"><h3>Pin badge sizes</h3>${c.pins.map((s,pi)=>`<div class="acard" style="background:var(--bg);box-shadow:none;padding:12px"><div class="row sp wrap g8"><div class="row g8"><input class="ai" style="width:130px" value="${esc(s.label)}" data-cfg="pins.${pi}.label" aria-label="Size name"><span class="row g4"><input class="ai n" style="width:80px" type="number" min="10" value="${s.mm}" data-cfg="pins.${pi}.mm" aria-label="Size in mm"><span class="mut">mm</span></span></div><div class="row g8"><span class="mut sm">Offered</span><button class="switch ${s.on?'on':''}" data-act="cfgtoggle" data-path="pins.${pi}.on" aria-label="Offer this size"></button></div></div>
  <div class="row g8 wrap mt8">${c.tiers.map((t,i)=>`<label class="sm mut">${rangeLabel(i)}<br>${numIn(s.price[i],`data-cfg="pins.${pi}.price.${i}" style="width:96px"`)}</label>`).join('')}</div></div>`).join('')}<button class="btn o sm" data-act="addpin">${ic('plus')}Add pin size</button></div>`;
}
function invStatus(i){return i.stock<=0?['rd','Out of stock']:i.stock<=i.low?['warn','Low stock']:['ok','In stock']}
function aInv(){
  return `<div class="ttl">Inventory</div><p class="mut">Stock is deducted automatically when an order moves to Assembly.</p><div class="tblw"><table class="tbl" style="min-width:640px"><thead><tr><th>Item</th><th>Current stock</th><th>Low-stock level</th><th>Status</th><th>Restock quantity</th></tr></thead><tbody>
  ${cfg().inv.map((i,n)=>{const [k,l]=invStatus(i);return `<tr><td><b>${esc(i.name)}</b></td><td><b>${i.stock}</b></td><td><input class="ai n" type="number" min="0" value="${i.low}" data-cfg="inv.${n}.low" aria-label="Low level"></td><td><span class="pill ${k}">${l}</span></td><td><span class="row g6"><input class="ai n" id="rs${n}" type="number" min="0" value="100" aria-label="Restock amount"><button class="btn sm" data-act="restock" data-n="${n}">Add</button></span></td></tr>`}).join('')}</tbody></table></div>`;
}
function aCust(){
  const q=S.aq.toLowerCase(),list=customers().filter(c=>!q||(c.name+c.phone+c.email).toLowerCase().includes(q));
  return `<div class="row sp wrap g8"><div class="ttl">Customers</div><input class="ai" style="width:240px" placeholder="Search name, phone or email" value="${esc(S.aq)}" data-in="aqc" aria-label="Search customers"></div><div class="tblw mt12"><table class="tbl" style="min-width:680px"><thead><tr><th>Name</th><th>Contact number</th><th>Email</th><th>Orders</th><th>Total purchased</th><th>Saved designs</th><th>Latest order</th></tr></thead><tbody>
  ${list.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.phone)}</td><td>${esc(c.email)}</td><td>${c.n}</td><td>${peso(c.total)}</td><td>${c.designs}</td><td>${fmtDate(c.latest)}</td></tr>`).join('')||'<tr><td colspan="7" class="mut" style="padding:24px;text-align:center">No customers yet.</td></tr>'}</tbody></table></div>`;
}
function series(mode){
  const os=allOrders().filter(isPaid),out=[];const now=new Date();
  const n=mode==='day'?7:mode==='week'?8:6;
  for(let i=n-1;i>=0;i--){
    let a,b,label;
    if(mode==='day'){a=new Date(now);a.setHours(0,0,0,0);a.setDate(a.getDate()-i);b=new Date(a);b.setDate(b.getDate()+1);label=a.toLocaleDateString('en-PH',{weekday:'short'})}
    else if(mode==='week'){b=new Date(now);b.setHours(0,0,0,0);b.setDate(b.getDate()+1-i*7);a=new Date(b);a.setDate(a.getDate()-7);label=a.toLocaleDateString('en-PH',{month:'short',day:'numeric'})}
    else{a=new Date(now.getFullYear(),now.getMonth()-i,1);b=new Date(now.getFullYear(),now.getMonth()-i+1,1);label=a.toLocaleDateString('en-PH',{month:'short'})}
    out.push({label,v:os.filter(o=>o.createdAt>=a.getTime()&&o.createdAt<b.getTime()).reduce((s,o)=>s+o.total,0)});
  }
  return out;
}
function aRep(){
  const os=allOrders().filter(isPaid),sr=series(S.rep),max=Math.max(1,...sr.map(x=>x.v));
  const pcs=p=>os.reduce((s,o)=>s+o.items.filter(i=>i.product===p).reduce((a,i)=>a+i.qty,0),0);
  const totalQty=os.reduce((s,o)=>s+orderQty(o),0),bulk=os.filter(o=>orderQty(o)>=50).length;
  const cs=customers(),rep=cs.filter(c=>c.n>1).length;
  const bw=520/sr.length;
  return `<div class="row sp wrap g8"><div class="ttl">Sales reports</div><div class="row g6">${[['day','Daily'],['week','Weekly'],['month','Monthly']].map(([k,l])=>`<button class="chip ${S.rep===k?'on':''}" data-act="rep" data-k="${k}">${l}</button>`).join('')}</div></div>
  <div class="acard mt12"><h3>${S.rep==='day'?'Last 7 days':S.rep==='week'?'Last 8 weeks':'Last 6 months'}</h3><div style="overflow-x:auto"><svg viewBox="0 0 540 190" width="100%" style="min-width:420px" role="img" aria-label="Sales chart">${sr.map((x,i)=>{const h=Math.round(x.v/max*130);return `<rect x="${10+i*bw+bw*.14}" y="${150-h}" width="${bw*.72}" height="${Math.max(2,h)}" rx="6" fill="${i===sr.length-1?'#E4505A':'#FFC9CD'}"/><text x="${10+i*bw+bw/2}" y="172" text-anchor="middle" font-size="11" fill="#7A6F70" font-family="Figtree,sans-serif">${esc(x.label)}</text>${x.v?`<text x="${10+i*bw+bw/2}" y="${144-h}" text-anchor="middle" font-size="10" fill="#231F20" font-family="Figtree,sans-serif" font-weight="700">${Math.round(x.v).toLocaleString()}</text>`:''}`}).join('')}</svg></div></div>
  <div class="stats"><div class="stat"><small>Mirror keychains sold</small><b>${pcs('mirror').toLocaleString()}</b></div><div class="stat"><small>Pin badges sold</small><b>${pcs('pin').toLocaleString()}</b></div><div class="stat"><small>Average order quantity</small><b>${os.length?Math.round(totalQty/os.length):0}</b></div><div class="stat"><small>Bulk orders (50+)</small><b>${bulk}</b></div><div class="stat"><small>Repeat customers</small><b>${rep}${cs.length?` <span class="mut sm">of ${cs.length}</span>`:''}</b></div><div class="stat"><small>Orders</small><b>${os.length}</b></div></div>`;
}
function aLoy(){
  const L=cfg().loyalty;
  return `<div class="ttl">Loyalty program</div><div class="acard mt12" style="max-width:640px"><div class="ak"><span>Enable loyalty program</span><button class="switch ${L.on?'on':''}" data-act="cfgtoggle" data-path="loyalty.on" aria-label="Enable loyalty"></button></div>
  <div class="ak"><span class="f1">Points earned<div class="mut xs">1 point for every ₱ spent, awarded when an order is completed</div></span><input class="ai n" type="number" min="1" value="${L.per}" data-cfg="loyalty.per" aria-label="Pesos per point"></div>
  ${L.rewards.map((r,i)=>`<div class="ak"><span class="f1">Reward ${i+1}<div class="mut xs">Points needed → ₱ discount</div></span><span class="row g8"><input class="ai n" type="number" min="1" value="${r.pts}" data-cfg="loyalty.rewards.${i}.pts" aria-label="Points needed"><span class="mut">→</span><input class="ai n" type="number" min="1" value="${r.off}" data-cfg="loyalty.rewards.${i}.off" aria-label="Discount"></span></div>`).join('')}
  <button class="btn o sm mt8" data-act="addreward">${ic('plus')}Add reward level</button></div>`;
}
function aSet(){
  const c=cfg();
  return `<div class="ttl">Settings</div><p class="mut">Choose what customers see at checkout.</p><div class="two"><div class="acard"><h3>Shipping options</h3>${c.shipping.map((s,i)=>`<div class="ak"><span class="f1"><input class="ai" value="${esc(s.label)}" data-cfg="shipping.${i}.label" aria-label="Shipping name"></span><input class="ai n" style="width:84px" type="number" min="0" value="${s.fee}" data-cfg="shipping.${i}.fee" aria-label="Fee"><button class="switch ${s.on?'on':''}" data-act="cfgtoggle" data-path="shipping.${i}.on" aria-label="Offer ${esc(s.label)}"></button></div>`).join('')}</div>
  <div class="acard"><h3>Payment methods</h3>${c.pay.map((s,i)=>`<div class="ak"><span class="f1"><b>${esc(s.label)}</b><input class="ai mt4" value="${esc(s.info||'')}" data-cfg="pay.${i}.info" aria-label="Payment instructions" placeholder="Instructions shown to the customer"></span><button class="switch ${s.on?'on':''}" data-act="cfgtoggle" data-path="pay.${i}.on" aria-label="Accept ${esc(s.label)}"></button></div>`).join('')}</div></div>`;
}
async function openOrder(id){
  const o=store.orders[id];if(!o)return;
  if(!o.seen){o.seen=true;saveOrder(o)}
  const arts=await Promise.all(o.items.map(i=>getArt(i.art)));
  const stagesBtns=stepsOf(o).filter(i=>i>=2).map(i=>`<button class="chip ${o.stage===i?'on':''}" data-act="astage" data-id="${o.id}" data-i="${i}">${stepLabel(o,i)}</button>`).join('');
  modal(`<div class="row sp"><div class="ttl">${o.id}</div><button class="ib" data-act="mclose2" aria-label="Close">${ic('x')}</button></div>
  <div class="two mt8"><div><div class="ttl s mb8">Customer</div><div class="card sm"><b>${esc(o.customer.name)}</b><div>${esc(o.customer.phone)}</div><div>${esc(o.customer.email)}</div><div class="hr"></div>${o.pickup?'<b>Pickup</b>':`<b>${esc(o.ship.label)}</b><div>${esc(o.delivery.street)}, ${esc(o.delivery.city)}, ${esc(o.delivery.prov)} ${esc(o.delivery.zip||'')}</div>`}</div>
   <div class="ttl s mt12 mb8">Customer note</div><div class="card sm">${esc(o.note||'No note')}</div>
   <label class="lab" for="inote">Internal note</label><textarea id="inote" class="in" data-in="inote" data-id="${o.id}" placeholder="Only you can see this">${esc(o.internal||'')}</textarea></div>
  <div><div class="ttl s mb8">Uploaded artwork and print preview</div>${o.items.map((i,n)=>`<div class="card mb8"><div class="row g12"><div class="imgbox w" style="width:110px;height:110px;flex:none">${arts[n]?`<img src="${arts[n]}" alt="Print file" style="width:100%;height:100%;object-fit:cover">`:'<span class="mut xs">No file</span>'}</div><div class="imgbox w" style="width:110px;height:110px;flex:none">${i.product==='mirror'?KV({u:i.thumb},'front',54,0,'n'):PV({u:i.thumb},80,'front','n')}</div></div>
   <div class="sm mt8"><b>${esc(i.label)}</b> × ${i.qty}<div class="mut">Size ${i.sizeMm} mm${i.product==='mirror'?' (locked)':''} · ${peso(i.unit)} each · ${peso(i.subtotal)}</div></div>${arts[n]?`<button class="btn o sm mt8" data-act="dlart" data-id="${o.id}" data-n="${n}">${ic('dl')}Download print file</button>`:''}</div>`).join('')}
   <div class="sumr t"><span>Total</span><span>${peso(o.total)}</span></div></div></div>
  <div class="ttl s mt12 mb8">Payment</div><div class="row g6 wrap">${PAYST.map(p=>`<button class="chip ${o.payment.status===p?'on':''}" data-act="apay" data-id="${o.id}" data-p="${p}">${p}</button>`).join('')}<span class="mut sm" style="align-self:center">via ${esc(o.payment.label)}</span></div>
  <div class="ttl s mt12 mb8">Production status</div><div class="row g6 wrap">${stagesBtns}</div>
  <div class="row g8 mt12"><button class="btn f" data-act="anext" data-id="${o.id}" ${o.stage>=9?'disabled':''}>Move to next stage</button></div>`,'wide');
}
async function setStage(id,i){
  const o=clone(store.orders[id]);if(!o)return;i=Number(i);
  if(i===o.stage)return;
  if(i>=5&&!isPaid(o)){toast('Mark the payment as Paid before moving this order to Assembly');return}
  const now=Date.now();
  if(i>o.stage){for(let k=o.stage+1;k<=i;k++){if(o.pickup&&k===8)continue;o.log.push({t:now+k,msg:stepMsg(o,k)})}}
  o.stage=i;
  if(i>=5&&!o.consumed){o.consumed=true;o.items.forEach(it=>{cfg().inv.forEach(inv=>{if(inv.use[it.product])inv.stock=Math.max(0,inv.stock-inv.use[it.product]*it.qty)})});await saveCfg()}
  if(i>=9&&!o.pointsAwarded&&cfg().loyalty.on)o.pointsAwarded=Math.floor(o.total/Math.max(1,cfg().loyalty.per));
  await saveOrder(o);render();openOrder(id);
}

/* ---------- actions ---------- */
function setPath(obj,path,val){const k=path.split('.');let o=obj;for(let i=0;i<k.length-1;i++)o=o[k[i]];o[k[k.length-1]]=val}
function getPath(obj,path){return path.split('.').reduce((o,k)=>o[k],obj)}
const A_={
  nav:d=>go(d.v,{},{}),
  tabnav:d=>{const v=d.v;if(v==='design'){startDesign('mirror');S.hist=[];return}go(v,{},{reset:true})},
  back:()=>back(),
  search:()=>{modal(`<div class="row g8"><input class="in" id="sq" placeholder="Search products and designs" data-in="sq" aria-label="Search"><button class="ib" data-act="mclose2" aria-label="Close">${ic('x')}</button></div><div id="sres" class="mt12 col g6"></div>`);setTimeout(()=>{$('#sq').focus();searchRes('')},40)},
  start:d=>{const p=d.p||'mirror';startDesign(p,{preset:d.preset||undefined,name:d.name||''})},
  shoptab:d=>{S.shopTab=d.t;go('shop',{},{reset:true})},
  rfilter:d=>{S.ready[d.k]=d.v;render(true)},
  product:d=>{S.gal=0;go('product',{t:d.t||'mirror'})},
  gal:d=>{S.gal=+d.i;render()},
  fav:(d,e)=>{e.stopPropagation();const i=S.favs.indexOf(d.id);if(i>=0)S.favs.splice(i,1);else{S.favs.push(d.id);toast('Added to favorites')}persist.favs();render()},
  mclose:(d,e)=>{if(e.target.dataset.act==='mclose')closeModal()},
  mclose2:()=>closeModal(),
  psize:d=>{S.draft.sizeId=d.id;S.draft.m.mm=pinOf(d.id).mm;ED.guideSvg();ED.draw();$('#sizes').innerHTML=activePins().map(s=>`<button class="chip ${s.id===d.id?'on':''}" data-act="psize" data-id="${s.id}">${esc(s.label)} · ${s.mm} mm</button>`).join('')},
  guides:()=>{ED.guides=!ED.guides;ED.guideSvg()},
  etab:d=>{ED.panel=d.k;ED.sel=null;ED.render()},
  fitfill:()=>{const m=S.draft.m;m.fit=!m.fit;m.scale=1;m.tx=m.ty=0;ED.change();ED.render()},
  center:()=>{const m=S.draft.m;m.tx=m.ty=0;m.scale=1;m.rot=0;ED.change()},
  rot90:()=>{const m=S.draft.m;m.rot=((m.rot+90+180)%360)-180;ED.change()},
  resetdesign:()=>{const d=S.draft,art=d.m.art,nm=newModel(d.m.mm,null);nm.art=art;Object.keys(nm).forEach(k=>{d.m[k]=nm[k]});mountEditorBind();toast('Design reset')},
  tadd:()=>{const v=$('#tn').value.trim();if(!v)return;const t={t:v,color:'#231F20',size:.14,x:.5,y:.5};S.draft.m.texts.push(t);ED.sel={k:'texts',o:t};ED.draw();ED.render()},
  tcolor:d=>{ED.sel.o.color=d.c;ED.draw();ED.render()},
  tdone:()=>{ED.sel=null;ED.render()},
  tdel:()=>{const a=S.draft.m.texts;a.splice(a.indexOf(ED.sel.o),1);ED.sel=null;ED.draw();ED.render()},
  sadd:d=>{const s={e:d.e,x:.5,y:.5,size:.16};S.draft.m.stickers.push(s);ED.sel={k:'stickers',o:s};ED.draw();ED.render()},
  sdel:()=>{const a=S.draft.m.stickers;a.splice(a.indexOf(ED.sel.o),1);ED.sel=null;ED.draw();ED.render()},
  bgc:d=>{S.draft.m.bg=d.c;ED.draw();ED.render()},
  check:()=>openChecks(),
  replace:()=>{closeModal();ED.panel='photo';ED.render();const f=$('#f1');if(f)f.click()},
  finish:()=>finishDesign(),
  qty:d=>{const q=S.draft;q.qty=Math.max(1,Math.min(100000,q.qty+Number(d.d)));$('#qin').value=q.qty;updQty()},
  qsize:d=>{S.draft.sizeId=d.id;S.draft.m.mm=pinOf(d.id).mm;render()},
  toPreview:()=>{S.prevSide='front';go('preview')},
  pside:d=>{S.prevSide=d.s;render()},
  editdesign:()=>go('designer',{},{replace:false}),
  savedesign:()=>saveDesignModal(''),
  dosave:()=>{const n=$('#dn').value.trim()||'My design';commitDesign(n);closeModal();toast('Design saved to My Designs')},
  addcart:()=>{if(!S.draft.designId)commitDesign(S.draft.name);if(addToCart()){toast('Added to cart');go('cart',{},{})}},
  cqty:d=>{const i=S.cart.find(x=>x.id===d.id);i.qty=Math.max(1,i.qty+Number(d.d));persist.cart();render()},
  cdel:d=>{S.cart=S.cart.filter(x=>x.id!==d.id);persist.cart();render()},
  clater:d=>{const i=S.cart.find(x=>x.id===d.id);S.cart=S.cart.filter(x=>x.id!==d.id);S.later.push(i);persist.cart();persist.later();render()},
  movecart:d=>{const i=S.later.find(x=>x.id===d.id);S.later=S.later.filter(x=>x.id!==d.id);S.cart.push(i);persist.cart();persist.later();render()},
  cedit:d=>{const i=S.cart.find(x=>x.id===d.id);S.draft={product:i.product,sizeId:i.sizeId,name:i.name||'',qty:i.qty,m:clone(i.m),out:{thumb:i.thumb},designId:i.dk,cartId:i.id};go('designer')},
  tocheckout:()=>{S.err={};go('checkout')},
  ship:d=>{S.form.ship=d.id;render()},pay:d=>{S.form.pay=d.id;S.err.pay=null;render()},
  redeem:d=>{S.form.redeem=S.form.redeem===+d.i?undefined:+d.i;render()},
  place:()=>placeOrder(),
  track:d=>go('track',{id:d.id}),
  otab:d=>{go('orders',{tab:d.t},{replace:true})},
  reorder:d=>{const o=store.orders[d.id];if(!o)return;let added=0;
    o.items.forEach(it=>{const ds=S.designs.find(x=>x.id===it.dk);if(ds){S.cart.push({id:'c'+uid(),product:ds.product,sizeId:ds.sizeId,qty:it.qty,m:clone(ds.m),thumb:ds.thumb,name:ds.name,dk:ds.id});added++}});
    persist.cart();if(added){toast('Added to cart');go('cart')}else toast('Original design is not on this device. Please start a new design.')},
  dorder:d=>{const ds=S.designs.find(x=>x.id===d.id);openDesign(ds,'qty')},
  dedit:d=>openDesign(S.designs.find(x=>x.id===d.id),'designer'),
  dview:d=>{const ds=S.designs.find(x=>x.id===d.id);modal(`<div class="ttl s mb8">${esc(ds.name)}</div><div class="imgbox w" style="height:260px">${ds.product==='mirror'?KV({u:ds.thumb},'front',150):PV({u:ds.thumb},180)}</div>${ds.product==='mirror'?`<div class="imgbox w mt8" style="height:200px">${KV({u:ds.thumb},'back',110)}</div>`:''}<button class="btn w mt12" data-act="mclose2">Close</button>`)},
  ddup:d=>{const ds=S.designs.find(x=>x.id===d.id);S.designs.unshift(Object.assign(clone(ds),{id:'ds'+uid(),name:ds.name+' (copy)',at:Date.now()}));persist.designs();render();toast('Design duplicated')},
  ddel:d=>{S.designs=S.designs.filter(x=>x.id!==d.id);persist.designs();render()},
  modal:d=>accountModal(d.m),
  clearall:()=>{Object.keys(localStorage).filter(k=>k.startsWith('pm_')&&k!=='pm_dev').forEach(k=>localStorage.removeItem(k));S.cart=[];S.later=[];S.favs=[];S.designs=[];S.profile={name:'',phone:'',email:'',street:'',city:'',prov:'',zip:''};closeModal();toast('Cleared');go('home',{},{reset:true})},
  saveprofile:()=>{['name','phone','email','street','city','prov','zip'].forEach(k=>{const el=$('#p-'+k);if(el)S.profile[k]=el.value.trim()});persist.profile();closeModal();toast('Saved')},
  bprod:d=>{S.form.bulk=Object.assign(S.form.bulk||{},{product:d.p});render()},
  bsize:d=>{S.form.bulk=Object.assign(S.form.bulk||{},{size:d.id});render()},
  sendbulk:()=>sendBulk(),
  admin:async()=>{
    if(!sb)return toast('Owner authentication is not configured. Add Supabase credentials first.');
    if(!store.user||store.user.is_anonymous){return modal(`<div class="ttl s mb8">Owner sign in</div><p class="mut sm">Sign in with the Supabase account that has owner access.</p><label class="lab" for="owner-email">Email</label><input class="in" id="owner-email" type="email" autocomplete="email"><label class="lab" for="owner-password">Password</label><input class="in" id="owner-password" type="password" autocomplete="current-password"><div class="row g8 mt12"><button class="btn o f" data-act="mclose2">Cancel</button><button class="btn f" data-act="ownerlogin">Sign in</button></div>`)}
    store.adminOK=await isAdmin();
    if(!store.adminOK)return toast('This account is not an owner');
    subscribeAll();S.adminPage='dash';go('adm',{},{})
  },
  ownerlogin:async()=>{
    const email=$('#owner-email')?.value.trim(),password=$('#owner-password')?.value;
    if(!email||!password)return toast('Enter your email and password');
    const {data,error}=await sb.auth.signInWithPassword({email,password});
    if(error||!data.user)return toast('Owner sign in failed');
    store.user=data.user;store.adminOK=await isAdmin();
    if(!store.adminOK)return toast('This account is not an owner');
    closeModal();subscribeAll();S.adminPage='dash';go('adm',{},{})
  },
  requestAlerts:async()=>{
    if(!('Notification' in window))return toast('Browser notifications are not supported');
    const permission=await Notification.requestPermission();
    toast(permission==='granted'?'Order alerts enabled':'Order alerts were not enabled');
  },
  exitadmin:()=>go('home',{},{reset:true}),
  apage:d=>{S.adminPage=d.k;S.aq='';render()},
  afilter:d=>{S.afilter=d.k;render()},
  aorder:d=>openOrder(d.id),
  astage:d=>setStage(d.id,d.i),
  anext:d=>{const o=store.orders[d.id],st=stepsOf(o),nx=st[st.indexOf(o.stage)+1];if(nx!==undefined)setStage(d.id,nx)},
  apay:async d=>{const o=clone(store.orders[d.id]);o.payment.status=d.p;await saveOrder(o);render();openOrder(d.id)},
  dlart:async d=>{const o=store.orders[d.id],art=await getArt(o.items[+d.n].art);if(!art)return;
    try{if(store.dl){const b=await (await fetch(art)).blob();await store.dl.save({filename:`${o.id}-item${+d.n+1}-print.jpg`,data:b});toast('Saved')}else{const a=document.createElement('a');a.href=art;a.download=`${o.id}-print.jpg`;a.click()}}catch(e){toast('Download was not completed')}},
  exportcsv:async()=>{const rows=[['Order','Date','Customer','Phone','Email','Items','Qty','Total','Payment','Status','Delivery','Needed by']].concat(allOrders().map(o=>[o.id,new Date(o.createdAt).toISOString().slice(0,10),o.customer.name,o.customer.phone,o.customer.email,orderSummary(o),orderQty(o),o.total,o.payment.status,stepLabel(o,o.stage),o.ship.label,o.neededBy||'']));
    const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    try{if(store.dl){await store.dl.save({filename:'pinmirror-orders.csv',data:csv});toast('Saved')}else{const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='pinmirror-orders.csv';a.click()}}catch(e){toast('Export was not completed')}},
  cfgtoggle:async d=>{setPath(cfg(),d.path,!getPath(cfg(),d.path));await saveCfg();render()},
  addpin:async()=>{cfg().pins.push({id:'p'+uid(),label:'New size',mm:45,on:false,price:[40,35,30,25]});await saveCfg();render()},
  addreward:async()=>{cfg().loyalty.rewards.push({pts:1000,off:250});await saveCfg();render()},
  restock:async d=>{const n=+d.n,v=Number($('#rs'+n).value)||0;cfg().inv[n].stock+=v;await saveCfg();render();toast('Stock updated')},
  bquote:async d=>{const b=clone(store.bulk[d.id]);b.quoted=!b.quoted;await saveBulk(b);render()},
  rep:d=>{S.rep=d.k;render()}
};
function mountEditorBind(){ED.ptr=new Map();ED.sel=null;ED.panel='photo';ED.render();ED.change()}
async function openDesign(ds,dest){
  if(!ds)return;
  S.draft={product:ds.product,sizeId:ds.sizeId,name:ds.name,qty:ds.qty||10,m:clone(ds.m),out:{thumb:ds.thumb},designId:ds.id,cartId:null};
  if(dest==='qty'){toast('Preparing print file…');try{S.draft.out=await renderOut(S.draft.m);go('qty')}catch(e){toast('Could not load this design')}}else go('designer');
}
function accountModal(k){
  const p=S.profile;
  if(k==='profile')return modal(`<div class="ttl s mb8">Address Book</div>${[['name','Full Name'],['phone','Phone'],['email','Email'],['street','Street / Barangay'],['city','City / Municipality'],['prov','Province'],['zip','Postal Code']].map(([a,l])=>`<label class="lab" for="p-${a}">${l}</label><input class="in" id="p-${a}" value="${esc(p[a]||'')}">`).join('')}<button class="btn w mt12" data-act="saveprofile">Save</button>`);
  if(k==='paymethods')return modal(`<div class="ttl s mb8">Payment Methods</div><p class="mut">Accepted by the studio right now:</p>${cfg().pay.filter(x=>x.on).map(x=>`<div class="card mb8"><b>${esc(x.label)}</b><div class="mut sm">${esc(x.info||'')}</div></div>`).join('')}<button class="btn w mt8" data-act="mclose2">Close</button>`);
  if(k==='loyalty'){const L=cfg().loyalty;return modal(`<div class="ttl s mb8">Loyalty Rewards</div>${L.on?`<div class="card row sp"><span>Your points</span><b style="font:800 22px var(--d)">${myPoints()}</b></div><p class="mut sm mt8">Earn 1 point for every ${peso(L.per)} on completed orders.</p>${L.rewards.map(r=>`<div class="sumr"><span>${r.pts} points</span><b>${peso(r.off)} off</b></div>`).join('')}<p class="mut xs">Redeem at checkout.</p>`:'<p class="mut">The loyalty program is not active right now.</p>'}<button class="btn w mt8" data-act="mclose2">Close</button>`) }
  if(k==='help')return modal(`<div class="ttl s mb8">Help &amp; Support</div><div class="card mb8"><b>How ordering works</b><p class="mut sm" style="margin:4px 0 0">Upload your design, position it, pick a quantity, preview both sides, then check out. We review your artwork before printing.</p></div><div class="card mb8"><b>Mirror keychain</b><p class="mut sm" style="margin:4px 0 0">One size only: 58 mm. Your design is printed on the front. The back is a plain mirror.</p></div><div class="card"><b>Payment</b><p class="mut sm" style="margin:4px 0 0">After you order, send payment using the instructions shown, and quote your order number. We mark your order paid once it arrives.</p></div><button class="btn w mt12" data-act="mclose2">Close</button>`);
  if(k==='logout')return modal(`<div class="ttl s mb8">Clear my data?</div><p class="mut">This removes your cart, saved designs, favorites and profile from this device. Orders already placed stay with the studio.</p><div class="row g8"><button class="btn o f" data-act="mclose2">Cancel</button><button class="btn f" data-act="clearall">Clear</button></div>`);
}
function searchRes(q){
  q=q.toLowerCase();const out=[];
  if(!q||'mirror keychain 58 mm'.includes(q)||'custom mirror keychain'.includes(q))out.push(`<button class="card row g12" style="border:0;text-align:left;cursor:pointer" data-act="product" data-t="mirror"><span class="imgbox" style="width:52px;height:52px">${KV({p:'pet'},'front',28,0,'n')}</span><span class="f1"><b>Custom Mirror Keychain</b><div class="mut xs">58 mm</div></span></button>`);
  PINITEMS.concat(PRESETS.map(p=>[p.name,p.id,p.id])).filter(x=>!q||x[0].toLowerCase().includes(q)||('pin badge').includes(q)).slice(0,7).forEach(x=>{
    const pr=PRESETS.find(p=>p.name===x[0]);const t=pr?pr.type:'pin';
    out.push(`<button class="card row g12" style="border:0;text-align:left;cursor:pointer" data-act="start" data-p="${t}" data-preset="${x[2]||''}" data-name="${esc(x[0])}"><span class="imgbox" style="width:52px;height:52px">${t==='mirror'?KV({p:x[1]},'front',28,0,'n'):PV({p:x[1]},40,'front','n')}</span><span class="f1"><b>${esc(x[0])}</b><div class="mut xs">${t==='mirror'?'58 mm Mirror Keychain':'Pin Badge'}</div></span></button>`) });
  $('#sres').innerHTML=out.join('')||'<div class="mut">No matches.</div>';
}
async function sendBulk(){
  const B=S.form.bulk||{},g=k=>String(B[k]!==undefined?B[k]:(k==='name'?S.profile.name:k==='phone'?S.profile.phone:k==='email'?S.profile.email:'')).trim();
  const e={};if(!(+g('qty')>0))e.bqty='Enter a quantity';if(!g('name'))e.bname='Enter your name';if(!/^[0-9+()\-\s]{7,}$/.test(g('phone')))e.bphone='Enter a phone number';if(!/^\S+@\S+\.\S+$/.test(g('email')))e.bemail='Enter a valid email';
  S.err=e;if(Object.keys(e).length){render();toast('Please complete the highlighted fields');return}
  const prod=B.product||'mirror',b={id:'B'+Date.now().toString(36)+uid(),ownerKey:DEV,at:Date.now(),product:prod,productLabel:prod==='mirror'?'58 mm Mirror Keychain':`Pin Badge — ${pinOf(B.size).label} ${pinOf(B.size).mm} mm`,qty:g('qty'),need:g('need'),name:g('name'),org:g('org'),phone:g('phone'),email:g('email'),notes:g('notes'),quoted:false,file:(B.file&&B.file.length<230000)?B.file:null,fileName:B.fileName||''};
  try{await saveBulk(b)}catch(er){return}
  S.form.bulk=undefined;S.err={};
  modal(`<div style="text-align:center"><div style="width:64px;height:64px;border-radius:50%;background:var(--green);color:#fff;display:grid;place-items:center;margin:0 auto 10px">${ic('check','style="width:32px;height:32px"')}</div><div class="ttl s">Request sent</div><p class="mut">We will reply with a bulk price to ${esc(b.email)}.</p><button class="btn w" data-act="done">Done</button></div>`);
}
A_.done=()=>{closeModal();go('home',{},{reset:true})};

/* ---------- input handlers ---------- */
const INP={
  zoom:t=>{S.draft.m.scale=+t.value;ED.draw()},rot:t=>{S.draft.m.rot=+t.value;ED.draw()},
  ttext:t=>{ED.sel.o.t=t.value||' ';ED.draw()},tsize:t=>{ED.sel.o.size=+t.value;ED.draw()},
  bgcolor:t=>{S.draft.m.bg=t.value;ED.draw()},
  qty:t=>{const v=Math.max(1,Math.min(100000,parseInt(t.value,10)||1));S.draft.qty=v;updQty()},
  note:t=>{S.note=t.value},
  sq:t=>searchRes(t.value),
  aq:t=>{S.aq=t.value;const pos=t.selectionStart;render();const n=$('[data-in="aq"]');if(n){n.focus();n.setSelectionRange(pos,pos)}},
  aqc:t=>{S.aq=t.value;const pos=t.selectionStart;render();const n=$('[data-in="aqc"]');if(n){n.focus();n.setSelectionRange(pos,pos)}},
  inote:async t=>{clearTimeout(INP.h);INP.h=setTimeout(async()=>{const o=clone(store.orders[t.dataset.id]);o.internal=t.value;await saveOrder(o)},600)}
};
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.in&&INP[t.dataset.in])INP[t.dataset.in](t);
  else if(t.dataset.f){S.form[t.dataset.f]=t.value;if(S.err[t.dataset.f]){S.err[t.dataset.f]=null;t.classList.remove('err')}}
  else if(t.dataset.b){S.form.bulk=S.form.bulk||{};S.form.bulk[t.dataset.b]=t.value}
});
document.addEventListener('change',async e=>{
  const t=e.target;
  if(t.dataset.cfg){
    let v=t.type==='number'?Number(t.value):t.value;
    if(t.type==='number'&&(isNaN(v)||v<0))v=0;
    setPath(cfg(),t.dataset.cfg,v);
    if(/^tiers\.\d+\.min$/.test(t.dataset.cfg)){cfg().tiers[0].min=1}
    await saveCfg();render();toast('Saved');
  }
  if(t.id==='bf'&&t.files[0]){
    const f=t.files[0];const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,900/Math.max(im.naturalWidth,im.naturalHeight)||1),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*k));c.height=Math.max(1,Math.round(im.naturalHeight*k));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);let d=c.toDataURL('image/jpeg',.75);if(d.length>200000)d=c.toDataURL('image/jpeg',.5);S.form.bulk=Object.assign(S.form.bulk||{},{file:d,fileName:f.name});render()};im.onerror=()=>toast('That file could not be opened');im.src=r.result};r.readAsDataURL(f);
  }
});
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  if(e.target.closest('[data-stop]')&&el.dataset.act==='mclose')return;
  const fn=A_[el.dataset.act];if(fn){if(el.tagName==='LABEL')return;fn(el.dataset,e)}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

/* ---------- render ---------- */
V.adm=()=>({});
const LIVE=['orders','track','notif','confirm','account','adm','home','shop'];
function render(top_){
  const main=$('#main'),st=main&&!top_?main.scrollTop:0;
  if(S.view==='adm'){
    root.className='adm';root.innerHTML=adminShell();
    if(top_)root.scrollTop=0;return;
  }
  root.className='';
  const r=V[S.view]?V[S.view]():V.home();
  root.innerHTML=`<div class="main" id="main">${r.body}</div>${r.ft?`<div class="ft">${r.ft}</div>`:''}${S.view==='designer'?'':navHTML()}`;
  const m2=$('#main');if(m2&&!top_)m2.scrollTop=st;
  if(r.mount)r.mount();
}
softRenderHook=()=>{
  if(!LIVE.includes(S.view))return;
  if(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
  if($('#modal').innerHTML)return;
  render();
};
render(true);
initStore().then(()=>{softRenderHook()});
