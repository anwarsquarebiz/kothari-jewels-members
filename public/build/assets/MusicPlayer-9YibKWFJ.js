import{b as n,r as i,j as e}from"./app-moOJXgw8.js";/* empty css            */function c({bg:t}){const{isPlaying:s,toggleMusic:a}=n(),r=i.useRef(null);return i.useEffect(()=>{r.current&&(s?r.current.style.animation="spin 2s linear infinite":r.current.style.animation="none")},[s]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}),e.jsxs("button",{ref:r,onClick:a,className:`fixed right-4 bottom-4 z-[50] flex aspect-square w-13 cursor-pointer items-center justify-center rounded-full border p-1 transition-transform duration-200 hover:scale-110 ${t==="black"?"border-black/30 bg-black/20":"border-white/30 bg-white/20"}`,"aria-label":"Toggle music",children:[e.jsx("div",{className:`absolute h-3 w-3 rounded-full ${t==="black"?"bg-white":"bg-black"}`}),e.jsx("img",{src:"/media/landing-page/music.gif",className:"h-full w-full rounded-full object-cover",alt:"Music toggle"})]})]})}export{c as MusicPlayer};
