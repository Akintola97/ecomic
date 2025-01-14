import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import StoreModal from "./StoreModal";

const { client } = require("@/sanity/lib/client");

const fetchStoreData = async() =>{
    const query = `
    *[_type == "storeProducts"]{
    _id,
    title,
    category,
    "current_slug":slug.current,
    image,
    description,
    price,
    inventory,
    author,
    artist
    }`;
    const data = await client.fetch(query);
    return data;
}



export default async function ProductItems(){
    const {isAuthenticated} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();


    const data = await fetchStoreData();


    return(
        <div className="w-full min-h-[65vh] md:min-h-[60vh] lg:min-h-[70vh] dark:bg-black bg-gray-200 h-auto flex flex-col justify-center">
            <h1 className="font-bold text-center text-2xl pt-10 pb-5">
                Comics
            </h1>
            <StoreModal data={data} isUserAuthenticated = {isUserAuthenticated} />
        </div>
    )
}