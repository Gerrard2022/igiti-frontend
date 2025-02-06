import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const getLocationFormatter = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const isAfrica = data.continent_code === 'AF';

    return {
      format: (value: number) => {
        if (isAfrica) {
          // Format RWF without currency symbol, then add RWF at the end
          const rwfValue = value * 1000;
          return `${rwfValue.toLocaleString('en-RW')} RWF`;
        } else {
          // Format USD with currency symbol
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value);
        }
      },
      isAfrica
    };
  } catch (error) {
    // Fallback to USD formatting if location check fails
    return {
      format: (value: number) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value),
      isAfrica: false
    };
  }
};