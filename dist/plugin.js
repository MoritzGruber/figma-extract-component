var x=Object.defineProperty,C=(t,e,n)=>e in t?x(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,P=(t,e,n)=>(C(t,typeof e!="symbol"?e+"":e,n),n),O=(t,e,n)=>new Promise((r,o)=>{var a=c=>{try{s(n.next(c))}catch(u){o(u)}},l=c=>{try{s(n.throw(c))}catch(u){o(u)}},s=c=>c.done?r(c.value):Promise.resolve(c.value).then(a,l);s((n=n.apply(t,e)).next())}),N;(t=>{const e=new Map;function n(o,a){var l;return(l=e.get(o))==null?void 0:l.get(a)}t.getDelegate=n;function r(o,a,l){e.has(o)||e.set(o,new Map);const s=e.get(o);s.has(a)||s.set(a,l)}t.register=r})(N||(N={}));const y=class{constructor(t,e){this.name=t,this.definitions=e}static get current(){return y.currentSide}static set current(t){if(y.currentSide!=null)throw new Error("Logical side can be declared only once.");y.currentSide=t}static register(t){return this.sides.set(t.getName(),t),t}static byName(t){return this.sides.get(t)}getName(){return this.name}beginListening(t,e){const n=r=>{var o,a,l;if(this.definitions.shouldHandle!=null&&!this.definitions.shouldHandle(r))return;const s=(l=(a=(o=this.definitions).messageGetter)==null?void 0:a.call(o,r))!=null?l:r;if(s.type!=="response"){const c=t==null?void 0:t.byName(s.type);if(c==null)t!=null&&console.warn("Unknown message received ->",s.type);else{const u=y.byName(s.from),i=c.handle(s.payload,u);if(i!==void 0){const p=h=>{const d=y.current,f=N.getDelegate(d,u);f==null||f({from:y.current.getName(),type:"response",requestId:s.requestId,payload:h})};typeof(i==null?void 0:i.then)=="function"?i.then(p):p(i)}}}e!=null&&e(s)&&this.definitions.detachListener(n)};this.definitions.attachListener(n)}};let m=y;P(m,"currentSide"),P(m,"sides",new Map);function R(){const t=new Array(36);for(let e=0;e<36;e++)t[e]=Math.floor(Math.random()*16);return t[14]=4,t[19]=t[19]&=-5,t[19]=t[19]|=8,t[8]=t[13]=t[18]=t[23]="-",t.map(e=>e.toString(16)).join("")}class L{constructor(e){this.name=e}getName(){return this.name}createTransportMessage(e){const n=m.current;return{requestId:R(),type:this.getName(),from:n.getName(),payload:e}}sendTransportMessage(e){const n=m.current,r=this.receivingSide(),o=N.getDelegate(n,r);if(!o)throw new Error(`Transportation from ${n.getName()} to ${r.getName()} is not supported.`);return o(e),e}send(e){const n=this.createTransportMessage(e);return this.sendTransportMessage(n)}request(e){return O(this,null,function*(){const n=this.createTransportMessage(e),r=new Promise(o=>{m.current.beginListening(null,a=>a.requestId===n.requestId?(o(a.payload),!0):!1)});return this.sendTransportMessage(n),r})}}class _{constructor(){P(this,"registry",new Map)}byName(e){return this.registry.get(e)}register(e){return this.registry.set(e.getName(),e),e}}function M(t){return e=>{m.current=e,e.beginListening(t.messagesRegistry),t.initTransports(N.register)}}var g;(t=>{t.PLUGIN=m.register(new m("Plugin",{attachListener:e=>figma.ui.on("message",e),detachListener:e=>figma.ui.off("message",e)})),t.UI=m.register(new m("UI",{shouldHandle:e=>{var n;return((n=e.data)==null?void 0:n.pluginId)!=null},messageGetter:e=>e.data.pluginMessage,attachListener:e=>window.addEventListener("message",e),detachListener:e=>window.removeEventListener("message",e)}))})(g||(g={}));class $ extends L{receivingSide(){return g.PLUGIN}handle(e,n){if(figma.editorType==="figma"){const r=figma.createRectangle();r.x=0,r.y=0,r.name="Plugin Rectangle # "+Math.floor(Math.random()*9999),r.fills=[{type:"SOLID",color:{r:Math.random(),g:Math.random(),b:Math.random()}}],r.resize(e.width,e.height),figma.currentPage.appendChild(r),figma.viewport.scrollAndZoomIntoView([r]),figma.closePlugin()}}}class G extends L{constructor(e){super("hello-"+e.getName()),this.side=e}receivingSide(){return this.side}handle(e,n){if(n===g.PLUGIN){const r=new CustomEvent("pluginmsg",{detail:e.text});document.dispatchEvent(r)}console.log(`${n.getName()} said "${e.text}"`)}}function A(t){return!t||typeof t!="string"?"":t.toLowerCase().split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join("")}class D extends L{receivingSide(){return g.PLUGIN}handle(e,n){console.log(" payload",e);const r=e.serverUrl;console.log(" serverUrl",r),console.log(n.getName(),"has pinged us!");const o=figma.currentPage.selection,a=`${e.componentName}`.toLowerCase()==="auto";if(o.length>0){const l=async(s,c,u)=>{const i={format:"PNG",constraint:{type:"SCALE",value:1}},p={format:"SVG_STRING"},h={format:"JSON_REST_V1"};await(async()=>{var d,f,U;for(const w of[i,p,h]){console.log(" ",w.format);const b=await s.exportAsync(w),S=w.format;let E="";((d=s==null?void 0:s.children)==null?void 0:d.length)==1&&(E=(f=s==null?void 0:s.children[0])==null?void 0:f.name);const T=`${r}?nodeName=${encodeURIComponent(s.name||"")}&parentNodeName=${encodeURIComponent(((U=s.parent)==null?void 0:U.name)||"")}&childNodeName=${encodeURIComponent(E)}&componentName=${encodeURIComponent(A(c))}&breakpoint=${encodeURIComponent(u)}&format=${encodeURIComponent(S)}`;console.log(" sending to url",T),await fetch(T,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:S==="PNG"?Array.from(b):b})}).then(I=>I.text()).then(I=>console.log(`send the request to the server - response wa: ${I}`,S)).catch(I=>console.error(S,I))}})()};if(a){const s={};console.log(" selection",o);const c=["BRONZE","SILVER","GOLD","PLATINUM","DIAMOND"];o.forEach(i=>{var p,h;(p=i==null?void 0:i.children)==null||p.map(d=>{const f=`${d.name}`.toUpperCase();if(c.includes(f)){const U=i.name;s[`${U}_x_${f}`]=d}}),console.log(" in selected node ",i==null?void 0:i.name,(h=i==null?void 0:i.children)==null?void 0:h.map(d=>d.name))});const u=Object.keys(s);return(async()=>{for(const i of u){console.log(` starting ${i}`),v.HELLO_UI.send({text:`starting ${i}`});const[p,h]=i.split("_x_");await l(s[i],p,h),v.HELLO_UI.send({text:`done ${i}`}),console.log(" done with ",i)}v.HELLO_UI.send({text:"done with all selected components"})})(),"Auto mode is not supported yet"}else return l(o[0],e.componentName,e.breakpoint),"Send to server"}else return"Please select something"}}class q extends L{receivingSide(){return g.PLUGIN}handle(e,n){const r=JSON.stringify({serverUrl:e.serverUrl,componentName:e.componentName,breakpoint:e.breakpoint,mode:e.mode});figma.root.setPluginData("config",r)}}class H extends L{receivingSide(){return g.PLUGIN}handle(e,n){const r=figma.root.getPluginData("config");if(!r)return{serverUrl:"",componentName:"",breakpoint:"BRONZE",mode:"AUTO"};const o=JSON.parse(r);return{serverUrl:o.serverUrl,componentName:o.componentName,breakpoint:o.breakpoint,mode:o.mode}}}var v;(t=>{t.registry=new _,t.EXPORT_REQUEST=t.registry.register(new D("export-request")),t.SET_CONFIG=t.registry.register(new q("set-config")),t.GET_CONFIG=t.registry.register(new H("get-config")),t.HELLO_PLUGIN=t.registry.register(new G(g.PLUGIN)),t.HELLO_UI=t.registry.register(new G(g.UI)),t.CREATE_RECT=t.registry.register(new $("create-rect"))})(v||(v={}));const j=M({messagesRegistry:v.registry,initTransports:function(t){t(g.PLUGIN,g.UI,e=>{figma.ui.postMessage(e)}),t(g.UI,g.PLUGIN,e=>{parent.postMessage({pluginMessage:e},"*")})}});async function J(){j(g.PLUGIN),figma.editorType==="figma"&&figma.showUI(__html__,{width:800,height:650,title:"Send compnents to your server"}),console.log("Bootstrapped @",m.current.getName())}J();
