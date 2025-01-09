// import Link from "next/link";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// // Import the CartBadge client component
// import HamburgerNav from "./HamburgerNav"; // also a client component
// // Example theme toggle (you can remove if you don't need it)
// import { ModeToggle } from "./modeToggle";

// export default async function Nav() {
// const { getUser } = getKindeServerSession();
// const user = await getUser();

// const { isAuthenticated } = getKindeServerSession();
// const isUserAuthenticated = await isAuthenticated();

// return (
//   <nav className="w-full h-[8vh] fixed top-0 left-0 right-0 bg-black flex items-center justify-between text-white px-2 z-50 font-poppins capitalize">
//     <div className="flex items-center text-white p-3">
//       <Link href="/">
//         <h1 className="font-bold">Blog</h1>
//       </Link>
//     </div>
//     <div className="flex items-center space-x-4">
//       <ModeToggle />
//       <HamburgerNav user={user} isUserAuthenticated={isUserAuthenticated} />
//     </div>
//   </nav>
// );
// }





// components/Nav.jsx
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Import the CartBadge client component
import HamburgerNav from "./HamburgerNav"; // also a client component
import CartBadge from "./CartBadge"; // newly created client component
// Example theme toggle (you can remove if you don't need it)
import { ModeToggle } from "./modeToggle";

export default async function Nav() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <nav className="w-full h-[8vh] fixed top-0 left-0 right-0 bg-black flex items-center justify-between text-white px-2 z-50 font-poppins capitalize">
      <div className="flex items-center text-white p-3">
        <Link href="/">
          <h1 className="font-bold">Comics</h1>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {/* Include the CartBadge component */}
        <CartBadge />
        <HamburgerNav user={user} isUserAuthenticated={isUserAuthenticated} />
      </div>
    </nav>
  );
}