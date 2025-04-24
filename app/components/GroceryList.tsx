"use client";
import { useState, useEffect } from "react";

interface Item {
  id: number;
  name: string;
  quantity: number;
  purchased: boolean;
}

interface GroceryListProps {
  id: number;
  name: string;
}

export function GroceryList({ id, name }: GroceryListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  useEffect(() => {
    fetchItems();
  }, [id]);

  const fetchItems = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/grocery-lists/${id}/items`);
    const data = await response.json();
    setItems(data);
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${process.env.BACKEND_URL}/grocery-lists/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItemName, quantity: newItemQuantity }),
    });
    setNewItemName("");
    setNewItemQuantity(1);
    fetchItems();
  };

  const togglePurchased = async (itemId: number, currentPurchaseState: boolean) => {
    const endpoint = currentPurchaseState ? 'unpurchase' : 'purchase';
    await fetch(`${process.env.BACKEND_URL}/grocery-lists/${id}/items/${itemId}/${endpoint}`, {
      method: "PUT",
    });
    fetchItems();
  };

  const deleteItem = async (itemId: number) => {
    await fetch(`${process.env.BACKEND_URL}/grocery-lists/${id}/items/${itemId}`, {
      method: "DELETE",
    });
    fetchItems();
  };

  return (
    <div className="border rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <h2 className="text-2xl font-bold mb-4 text-black truncate">{name}</h2>
      <form onSubmit={addItem} className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Item name"
          className="flex-1 min-w-[140px] px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-black placeholder:text-gray-500"
        />
        <div className="flex gap-2 min-w-[140px] flex-1 sm:flex-none">
          <input
            type="number"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
            min="1"
            className="w-20 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-black"
          />
          <button 
            type="submit" 
            className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium shadow-sm whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </form>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 group">
            <div className="relative">
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={() => togglePurchased(item.id, item.purchased)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors duration-200"
              />
            </div>
            <span className={`flex-1 transition-all duration-200 ${
              item.purchased 
                ? "line-through text-black" 
                : "text-black"
            }`}>
              <span className="font-medium">{item.name}</span>
              <span className="text-sm ml-2 text-black opacity-75">({item.quantity})</span>
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 px-2 py-1 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 text-sm font-medium"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && (
        <p className="text-center text-black opacity-60 text-sm py-4">
          No items in this list yet
        </p>
      )}
    </div>
  );
}
