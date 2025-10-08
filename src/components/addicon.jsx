import React, { useState, useEffect } from "react";
import { userAuth } from "./authcontext";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const BookIconComponent = () => {
  const { session } = userAuth();
  const [cards, setCards] = useState(() => {
    // Load saved notes from localStorage on first render
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [openCard, setOpenCard] = useState(null);
  const [modalContent, setModalContent] = useState({ title: "", description: "" });
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [loading, setLoading] = useState(false);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(cards));
  }, [cards]);

  // Gemini setup
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const fontOptions = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Courier New", value: "'Courier New', monospace" },
  ];

  const handleCreateClick = () => {
    if (!session) {
      alert("You must be logged in to create a note.");
      return;
    }
    const newCard = { id: Date.now(), title: "Note Title", description: "" };
    setCards(prev => [...prev, newCard]);
  };

  const handleDeleteCard = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const handleTitleChange = (id, newTitle) => {
    setCards(prev =>
      prev.map(card => (card.id === id ? { ...card, title: newTitle } : card))
    );
  };

  const handleOpenModal = (card) => {
    setOpenCard(card);
    setModalContent({ title: card.title, description: card.description });
    setSelectedFont("Arial");
  };

  const handleCloseModal = () => {
    setCards(prev =>
      prev.map(card =>
        card.id === openCard.id
          ? { ...card, title: modalContent.title, description: modalContent.description }
          : card
      )
    );
    setOpenCard(null);
  };

  // 🔹 Precise Rewrite using Gemini
  const handleRewrite = async () => {
    if (!modalContent.description.trim()) {
      alert("Please write something before rewriting!");
      return;
    }

    setLoading(true);
    try {
      const prompt = `
        Rewrite the following note text in a short, precise, and clear way.
        - only explain the text in easy way if asking question explain question only not give answer
        Text:
        """${modalContent.description}"""
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = (await response.text()).trim();

      setModalContent(prev => ({
        ...prev,
        description: text || "No response received."
      }));
    } catch (error) {
      console.error("Gemini API Error:", error);
      alert("Failed to rewrite text. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Optional Clear All button
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all notes?")) {
      setCards([]);
      localStorage.removeItem("notes");
    }
  };

  return (
    <div className="book-icon-wrapper">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <i className="pi pi-book" id="icon" onClick={handleCreateClick}>
          {" "}Create
        </i>
        {cards.length > 0 && (
          <Button label="Clear All" severity="danger" onClick={handleClearAll} />
        )}
      </div>

      <div className="card-list">
        {cards.map(card => (
          <div
            className="note-card"
            key={card.id}
            onClick={() => handleOpenModal(card)}
          >
            <div className="card-header" onClick={(e) => e.stopPropagation()}>
              {editingId === card.id ? (
                <input
                  className="editable-title"
                  value={card.title}
                  onChange={(e) => handleTitleChange(card.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                  autoFocus
                />
              ) : (
                <h3
                  className="card-title"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingId(card.id);
                  }}
                >
                  {card.title}
                </h3>
              )}
              <i
                className="pi pi-trash delete-icon"
                title="Delete note"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCard(card.id);
                }}
              />
            </div>
            <p className="card-description">
              {card.description
                ? card.description.slice(0, 100) +
                  (card.description.length > 100 ? "..." : "")
                : "Click to expand"}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {openCard && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <input
              className="modal-title"
              value={modalContent.title}
              onChange={(e) => setModalContent({ ...modalContent, title: e.target.value })}
            />

            <div
              style={{
                marginBottom: "1rem",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              <Dropdown
                id="fontSelect"
                value={selectedFont}
                options={fontOptions}
                onChange={(e) => setSelectedFont(e.value)}
                placeholder="Choose a font"
                style={{ width: "200px" }}
              />

              <Button
                label={loading ? "Rewriting..." : "Rewrite"}
                disabled={loading}
                onClick={handleRewrite}
              />
            </div>

            <textarea
              className="modal-description"
              value={modalContent.description}
              placeholder="Write your detailed note..."
              onChange={(e) => setModalContent({ ...modalContent, description: e.target.value })}
              rows={10}
              style={{ fontFamily: selectedFont }}
            />

            <div className="modal-actions">
              <button onClick={handleCloseModal}>Save & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
