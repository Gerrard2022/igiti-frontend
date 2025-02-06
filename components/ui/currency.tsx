"use client";

import { useEffect, useState } from "react";
import { MountedCheck } from "@/lib/mounted-check";
import { cn, getLocationFormatter } from "@/lib/utils";

interface CurrencyProps {
  value?: string | number;
  className?: string[];
}

const Currency: React.FC<CurrencyProps> = ({ value, className }) => {
  const [formattedValue, setFormattedValue] = useState("");

  useEffect(() => {
    const formatPrice = async () => {
      const formatter = await getLocationFormatter();
      setFormattedValue(formatter.format(Number(value)));
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
