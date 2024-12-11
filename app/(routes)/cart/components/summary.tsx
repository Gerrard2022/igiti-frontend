"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const [shippingDetails, setShippingDetails] = useState({
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const onCheckout = async () => {
    try {
      // Log the request body for debugging
      console.log("Checkout Request:", {
        products: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingDetails,
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          products: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          shippingDetails, // Include shipping details
        }
      );

      // Redirect to the payment URL
      window.location.href = response.data.url;
    } catch (error: any) {
      // Improved error handling
      console.error("Checkout Error:", error);
      toast.error(error?.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      {/* Order summary */}
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6">
        {items.map((item) => (
          <div
            className="flex items-center justify-between py-2 border-t border-gray-200"
            key={item.product.id}
          >
            <div className="flex flex-col text-sm font-light items-center">
              <span className="font-semibold">{item.product.name}</span>
              <div className="text-xs">(x{item.quantity})</div>
            </div>

            <Currency
              className={["font-light", "text-sm"]}
              value={item.product.price * item.quantity}
            />
          </div>
        ))}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <div className="mt-4">
        {/* Form for Shipping Details */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
          <input
            type="text"
            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={shippingDetails.addressLine1}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, addressLine1: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={shippingDetails.city}
              onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={shippingDetails.state}
              onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={shippingDetails.zipCode}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, zipCode: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={shippingDetails.country}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, country: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={shippingDetails.phoneNumber}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, phoneNumber: e.target.value })
            }
          />
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
