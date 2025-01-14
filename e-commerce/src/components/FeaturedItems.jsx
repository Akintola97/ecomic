import { client } from "@/sanity/lib/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import FeaturedItemsModal from "./FeaturedItemsModal";

const featuredData = async()=>{
    const query = `
    *[_type == "featuredProducts"]{
    _id,
    title,
    category,
    "current_slug":slug.current,
    image,
    description,
    price,
    inventory 
    }`;
    const data = client.fetch(query);
    return data;
}





export default async function FeaturedItems(){
    const {isAuthenticated} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

    const data = await featuredData();

    return(
        <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] h-auto flex flex-col justify-center">
            <h1 className="font-bold text-center text-2xl pt-5 pb-10">Featured Items</h1>
            <FeaturedItemsModal data={data} isUserAuthenticated = {isUserAuthenticated} />
        </div>
    )
}