(()=>{"use strict";function e(){const e=[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],t=[];function o(...e){return e.every((e=>e>=0&&e<10))}return{getShips:()=>t,getCells:()=>e,placeShip:function(r,a,n,i="horizontal"){if(!o(a,n))throw new Error("invalid coordinates. Coordinates can only be within [0, 0] and [9, 9] inclusive");if(a=+a,n=+n,"horizontal"===i){if("carrier"===r.type&&a>5)throw new Error("invalid placement. Carrier cannot be placed horizontally beyond x = 5");if("battleship"===r.type&&a>6)throw new Error("invalid placement. Battleship cannot be placed horizontally beyond x = 6");if(("destroyer"===r.type||"submarine"===r.type)&&a>7)throw new Error("invalid placement. Battleship cannot be placed horizontally beyond x = 7");if("patrol boat"===r.type&&a>8)throw new Error("invalid placement. Battleship cannot be placed horizontally beyond x = 8");for(let t=0;t<r.size;t+=1)if(0!==e[n][a+t])throw new Error(`invalid placement. Cell (${a}, ${n}) is occupied`);for(let t=0;t<r.size;t+=1)e[n][a+t]=r.type}else if("vertical"===i){if("carrier"===r.type&&n>5)throw new Error("invalid placement. Carrier cannot be placed horizontally under y = 5");if("battleship"===r.type&&n>6)throw new Error("invalid placement. Battleship cannot be placed horizontally under y = 4");if(("destroyer"===r.type||"submarine"===r.type)&&n>7)throw new Error("invalid placement. Battleship cannot be placed horizontally under x = 3");if("patrol boat"===r.type&&n>8)throw new Error("invalid placement. Battleship cannot be placed horizontally under x = 2");for(let t=0;t<r.size;t+=1)if(0!==e[n+t][a])throw new Error(`invalid placement. Cell (${a}, ${n}) is occupied`);for(let t=0;t<r.size;t+=1)e[n+t][a]=r.type}t.push(r)},receiveAttack:function(r,a){if(!o(r,a))throw new Error("coords out of bounds");if(function(t,o){return-1===e[o][t]||1===e[o][t]}(r,a))throw new Error("coords already attacked");if(0===e[a][r])e[a][r]=-1;else if("string"==typeof e[a][r]){const o=t.findIndex((t=>t.type===e[a][r]));t[o].hit(),t[o].isSunk()&&t.splice(o,1),e[a][r]=1}},allShipsAreSunk:function(){return 0===t.length}}}class t{constructor(e){const t=["carrier","battleship","destroyer","submarine","patrol boat"];if(!t.includes(e))throw new Error(`invalid type of ship. Please choose between ${t}`);this.type=e,this.type===t[0]?this.size=5:this.type===t[1]?this.size=4:this.type===t[2]||this.type===t[3]?this.size=3:this.type===t[4]&&(this.size=2)}hit(){return this.size-=this.size>0?1:0,this}isSunk(){return 0===this.size}}function o(o,r){let a=e();return{getName:()=>o,getBoard:()=>a,getColor:()=>r,placeShip:function(e,o,r,n="horizontal",i=!1){const l=new t(e);if(i)for(;i;){const e=Math.floor(10*Math.random()),t=Math.floor(10*Math.random()),o=Math.random()>.5?"horizontal":"vertical";try{return a.placeShip(l,e,t,o),l}catch(e){if(e.message.includes("invalid placement"))continue}}else a.placeShip(l,o,r,n);return l},placeAttack:function(e,t,o,r=!1){for(;r;){const t=Math.floor(10*Math.random()),o=Math.floor(10*Math.random());try{return e.receiveAttack(t,o),{x:t,y:o}}catch(e){if("coords already attacked"===e.message)continue}}return e.receiveAttack(t,o),{x:t,y:o}},resetBoard:function(){a=e()}}}function r(){const e=document.createElement("div");e.classList.add("grid","grid-rows-10","grid-cols-10","border-4","border-black","w-fit");for(let t=0;t<100;t+=1){const o=document.createElement("button");o.classList.add("bg-white","cell"),o.dataset.index=t,o.style.width="40px",o.style.height="40px",t<90&&o.classList.add("border-b-2","border-b-zinc-400"),(t+1)%10!=0&&o.classList.add("border-r-2","border-r-zinc-400"),e.append(o)}return e}!function(){let e=null,t=null,a=null,n=0,i=!1,l="horizontal";const s=["carrier","battleship","destroyer","submarine","patrol boat"];let c=0,d=s[c],u=null,[m,p]=[],h=!0,y={};const f=document.getElementById("controls"),g=document.getElementById("popup-go-home");function v(e){Array.from(document.getElementById(e).children).forEach((e=>{e.classList.add("hidden")}))}function b(e){document.getElementById(e).classList.add("hidden")}function w(e){document.getElementById(e).classList.remove("hidden")}function B(e){const t=e.dataset.index;return t<10?[t,0]:[t%10,Math.floor(t/10)]}function E(e,t,o,r){let a=0;"carrier"===e?a=5:"battleship"===e?a=4:"destroyer"===e||"submarine"===e?a=3:"patrol boat"===e&&(a=2);const n=Array.from(t.querySelectorAll(".cell"));let i=+o;if("horizontal"===r){if((i+a)%10<a&&(i+a)%10!=0)return;for(let e=0;e<a;e+=1)n[i].style.filter="brightness(50%)",i+=1}else if("vertical"===r){if(i+10*(a-1)>99)return;for(let e=0;e<a;e+=1)n[i].style.filter="brightness(50%)",i+=10}}function z(e,t=!1){const o=e.domBoard.querySelectorAll(".cell"),r=e.getBoard().getCells();o.forEach((o=>{const[a,n]=B(o);-1===r[n][a]?o.style.backgroundColor="maroon":0===r[n][a]?o.style.backgroundColor="white":1===r[n][a]?o.style.backgroundColor="lime":o.style.backgroundColor=t?"white":e.getColor(),o.style.filter=""}))}function L(o=c){const r=Array.from(document.getElementById("player-one-ships").querySelectorAll("li")),a=Array.from(document.getElementById("player-two-ships").querySelectorAll("li"));if(i){let o=[];p===e?o=r:p===t&&(o=a);const n=p.getBoard().getShips().map((e=>e.type));o.forEach((e=>{n.includes(e.innerText.toLowerCase())||e.classList.add("line-through")}))}u===e?r[o].classList.remove("text-zinc-400"):u===t&&a[o].classList.remove("text-zinc-400")}function k(e){document.getElementById("message-panel").innerText=e}function C(){[m,p]=a.getAttackerTarget(),p.domBoard.classList.add("target-board"),m.domBoard.classList.remove("target-board")}function S(e){e.querySelectorAll(".cell").forEach((e=>{"none"!==e.style.pointerEvents?e.style.pointerEvents="none":e.style.pointerEvents="auto"}))}async function x(e,t,o=!1){o&&await new Promise((e=>{k(`${m.getName()} is thinking...`),setTimeout((()=>{e(1)}),2e3)}));let r={};try{r=a.placeAttack(e,t,o),z(p,!0),L(),S(p.domBoard)}catch(o){if("coords already attacked"===o.message)return k(`(${[e,t]}) is already attacked. Try again.`),0;throw o}return 0===r.code?(k(`${m.getName()} won!`),i=!1,0):(1===r.code?k(`${m.getName()}'s attack on (${[r.x,r.y]}) is a hit!`):k(`${m.getName()}'s attack on (${[r.x,r.y]}) is a miss.`),await new Promise((e=>{setTimeout((()=>{C(),"Computer"!==m.getName()&&S(p.domBoard),k(`${m.getName()}'s turn.`)}),2e3),setTimeout((()=>{h=!0,z(p,h),e(1)}),2e3)})),1)}function A(){const e=Array.from(document.getElementById("player-one-ships").querySelectorAll("li")),t=Array.from(document.getElementById("player-two-ships").querySelectorAll("li"));e.forEach((e=>{e.classList.remove("line-through"),e.classList.add("text-zinc-400")})),t.forEach((e=>{e.classList.remove("line-through"),e.classList.add("text-zinc-400")}))}async function N(o){if(o.target.parentElement.classList.contains("target-board")&&u)try{const[r,n]=B(o.target);return a.placeShip(u,d,r,n,l),z(u),L(),c+=1,5===c&&u===t?(u=!1,i=!0,z(t,!0),k(`${m.getName()}'s turn.`),v("controls"),w("go-home"),void w("toggle-ship-view")):(5===c&&(c=0,u=t,"Computer"===u.getName()?(S(t.domBoard),k("Computer is placing its ships..."),await(async()=>{setTimeout((()=>{for(let e=0;e<s.length;e+=1)a.placeShip(u,s[e],0,0,"",!0),L(e);u=!1,i=!0,S(t.domBoard),k(`${m.getName()}'s turn.`),v("controls"),w("go-home")}),4e3)})()):z(e,!0),C(),S(e.domBoard),S(t.domBoard)),d=s[c],void("Computer"!==u.getName()&&k(`${u.getName()}, place your ${d}.`)))}catch(e){if(e.message.includes("occupied"))return void k("Placement overlaps occupied cells. Try again.");if(e.message.includes("invalid"))return void k("Placement out of bound. Try again.");throw e}if(o.target.parentElement.classList.contains("target-board")&&i&&"Computer"!==m.getName())try{const[e,t]=B(o.target);x(e,t).then((()=>{"Computer"===m.getName()&&x(0,0,!0)}))}catch(e){"coords already attacked"===e.message&&k(`Cell is already attacked. Try again ${m.getName()}`)}}function $(){e=null,t=null,a=null,n=0,i=!1,l="horizontal",c=0,d=s[c],u=null,[m,p]=[],h=!0}function I(){y.classList.add("hidden"),y={}}function T(){b("game-info"),b("boards"),v("controls"),w("play-vs-com"),w("play-coop")}function q(){v("controls"),w("player-customization-form");const e=f.querySelector("form");Array.from(e.children).forEach((e=>{"INPUT"===e.tagName&&"text"===e.type&&(e.value=""),(e.id.includes("player-two")||e.htmlFor?.includes("player-two")||e.innerText.includes("Player 2"))&&(0===n?e.classList.add("hidden"):e.classList.remove("hidden"))}))}function M(e,t){1===e&&(document.getElementById("player-one-name-info").innerText=t),2===e&&(document.getElementById("player-two-name-info").innerText=t)}function P(i){e=new o(i.p1Name,i.p1Color),t=1===n?new o(i.p2Name,i.p2Color):new o("Computer","red"),a=function(e,t=null){const r=e,a=t||new o("Computer","red");let[n,i]=[r,a],l=i.getBoard();return{getActiveBoard:()=>l,getAttackerTarget:()=>[n,i],placeShip:function(e,t,o,r,a="horizontal",n=!1){return e.placeShip(t,o,r,a,n)},placeAttack:function(e,t,o=!1){const r=n.placeAttack(i.getBoard(),e,t,o);return i.getBoard().allShipsAreSunk()?{code:0}:([n,i]=[i,n],l=i.getBoard(),{code:1===n.getBoard().getCells()[r.y][r.x]?1:-1,x:r.x,y:r.y})}}}(e,t),u=e,[m,p]=a.getAttackerTarget(),c=0,d=s[c],Object.assign(e,{domBoard:r()}),Object.assign(t,{domBoard:r()}),function(){const o=document.getElementById("boards"),r=document.getElementById("versus");o.insertBefore(e.domBoard,r),o.append(t.domBoard),m.domBoard.classList.add("target-board"),S(t.domBoard)}(),M(1,e.getName()),M(2,t.getName()),k(`${m.getName()}, place your carrier.`),e.domBoard.addEventListener("click",N),t.domBoard.addEventListener("click",N);const h=e.domBoard.querySelectorAll(".cell"),y=t.domBoard.querySelectorAll(".cell");h.forEach((t=>{t.addEventListener("mouseenter",(t=>{u===e&&E(d,e.domBoard,t.target.dataset.index,l)})),t.addEventListener("mouseleave",(()=>{u===e&&z(e)}))})),y.forEach((e=>{e.addEventListener("mouseenter",(e=>{u===t&&E(d,t.domBoard,e.target.dataset.index,l)})),e.addEventListener("mouseleave",(()=>{u===t&&z(t)}))}))}g.addEventListener("click",(o=>{y&&o.target.classList.contains("popup-backdrop")||o.target.classList.contains("popup-no")?I():(y&&o.target.classList.contains("popup-backdrop")||o.target.classList.contains("popup-yes"))&&(I(),e.domBoard.remove(),t.domBoard.remove(),T(),$(),A())})),f.addEventListener("click",(function(e){if("play-vs-com"===e.target.id)n=0,q();else if("play-coop"===e.target.id)n=1,q();else if("start-game"===e.target.id){const e=function(){const e=document.querySelector("form");return{p1Name:e.querySelector("#player-one-name").value,p1Color:e.querySelector("#player-one-color").value,p2Name:1===n?e.querySelector("#player-two-name").value:null,p2Color:1===n?e.querySelector("#player-two-color").value:null}}();w("boards"),w("game-info"),v("controls"),w("rotate-ship"),P(e)}else"rotate-ship"===e.target.id?l="horizontal"===l?"vertical":"horizontal":"go-home"===e.target.id?i?((t=g).classList.remove("hidden"),y=t):(!function(e){for(;e.firstChild;)e.removeChild(e.firstChild)}(document.getElementById("boards")),T(),$(),A()):"back-home"===e.target.id?(v("controls"),T()):"toggle-ship-view"===e.target.id&&(h=!h,z(m,h));var t}))}()})();