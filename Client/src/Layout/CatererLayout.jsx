// src/layout/CatererLayout.jsx
import React from "react";


export default function CatererLayout({ children }) {
 return (
   <div>
     <header>Header or Sidebar</header>
     <main>{children}</main> {/* <--- this is key */}
   </div>
 );
}
