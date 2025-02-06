"use client";

import { useEffect, useState } from "react";
import { MountedCheck } from "@/lib/mounted-check";
import { cn } from "@/lib/utils";

interface CurrencyProps {
  value?: string | number;
  className?: string[];
}

const Currency: React.FC<CurrencyProps> = ({ value, className }) => {
  const [formattedValue, setFormattedValue] = useState("");
  const [location, setLocation] = useState<string>("unknown");

  useEffect(() => {
    const formatPrice = async () => {
      try {
        // Try to get user's country using the native Geolocation API
        if ("geolocation" in navigator) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          
          // Using reverse geocoding to get country information
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const country = data.address.country;
          setLocation(country || "unknown");
          
          // Check if in Africa (you can expand this list)
          const africanCountries = ["Rwanda", "Kenya", "Uganda", "Tanzania", "Burundi"];
          const isAfrica = africanCountries.includes(country);
          
          // Format the price
          const numericValue = Number(value);
          if (isAfrica) {
            const rwfValue = numericValue * 1000;
            setFormattedValue(`${rwfValue.toLocaleString()} RWF`);
          } else {
            setFormattedValue(
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(numericValue)
            );
          }
        } else {
          // Fallback to USD if geolocation is not available
          setFormattedValue(
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(value))
          );
        }
      } catch (error) {
        console.error("Error detecting location:", error);
        // Fallback to USD formatting
        setFormattedValue(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(value))
        );
      }
    };

    formatPrice();
  }, [value]);

  return (
    <MountedCheck>
      <span className={cn("font-semibold", ...(className || []))}>
        {formattedValue}
      </span>
    </MountedCheck>
  );
};

export default Currency;