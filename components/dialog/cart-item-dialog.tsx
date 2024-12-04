import Image from "next/image";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { CartItem } from "@/types";

interface CartItemProps {
  data: CartItem;
}

const CartItemDialog: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.product.id);
  };

  const decreaseQuantity = () => {
    cart.decreaseItem(data.product.id);
  };

  const increaseQuantity = () => {
    cart.addItem(data.product);
  };

  return (
    <li className="flex items-center py-4 border-b">
      <div className="relative w-20 h-20 overflow-hidden rounded-md">
        <Image
          fill
          src={data.product.images[0]!.url}
          alt={data.product.name}
          className="object-cover object-center"
        />
      </div>
      <div className="relative flex flex-col justify-between flex-1 ml-4">
        <div className="absolute right-0 z-10 top-6">
          <IconButton onClick={onRemove} icon={<Trash2 size={15} />} />
        </div>
        <div className="relative pr-9">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">
              {data.product.name}
            </p>
          </div>
          {/* Quantity control section */}
          <div className="flex mb-2 text-sm items-center gap-x-2">
            <p className="text-gray-500">Quantity:</p>
            {/* Decrease Button */}
            <IconButton
              onClick={decreaseQuantity}
              icon={<ChevronDown size={15} />}
              aria-label="Decrease quantity"
            />
            <p className="font-semibold">{data.quantity}</p>
            {/* Increase Button */}
            <IconButton
              onClick={increaseQuantity}
              icon={<ChevronUp size={15} />}
              aria-label="Increase quantity"
            />
          </div>
          <Currency value={data.product.price * data.quantity} />
        </div>
      </div>
    </li>
  );
};

export default CartItemDialog;
