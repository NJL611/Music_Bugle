import{u as f,r as l,bw as P,j as e,av as h,bx as j,by as b,a1 as I,aw as k,bz as B,at as E,ak as H,bA as v,q as w}from"./sanity-81459e8b.js";const y=f(w)`
  position: relative;
`;function C(a){const{children:o}=a,{collapsed:t}=b();return e.jsx(y,{hidden:t,height:"fill",overflow:"auto",children:o})}function A(a){const{actionHandlers:o,index:t,menuItems:n,menuItemGroups:r,title:i}=a,{features:s}=I();return!(n!=null&&n.length)&&!i?null:e.jsx(k,{actions:e.jsx(B,{menuItems:n,menuItemGroups:r,actionHandlers:o}),backButton:s.backButton&&t>0&&e.jsx(E,{as:H,"data-as":"a",icon:v,mode:"bleed",tooltipProps:{content:"Back"}}),title:i})}function T(a){const{index:o,pane:t,paneKey:n,...r}=a,{child:i,component:s,menuItems:c,menuItemGroups:d,type:R,...m}=t,[u,p]=l.useState(null),{title:x=""}=P(t);return e.jsxs(h,{id:n,minWidth:320,selected:r.isSelected,children:[e.jsx(A,{actionHandlers:u==null?void 0:u.actionHandlers,index:o,menuItems:c,menuItemGroups:d,title:x}),e.jsxs(C,{children:[j.isValidElementType(s)&&l.createElement(s,{...r,...m,ref:p,child:i,paneKey:n}),l.isValidElement(s)&&s]})]})}export{T as default};
