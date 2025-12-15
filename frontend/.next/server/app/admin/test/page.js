(()=>{var e={};e.id=972,e.ids=[972],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},7550:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>o.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>c,routeModule:()=>m,tree:()=>d}),s(8577),s(2029),s(5866);var a=s(3191),r=s(8716),i=s(7922),o=s.n(i),n=s(5231),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);s.d(t,l);let d=["",{children:["admin",{children:["test",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,8577)),"/Users/andalibpathan/Documents/NEU MSCS/Personal Projects/lotus-ai/mock-project/falcon-admission/frontend/src/app/admin/test/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,2029)),"/Users/andalibpathan/Documents/NEU MSCS/Personal Projects/lotus-ai/mock-project/falcon-admission/frontend/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,5866,23)),"next/dist/client/components/not-found-error"]}],c=["/Users/andalibpathan/Documents/NEU MSCS/Personal Projects/lotus-ai/mock-project/falcon-admission/frontend/src/app/admin/test/page.tsx"],p="/admin/test/page",u={require:s,loadChunk:()=>Promise.resolve()},m=new a.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/admin/test/page",pathname:"/admin/test",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},7780:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,2994,23)),Promise.resolve().then(s.t.bind(s,6114,23)),Promise.resolve().then(s.t.bind(s,9727,23)),Promise.resolve().then(s.t.bind(s,9671,23)),Promise.resolve().then(s.t.bind(s,1868,23)),Promise.resolve().then(s.t.bind(s,4759,23))},5465:(e,t,s)=>{Promise.resolve().then(s.bind(s,1818))},4607:()=>{},1818:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l});var a=s(326),r=s(7577),i=s(8648),o=s(3183),n=s(381);function l(){let[e,t]=(0,r.useState)([]),[s,l]=(0,r.useState)(!0),d=async()=>{try{console.log("Loading applicants..."),l(!0);let e=await fetch("http://localhost:5000/api/admin/applicants"),s=await e.json();console.log("Response:",s),console.log("Applicants:",s.data.applicants),t(s.data.applicants),console.log("State set to:",s.data.applicants)}catch(e){console.error("Error:",e),n.ZP.error("Failed to load")}finally{l(!1)}},c=async e=>{if(confirm("Delete this applicant?"))try{await fetch(`http://localhost:5000/api/admin/applicants/${e}`,{method:"DELETE"}),n.ZP.success("Deleted"),d()}catch{n.ZP.error("Delete failed")}};return console.log("RENDER - Applicants:",e,"Count:",e.length),(0,a.jsxs)("div",{className:"min-h-screen bg-gray-50 p-8",children:[a.jsx(n.x7,{}),a.jsx("h1",{className:"text-3xl font-bold mb-8",children:"Admin Dashboard (Simple Test)"}),(0,a.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[a.jsx("h2",{className:"text-xl font-bold",children:"Applicants"}),a.jsx("button",{onClick:d,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Refresh"})]}),(0,a.jsxs)("div",{className:"mb-4 p-3 bg-yellow-100 rounded",children:[a.jsx("p",{className:"text-sm",children:a.jsx("strong",{children:"Debug Info:"})}),(0,a.jsxs)("p",{className:"text-sm",children:["Loading: ",s?"YES":"NO"]}),(0,a.jsxs)("p",{className:"text-sm",children:["Count: ",e.length]}),(0,a.jsxs)("p",{className:"text-sm",children:["Type: ",typeof e]}),(0,a.jsxs)("p",{className:"text-sm",children:["Is Array: ",Array.isArray(e)?"YES":"NO"]})]}),s?a.jsx("div",{className:"text-center py-8",children:"Loading..."}):0===e.length?a.jsx("div",{className:"text-center py-8 text-gray-500",children:"No applicants found"}):a.jsx("div",{className:"space-y-2",children:e.map(e=>a.jsx("div",{className:"border rounded p-4 hover:bg-gray-50",children:(0,a.jsxs)("div",{className:"flex justify-between items-start",children:[(0,a.jsxs)("div",{className:"flex-1",children:[a.jsx("div",{className:"font-bold text-lg",children:e.studentName}),(0,a.jsxs)("div",{className:"text-sm text-gray-600",children:[e.program," • ",e.outcome]}),a.jsx("div",{className:"text-sm text-gray-500 mt-1",children:e.ruleSummary}),e.gpa&&(0,a.jsxs)("div",{className:"text-sm text-gray-600 mt-1",children:["GPA: ",e.gpa]})]}),(0,a.jsxs)("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:()=>alert(`Session: ${e.sessionId}`),className:"p-2 hover:bg-gray-200 rounded",title:"View Details",children:a.jsx(i.Z,{className:"w-5 h-5 text-blue-600"})}),a.jsx("button",{onClick:()=>c(e.sessionId),className:"p-2 hover:bg-gray-200 rounded",title:"Delete",children:a.jsx(o.Z,{className:"w-5 h-5 text-red-600"})})]})]})},e._id))})]}),a.jsx("div",{className:"mt-4 bg-blue-50 border border-blue-200 rounded p-4",children:(0,a.jsxs)("p",{className:"text-sm text-blue-900",children:[a.jsx("strong",{children:"Note:"})," This is a simplified test version. If you can see applicants here, the issue is in the original AdminDashboard component logic."]})})]})}},8577:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>a});let a=(0,s(8570).createProxy)(String.raw`/Users/andalibpathan/Documents/NEU MSCS/Personal Projects/lotus-ai/mock-project/falcon-admission/frontend/src/app/admin/test/page.tsx#default`)},2029:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i,metadata:()=>r});var a=s(9510);s(5023);let r={title:"Falcon University - Admin Dashboard",description:"Admission pre-assessment management system"};function i({children:e}){return a.jsx("html",{lang:"en",children:a.jsx("body",{children:e})})}},5023:()=>{},7926:(e,t,s)=>{"use strict";s.d(t,{Z:()=>o});var a=s(7577),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();var o=(e,t)=>{let s=(0,a.forwardRef)(({color:s="currentColor",size:o=24,strokeWidth:n=2,absoluteStrokeWidth:l,children:d,...c},p)=>(0,a.createElement)("svg",{ref:p,...r,width:o,height:o,stroke:s,strokeWidth:l?24*Number(n)/Number(o):n,className:`lucide lucide-${i(e)}`,...c},[...t.map(([e,t])=>(0,a.createElement)(e,t)),...(Array.isArray(d)?d:[d])||[]]));return s.displayName=`${e}`,s}},8648:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});let a=(0,s(7926).Z)("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},3183:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});let a=(0,s(7926).Z)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]])},381:(e,t,s)=>{"use strict";s.d(t,{x7:()=>ec,ZP:()=>ep});var a,r=s(7577);let i={data:""},o=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,c=(e,t)=>{let s="",a="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+o+";":a+="f"==i[1]?c(o,i):i+"{"+c(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=c(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=c.p?c.p(i,o):i+":"+o+";")}return s+(t&&r?t+"{"+r+"}":r)+a},p={},u=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+u(e[s]);return t}return e},m=(e,t,s,a,r)=>{let i=u(e),o=p[i]||(p[i]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(i));if(!p[o]){let t=i!==e?e:(e=>{let t,s,a=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(s=t[3].replace(d," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(d," ").trim();return a[0]})(e);p[o]=c(r?{["@keyframes "+o]:t}:t,s?"":"."+o)}let m=s&&p.g?p.g:null;return s&&(p.g=p[o]),((e,t,s,a)=>{a?t.data=t.data.replace(a,e):-1===t.data.indexOf(e)&&(t.data=s?e+t.data:t.data+e)})(p[o],t,a,m),o},h=(e,t,s)=>e.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"");function f(e){let t=this||{},s=e.call?e(t.p):e;return m(s.unshift?s.raw?h(s,[].slice.call(arguments,1),t.p):s.reduce((e,s)=>Object.assign(e,s&&s.call?s(t.p):s),{}):s,o(t.target),t.g,t.o,t.k)}f.bind({g:1});let g,x,y,b=f.bind({k:1});function v(e,t){let s=this||{};return function(){let a=arguments;function r(i,o){let n=Object.assign({},i),l=n.className||r.className;s.p=Object.assign({theme:x&&x()},n),s.o=/ *go\d+/.test(l),n.className=f.apply(s,a)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),y&&d[0]&&y(n),g(d,n)}return t?t(r):r}}var j=e=>"function"==typeof e,w=(e,t)=>j(e)?e(t):e,N=(()=>{let e=0;return()=>(++e).toString()})(),k=(()=>{let e;return()=>e})(),E="default",P=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return P(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},A=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},D={},$=(e,t=E)=>{D[t]=P(D[t]||C,e),A.forEach(([e,s])=>{e===t&&s(D[t])})},_=e=>Object.keys(D).forEach(t=>$(e,t)),S=e=>Object.keys(D).find(t=>D[t].toasts.some(t=>t.id===e)),O=(e=E)=>t=>{$(t,e)},I={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},M=(e={},t=E)=>{let[s,a]=(0,r.useState)(D[t]||C),i=(0,r.useRef)(D[t]);(0,r.useEffect)(()=>(i.current!==D[t]&&a(D[t]),A.push([t,a]),()=>{let e=A.findIndex(([e])=>e===t);e>-1&&A.splice(e,1)}),[t]);let o=s.toasts.map(t=>{var s,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||I[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...s,toasts:o}},Z=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||N()}),z=e=>(t,s)=>{let a=Z(t,e,s);return O(a.toasterId||S(a.id))({type:2,toast:a}),a.id},L=(e,t)=>z("blank")(e,t);L.error=z("error"),L.success=z("success"),L.loading=z("loading"),L.custom=z("custom"),L.dismiss=(e,t)=>{let s={type:3,toastId:e};t?O(t)(s):_(s)},L.dismissAll=e=>L.dismiss(void 0,e),L.remove=(e,t)=>{let s={type:4,toastId:e};t?O(t)(s):_(s)},L.removeAll=e=>L.remove(void 0,e),L.promise=(e,t,s)=>{let a=L.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?w(t.success,e):void 0;return r?L.success(r,{id:a,...s,...null==s?void 0:s.success}):L.dismiss(a),e}).catch(e=>{let r=t.error?w(t.error,e):void 0;r?L.error(r,{id:a,...s,...null==s?void 0:s.error}):L.dismiss(a)}),e};var T=1e3,U=(e,t="default")=>{let{toasts:s,pausedAt:a}=M(e,t),i=(0,r.useRef)(new Map).current,o=(0,r.useCallback)((e,t=T)=>{if(i.has(e))return;let s=setTimeout(()=>{i.delete(e),n({type:4,toastId:e})},t);i.set(e,s)},[]);(0,r.useEffect)(()=>{if(a)return;let e=Date.now(),r=s.map(s=>{if(s.duration===1/0)return;let a=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(a<0){s.visible&&L.dismiss(s.id);return}return setTimeout(()=>L.dismiss(s.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[s,a,t]);let n=(0,r.useCallback)(O(t),[t]),l=(0,r.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,r.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,r.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),p=(0,r.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=t||{},o=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[s]);return(0,r.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[s,o]),{toasts:s,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:p}}},R=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,q=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,F=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,H=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${R} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${q} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,G=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,V=v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${G} 1s linear infinite;
`,Y=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,B=b`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,W=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Y} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${B} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,X=v("div")`
  position: absolute;
`,J=v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,K=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Q=v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${K} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ee=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?r.createElement(Q,null,t):t:"blank"===s?null:r.createElement(J,null,r.createElement(V,{...a}),"loading"!==s&&r.createElement(X,null,"error"===s?r.createElement(H,{...a}):r.createElement(W,{...a})))},et=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,es=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,ea=v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,er=v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ei=(e,t)=>{let s=e.includes("top")?1:-1,[a,r]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[et(s),es(s)];return{animation:t?`${b(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},eo=r.memo(({toast:e,position:t,style:s,children:a})=>{let i=e.height?ei(e.position||t||"top-center",e.visible):{opacity:0},o=r.createElement(ee,{toast:e}),n=r.createElement(er,{...e.ariaProps},w(e.message,e));return r.createElement(ea,{className:e.className,style:{...i,...s,...e.style}},"function"==typeof a?a({icon:o,message:n}):r.createElement(r.Fragment,null,o,n))});a=r.createElement,c.p=void 0,g=a,x=void 0,y=void 0;var en=({id:e,className:t,style:s,onHeightUpdate:a,children:i})=>{let o=r.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return r.createElement("div",{ref:o,className:t,style:s},i)},el=(e,t)=>{let s=e.includes("top"),a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...a}},ed=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ec=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:i,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=U(s,o);return r.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(s=>{let o=s.position||t,n=el(o,c.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}));return r.createElement(en,{id:s.id,key:s.id,onHeightUpdate:c.updateHeight,className:s.visible?ed:"",style:n},"custom"===s.type?w(s.message,s):i?i(s):r.createElement(eo,{toast:s,position:o}))}))},ep=L}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),a=t.X(0,[819],()=>s(7550));module.exports=a})();