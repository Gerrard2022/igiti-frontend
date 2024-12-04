"use client";

import { useState } from "react";
import { MountedCheck } from "@/lib/mounted-check";

import { Search, X } from "lucide-react";

import SearchInput from "@/components/ui/search-input";
import CartDialog from "@/components/dialog/cart-dialog";

const NavbarActions = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <MountedCheck>
      <nav className="flex items-center justify-end ml-auto transition-all gap-x-2">
   
        <CartDialog />
      </nav>
    </MountedCheck>
  );
};

export default NavbarActions;
