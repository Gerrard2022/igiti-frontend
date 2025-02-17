"use client";

import { useEffect, useState } from "react";
import { MountedCheck } from "@/lib/mounted-check";
import { cn } from "@/lib/utils";

interface CurrencyProps {
  value?: string | number;
  className?: string[];
  onCountryDetect?: (country: string) => void;
}

const Currency: React.FC<CurrencyProps> = ({ value, className, onCountryDetect }) => {
  const [formattedValue, setFormattedValue] = useState("");
  const [location, setLocation] = useState<string>("unknown");

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get user's country using the native Geolocation API
        if ("geolocation" in navigator) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          
          // Using reverse geocoding to get country information
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const country = data.address.country || "unknown";
          
          setLocation(country);
          
          // Check if in Africa (you can expand this list)
          const africanCountries = [
            "Rwanda", "Kenya", "Uganda", "Tanzania", "Burundi", 
            "Nigeria", "South Africa", "Egypt", "Algeria", "Morocco",
            "Ethiopia", "Ghana", "Angola", "Mozambique"
          ];
          
          const isAfrica = africanCountries.some(africanCountry => 
            country.toLowerCase().includes(africanCountry.toLowerCase())
          );
          
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

          // Call the callback if provided
          if (onCountryDetect) {
            onCountryDetect(country);
          }

          console.log("Detected location:", country);
          console.log("Is Africa:", isAfrica);
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

    detectLocation();
  }, [value, onCountryDetect]);

  console.log("Current location:", location);
  console.log("Formatted price:", formattedValue);
  console.log("Original value:", value);

  return (
    <MountedCheck>
      <span className={cn("font-semibold", ...(className || []))}>
        {formattedValue}
      </span>
    </MountedCheck>
  );
};

export default Currency;