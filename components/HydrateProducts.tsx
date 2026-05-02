"use client";

import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";

export default function HydrateProducts() {
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    if (typeof fetchProducts === "function") fetchProducts();
  }, [fetchProducts]);

  return null;
}
