import CartData from "@/components/CartData";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Cart() {
  const {isAuthenticated} = getKindeServerSession();
  const auth = await isAuthenticated();


  if(!auth){
    redirect('/')
  }
  return (
    <>
      <CartData isUserAuthenticated = {auth} />
    </>
  );
};