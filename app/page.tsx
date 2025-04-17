"use client";
import { useState, useEffect } from "react";
import { GroceryList } from "./components/GroceryList";

interface List {
  id: number;
  name: string;
}

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const response = await fetch("http://localhost:4000/grocery-lists");
    const data = await response.json();
    setLists(data);
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:4000/grocery-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newListName }),
    });
    setNewListName("");
    fetchLists();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto grid grid-rows-[auto_1fr] min-h-screen p-8 pb-20 gap-8 sm:p-20">
        <div>
          <h1 className="text-4xl font-bold mb-8 text-black text-center sm:text-left">
            My Grocery Lists
          </h1>
          <form onSubmit={createList} className="flex gap-4 mb-8 max-w-md mx-auto sm:mx-0">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New list name"
              className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black placeholder:text-gray-500"
            />
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Create List
            </button>
          </form>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min">
          {lists.map((list) => (
            <GroceryList key={list.id} id={list.id} name={list.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
