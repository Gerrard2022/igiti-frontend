"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Input } from "@/components/ui/input";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const [isLoading, setIsLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
  });
  const [location, setLocation] = useState("Rwanda");

  useEffect(() => {
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");
    
    if (orderId && (status === 'success' || status === 'canceled')) {
      const checkPaymentStatus = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/checkout?orderId=${orderId}&status=${status}`
          );
          
          if (response.data.isPaid) {
            toast.success("Payment completed successfully!");
            removeAll();
          } else if (status === 'canceled') {
            toast.error("Payment was cancelled.");
          } else if (response.data.status === 'FAILED') {
            toast.error("Payment failed. Please try again.");
          } else {
            toast.loading("Processing payment...");
          }

          console.log('Payment status response:', response.data);
        } catch (error) {
          console.error('Error checking payment status:', error);
          toast.error("Failed to verify payment status");
        } finally {
          setIsLoading(false);
        }
      };

      checkPaymentStatus();
    }

    // Try to get user's location
    const getLocation = async () => {
      try {
        if ("geolocation" in navigator) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.address?.country) {
            setLocation(data.address.country);
          }
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    getLocation();
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const onCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          products: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          shippingDetails,
          location,
        }
      );
      
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(error?.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
          <Input
            type="text"
            value={shippingDetails.addressLine1}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, addressLine1: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <Input
              type="text"
              value={shippingDetails.city}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, city: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <Input
              type="text"
              value={shippingDetails.state}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, state: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
            <Input
              type="text"
              value={shippingDetails.zipCode}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, zipCode: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <Input
              type="text"
              value={shippingDetails.country}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, country: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            type="text"
            value={shippingDetails.phoneNumber}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, phoneNumber: e.target.value })
            }
          />
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={isLoading || items.length === 0}
        className={`w-full mt-6 px-4 py-2 rounded-md font-medium text-white ${
          isLoading || items.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          "Checkout"
        )}
      </button>
    </div>
  );
};

export default Summary;