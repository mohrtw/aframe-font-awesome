!function(e){var t={};function o(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)o.d(n,s,function(t){return e[t]}.bind(null,s));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t){var o=["FontAwesome",'"Font Awesome 5 Pro"','"Font Awesome 5 Free"','"Font Awesome 5 Brands"'];AFRAME.registerSystem("font-awesome",{schema:{timeout:{type:"number",default:2500}},cache:{},promises:{},loaded:!1,promise:null,init(){this.version="FontAwesome",this.el.emit("font-awesome-system-initialized",{scene:this.sceneEl})},draw:function(e){const t=[e.charcode,e.color,e.size].join("-");if(!this.cache[t]){const o=e.size,n=document.createElement("canvas");n.width=o,n.height=o;const s=n.getContext("2d"),i=800/(1024/o),a=o/2;s.textAlign="center",s.textBaseline="middle",s.fillStyle=e.color;const r='"Font Awesome 5 Brands"'==e.version?900:400;s.font=r+" "+i+"px "+e.version,s.fillText(String.fromCharCode("0x"+e.charcode),a,a),this.cache[t]=n.toDataURL()}return this.cache[t]},isStylesheetLoaded:function(e="FontAwesome"){return this.loaded?Promise.resolve():this.isFontAwesomeAvailable(e)?(this.onLoaded(),Promise.resolve()):(this.promise||(this.promise=new Promise(t=>{if(this.canCheckDocumentFonts()){const o=()=>{this.isFontAwesomeAvailable(e)&&(document.fonts.removeEventListener("loadingdone",o),this.onLoaded(t))};document.fonts.addEventListener("loadingdone",o)}else console.warn("aframe-font-awesome: Unable to determine when FontAwesome stylesheet is loaded. Drawing fonts after "+this.data.timeout+" seconds"),console.warn('aframe-font-awesome: You can change the timeout by adding "font-awesome="timeout: $timeout" to your a-scene'),window.setTimeout(()=>{this.onLoaded(t)},this.data.timeout)})),this.promise)},isFontAwesomeAvailable:function(e="FontAwesome"){return this.canCheckDocumentFonts()&&document.fonts.check("1px "+e)},canCheckDocumentFonts:function(){return void 0!==document.fonts&&document.fonts.check},onLoaded:function(e){this.el.emit("font-awesome.loaded"),this.loaded=!0,e&&e()},setVersion(e){o.includes(e)?this.version=e:console.warn(e+" is not an available Font Awesome version.")},createMesh(e,t){var o=THREE.ImageUtils.loadTexture(e),n=new THREE.PlaneBufferGeometry(t,t),s=new THREE.MeshBasicMaterial({map:o,side:THREE.DoubleSide,transparent:!0});return new THREE.Mesh(n,s)}}),AFRAME.registerComponent("font-awesome",{schema:{id:{type:"string",default:""},charcode:{type:"string"},color:{default:"#000",type:"string"},size:{default:"1024",type:"number"},fontSize:{type:"number",default:1},fontSizeConstant:{type:"number",default:.02836},visibleWhenDrawn:{default:"true",type:"boolean"},mesh:{type:"boolean",default:!1},version:{type:"string",default:"",onOf:o}},multiple:!0,init:function(){""==this.data.version&&(this.data.version=this.system.version)},update:function(){this.data.visibleWhenDrawn&&this.el.setAttribute("visible","false");var e=this.data.fontSize*this.data.fontSizeConstant;this.system.isStylesheetLoaded(this.data.version).then(function(){const t=this.el.sceneEl.systems["font-awesome"].draw(this.data);if(this.data.mesh){var o=this.system.createMesh(t,e),n=""!=this.data.id?"fa-"+this.data.id:"fa";this.el.setObject3D(n,o)}else this.el.setAttribute("src",t),this.el.emit("font-awesome.drawn");this.el.emit("font-awesome.drawn",{id:this.data.id}),this.data.visibleWhenDrawn&&setTimeout(()=>this.el.setAttribute("visible","true"))}.bind(this))}}),AFRAME.registerPrimitive("a-font-awesome",{defaultComponents:{geometry:{primitive:"plane"},material:{side:"double",transparent:"true"}},mappings:{charcode:"font-awesome.charcode",color:"font-awesome.color",size:"font-awesome.size",src:"material.src",version:"font-awesome.version"}})}]);