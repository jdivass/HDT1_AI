export interface CartItem {
  productId: string;
  quantity: number;
}

export type OperationStatus = "added" | "updated" | "removed" | "not_found";

export interface OperationResult {
  status: OperationStatus;
  cart: CartItem[];
}

export type Command =
  | { kind: "operation"; productId: string; quantity: number }
  | { kind: "exit" }
  | { kind: "invalid"; reason: string };
