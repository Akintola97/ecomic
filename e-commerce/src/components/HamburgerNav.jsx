// "use client";

// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import Link from "next/link";
// import Image from "next/image";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import {
//   RegisterLink,
//   LoginLink,
//   LogoutLink,
// } from "@kinde-oss/kinde-auth-nextjs/components";
// import { Button } from "@/components/ui/button";
// import React, { useState, useRef, useEffect } from "react";

// export default function HamburgerNav({ user, isUserAuthenticated, userId }) {
//   const [open, setOpen] = useState(false); // Track the state of the hamburger menu
//   const menuRef = useRef(null); // Reference to the menu container for outside click detection

//   // Open the menu
//   const handleOpen = () => setOpen(true);

//   // Close the menu
//   const handleClose = () => setOpen(false);

//   // Close the menu if a click occurs outside the menu container
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Extract relevant user details
//   const { id, picture, given_name } = user || {};

//   return (
//     <>
//       {/* Hamburger Menu Icon */}
//       <div className="p-3 cursor-pointer">
//         <MenuIcon
//           onClick={handleOpen}
//           className="h-8 w-8 hover:text-foreground"
//         />
//       </div>
//       {/* Hamburger Menu Container */}
//       <div
//         ref={menuRef}
//         className={`fixed top-0 right-0 h-full md:w-[35%] w-full bg-black transform ${
//           open ? "translate-x-0" : "translate-x-full"
//         } transition-transform duration-300 ease-in-out z-40`}
//       >
//         {/* Close Button */}
//         <div className="flex items-center justify-end p-5 font-bold">
//           <CloseIcon
//             className="h-8 w-8 cursor-pointer hover:text-destructive"
//             onClick={handleClose}
//           />
//         </div>
//         {/* Menu Content */}
//         <div className="w-full h-[50%] flex justify-center items-center">
//           <ul className="text-white flex flex-col justify-center items-center">
//             {!isUserAuthenticated ? (
//               <>
//                 <li className="p-5">
//                   <LoginLink onClick={handleClose}>
//                     <h3 className="transform transition duration-300 hover:text-foreground">
//                       Login
//                     </h3>
//                   </LoginLink>
//                 </li>
//                 <li className="p-5">
//                   <RegisterLink onClick={handleClose}>
//                     <h3 className="transform transition duration-300 hover:text-foreground">
//                       Register
//                     </h3>
//                   </RegisterLink>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="p-5 text-2xl capitalize flex flex-col items-center">
//                   {/* Ensure `src` is valid */}
//                   <Image
//                     key={id}
//                     src={picture || "/profile.webp"} // Fallback to "/profile.webp" if `picture` is undefined
//                     height={100}
//                     width={100}
//                     alt={`${given_name}'s profile picture`}
//                     className="rounded-full border-2"
//                   />
//                   <h2 className="mt-4 transform transition duration-300">
//                     Hi, {given_name}
//                   </h2>
//                 </li>
//                 <li className="relative p-5">
//                   {/* Link to the cart page with userId */}
//                   <Link onClick={handleClose} href={`/cart?userId=${userId}`}>
//                     <ShoppingCartIcon />
//                   </Link>
//                 </li>
//                 <li className="p-5">
//                   {/* Logout button */}
//                   <LogoutLink onClick={handleClose}>
//                     <Button variant="destructive">
//                       <h3 className="dark:text-white">Logout</h3>
//                     </Button>
//                   </LogoutLink>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// }







"use client";

import React, { useState, useRef, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

// Import the same CartBadge client component
import CartBadge from "./CartBadge";

export default function HamburgerNav({
  user,
  isUserAuthenticated,
  userId,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { id, picture, given_name } = user || {};

  return (
    <>
      {/* Hamburger Menu Icon */}
      <div className="p-3 cursor-pointer">
        <MenuIcon
          onClick={() => setOpen(true)}
          className="h-8 w-8 hover:text-foreground"
        />
      </div>

      {/* Sliding Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full md:w-[35%] w-full bg-black
          transform ${open ? "translate-x-0" : "translate-x-full"}
          transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-end p-5 font-bold">
          <CloseIcon
            className="h-8 w-8 cursor-pointer hover:text-destructive"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Menu Content */}
        <div className="w-full h-[50%] flex justify-center items-center">
          <ul className="text-white flex flex-col justify-center items-center">
            {!isUserAuthenticated ? (
              <>
                <li className="p-5">
                  <LoginLink onClick={() => setOpen(false)}>
                    <h3 className="transform transition duration-300 hover:text-foreground">
                      Login
                    </h3>
                  </LoginLink>
                </li>
                <li className="p-5">
                  <RegisterLink onClick={() => setOpen(false)}>
                    <h3 className="transform transition duration-300 hover:text-foreground">
                      Register
                    </h3>
                  </RegisterLink>
                </li>
              </>
            ) : (
              <>
                <li className="p-5 text-2xl capitalize flex flex-col items-center">
                  <Image
                    key={id}
                    src={picture || "/profile.webp"}
                    height={100}
                    width={100}
                    alt={`${given_name}'s profile`}
                    className="rounded-full border-2"
                  />
                  <h2 className="mt-4 transform transition duration-300">
                    Hi, {given_name}
                  </h2>
                </li>
                <li className="relative p-5">
                  {/* Link to cart page using the same userId */}
                  <Link onClick={() => setOpen(false)} href={`/cart?userId=${userId}`}>
                    {/* Use the same CartBadge component */}
                    <CartBadge userId={userId} />
                  </Link>
                </li>
                <li className="p-5">
                  <LogoutLink onClick={() => setOpen(false)}>
                    <Button variant="destructive">
                      <h3 className="dark:text-white">Logout</h3>
                    </Button>
                  </LogoutLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}