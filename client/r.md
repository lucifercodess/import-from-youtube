import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

// Playlist Card Component for Drag and Drop
const PlaylistCard = ({ id, index, moveCard }) => {
  const [, ref] = useDrag({
    type: "card",
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: "card",
    hover: (item) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className="p-4 bg-gray-700 rounded-lg mb-2"
    >
      Playlist {id}
    </div>
  );
};

// Playlist Component to Manage Layout and Cards
const Playlist = () => {
  const [cards, setCards] = useState([
    { id: "1", index: 0 },
    { id: "2", index: 1 },
    { id: "3", index: 2 },
  ]);

  const moveCard = (from, to) => {
    const updatedCards = [...cards];
    const [moved] = updatedCards.splice(from, 1);
    updatedCards.splice(to, 0, moved);

    updatedCards.forEach((card, idx) => (card.index = idx));
    setCards(updatedCards);
  };

  const handleSaveLayout = async () => {
    try {
      const formattedLayout = cards.map((card, index) => ({
        id: card.id,
        position: index,
      }));
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://localhost:3000/api/auth/save-layout",
          { layout: formattedLayout },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Layout saved!");
      } else {
        alert("No token found.");
      }
    } catch (error) {
      console.error("Error saving layout:", error);
      alert("Error saving layout");
    }
  };

  const handleLoadLayout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get(
          "http://localhost:3000/api/auth/load-layout",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCards(res.data.layout);
      } else {
        alert("No token found.");
      }
    } catch (error) {
      console.error("Error loading layout:", error);
      alert("Error loading layout");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {cards.map((card, index) => (
          <PlaylistCard
            key={card.id}
            id={card.id}
            index={index}
            moveCard={moveCard}
          />
        ))}
        <button
          onClick={handleSaveLayout}
          className="bg-green-500 p-2 rounded-lg"
        >
          Save Layout
        </button>
        <button
          onClick={handleLoadLayout}
          className="bg-blue-500 p-2 rounded-lg ml-2"
        >
          Load Layout
        </button>
      </div>
    </DndProvider>
  );
};

export default Playlist;