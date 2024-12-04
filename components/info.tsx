"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(data);
  };

  return (
    <nav>
      {/* Name */}
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>

      {/* Price */}
      <section className="flex items-end justify-between mt-3">
        <p className="text-2xl text-gray-900">
          <Currency value={data.price} />
        </p>
      </section>
      <hr className="my-4" />

      {/* Description */}
      <section>
        <h2 className="text-lg font-semibold">Description</h2>
        <p className="text-gray-700 mt-2">{data.description}</p>
      </section>

      {/* Add to cart */}
      <div className="flex items-center mt-4 gap-x-3">
        <Button
          onClick={onAddToCart}
          className="flex items-center gap-x-2 bg-accent"
        >
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </nav>
  );
};

export default Info;
