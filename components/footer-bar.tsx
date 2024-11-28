import Link from "next/link";
import Container from "./ui/container";
import getCategories from "@/actions/get-categories";
import { Category } from "@/types";

const FooterBar = async () => {

  const helpLinks = [
    "SALE FAQ",
    "Store locator",
    "30 day returns policy",
    "Claims",
    "Delivery times",
    "Types of payment",
    "Size Guide",
    "Help and Contact",
  ];
  const aboutLinks = [
    "About us",
    "Our commitments",
    "Career",
    "Pressroom",
    "Newsletter",
  ];
  const termsLinks = [
    "Privacy Policy",
    "Terms",
    "Cookie Policy",
    "Cookie settings",
  ];

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
      FOOTER HERE
    </div>
  );
};

export default FooterBar;
