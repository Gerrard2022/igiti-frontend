import Link from "next/link";
import Container from "./ui/container";
import getCategories from "@/actions/get-categories";
import { Category } from "@/types";

const FooterBar = async () => {
  const categories: Category[] = await getCategories();

  const renderLinks = (links: string[]) =>
    links.map((link) => (
      <li key={link}>
        {/* FOR SET BY CUSTOMER */}
        {/* <Link href={`/${link.toLowerCase().replace(/\s/g, "-")}`}>{link}</Link> */}
        <Link href={`/`}>{link}</Link>
      </li>
    ));

  return (
    <div className="px-10 py-6 border-t-2 border-accent/10 ">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 ">
          <nav>
            <h4 className="py-2">
              <span className="border-b-4 border-accent">
                HOME
              </span>
            </h4>
          </nav>
          <nav>
            <h4 className="py-2">
              <span className="border-b-4 border-accent">
                <Link href="https://igiti.africa/contact" 
                 target="_blank" 
                  rel="noopener noreferrer">
                   Contact Us
                </Link>
              </span>
            </h4>
          </nav>
          <nav>
            <h4 className="py-2">
              <span className="border-b-4 border-accent">
              <Link href="https://igiti.africa/faq" 
                 target="_blank" 
                  rel="noopener noreferrer">
                    FAQ
                </Link>
              </span>
            </h4>
          </nav>
          <nav>
            <h4 className="py-2">
              <span className="border-b-4 border-accent">
              <Link href="https://igiti.africa/return-policy" 
                 target="_blank" 
                  rel="noopener noreferrer">
                   Return Policy
                </Link>
              </span>
            </h4>
            <ul className="py-2">
              {categories &&
                categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.id}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </Container>
    </div>
  );
};

export default FooterBar;
