import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./types";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (line: CartLine) => void;
  removeItem: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (line) => {
        const existing = get().lines.find((l) => l.variantId === line.variantId);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.variantId === line.variantId ? { ...l, qty: l.qty + line.qty } : l
            ),
            isOpen: true,
          });
        } else {
          set({ lines: [...get().lines, line], isOpen: true });
        }
      },
      removeItem: (variantId) =>
        set({ lines: get().lines.filter((l) => l.variantId !== variantId) }),
      setQty: (variantId, qty) =>
        set({
          lines: get()
            .lines.map((l) => (l.variantId === variantId ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "mandem-cart",
      // Only persist cart lines — `isOpen` must always start closed on a
      // fresh page load/navigation, otherwise a reload can land with the
      // drawer stuck open over the page (e.g. covering checkout).
      partialize: (state) => ({ lines: state.lines }),
    }
  )
);

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}
