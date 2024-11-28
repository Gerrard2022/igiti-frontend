import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async (): Promise<Category[]> => {
  console.log(URL);
  
  const res = await fetch(URL);

  console.log("response here", res);

  return res.json();
 
  
};

export default getCategories;
