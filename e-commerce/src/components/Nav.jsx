// import Link from "next/link";
// import { ModeToggle } from "./modeToggle";
// import HamburgerNav from "./HamburgerNav";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// export default async function Nav() {
//   // Retrieve user and authentication status from the session
//   const { getUser, isAuthenticated } = getKindeServerSession();
//   const user = await getUser(); // Fetch the authenticated user's details
//   const isUserAuthenticated = await isAuthenticated(); // Check if the user is authenticated
//   const userId = user?.id || null; // Extract user ID if available

//   return (
//     <nav className="w-full h-[8vh] fixed top-0 left-0 right-0 bg-black flex items-center justify-between text-white px-2 z-50 font-poppins capitalize">
//       <div className="flex items-center text-white p-3">
//         {/* Logo or Home Link */}
//         <Link href="/">
//           <h1 className="font-bold">Comics</h1>
//         </Link>
//       </div>
//       <div className="flex items-center space-x-4">
//         {/* Conditionally display cart link if user is authenticated */}
//         {isUserAuthenticated && (
//           <Link href={`/cart?userId=${userId}`}>
//             <ShoppingCartIcon />
//           </Link>
//         )}
//         {/* Theme toggle button */}
//         <ModeToggle />
//         {/* Pass user and authentication details to HamburgerNav */}
//         <HamburgerNav
//           user={user}
//           isUserAuthenticated={isUserAuthenticated}
//           userId={userId}
//         />
//       </div>
//     </nav>
//   );
// }




import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Import the CartBadge client component
import CartBadge from "./CartBadge";
import HamburgerNav from "./HamburgerNav"; // also a client component
// Example theme toggle (you can remove if you don't need it)
import { ModeToggle } from "./modeToggle";

export default async function Nav() {
  // Retrieve user from the session
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser(); // user object if logged in
  const isUserAuthenticated = await isAuthenticated();
  const userId = user?.id || null;

  return (
    <nav className="w-full h-[8vh] fixed top-0 left-0 right-0 bg-black flex items-center justify-between text-white px-2 z-50 font-poppins capitalize">
      <div className="flex items-center text-white p-3">
        <Link href="/">
          <h1 className="font-bold">Comics</h1>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* If user is authenticated, show link to cart + the cart badge */}
        {isUserAuthenticated && userId && (
          <Link href={`/cart?userId=${userId}`}>
            <CartBadge userId={userId} />
          </Link>
        )}
        {/* A theme toggle or any other nav controls */}
        <ModeToggle />
        {/* A hamburger nav (client component) with user info */}
        <HamburgerNav
          user={user}
          isUserAuthenticated={isUserAuthenticated}
          userId={userId}
        />
      </div>
    </nav>
  );
}