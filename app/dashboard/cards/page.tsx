"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCards, deleteCard, updateCard, Card } from "@/actions/cardActions";
import {
  DeleteModal,
  EditModal,
  SearchBar,
  CardGrid,
  EmptyState,
  LoadingState,
} from "@/components/cards";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CardPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedCards, setDisplayedCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"tag" | "language">("tag");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cardId: string | null;
    cardTitle: string;
  }>({
    isOpen: false,
    cardId: null,
    cardTitle: "",
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    card: Card | null;
  }>({
    isOpen: false,
    card: null,
  });

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    // Filter cards based on search query
    if (searchQuery.trim() === "") {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter((card) => {
        if (searchType === "tag") {
          return card.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          return card.language
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
      });
      setFilteredCards(filtered);
    }
  }, [cards, searchQuery, searchType]);

  useEffect(() => {
    // Display first 6 cards from filtered results
    setDisplayedCards(filteredCards.slice(0, 6));
    setCurrentIndex(6);
  }, [filteredCards]);

  const loadCards = async () => {
    try {
      const fetchedCards = await getCards();
      setCards(fetchedCards);
    } catch (error) {
      console.error("Card fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => {
    const nextCards = filteredCards.slice(currentIndex, currentIndex + 6);
    setDisplayedCards([...displayedCards, ...nextCards]);
    setCurrentIndex(currentIndex + 6);
  };

  const handleDelete = (cardId: string, cardTitle: string) => {
    setDeleteModal({ isOpen: true, cardId, cardTitle });
  };

  const confirmDelete = async () => {
    if (!deleteModal.cardId) return;

    try {
      await deleteCard(deleteModal.cardId);
      await loadCards(); // Reload cards
      setDeleteModal({ isOpen: false, cardId: null, cardTitle: "" });
      toast.success("Card deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete card");
    }
  };

  const handleEdit = (card: Card) => {
    setEditModal({ isOpen: true, card });
  };

  const saveEdit = async (formData: {
    question: string;
    answer: string;
    language: string;
    tags: string[];
  }) => {
    if (!editModal.card) return;

    try {
      await updateCard(editModal.card.id, formData);
      await loadCards(); // Reload cards
      setEditModal({ isOpen: false, card: null });
      toast.success("Card updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update card");
    }
  };

  const handlePractice = (cardId: string) => {
    router.push(`/dashboard/cards/practice?id=${cardId}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-2">Manage flashcards</p>
        </div>
        <Link href="/dashboard/cards/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Card
          </Button>
        </Link>
      </div>

      {cards.length === 0 ? (
        <EmptyState
          title="No cards yet"
          description="Create your first flashcard"
        />
      ) : (
        <>
          <SearchBar
            searchQuery={searchQuery}
            searchType={searchType}
            onSearchChange={setSearchQuery}
            onSearchTypeChange={setSearchType}
            filteredCardsCount={filteredCards.length}
          />

          {filteredCards.length === 0 ? (
            <EmptyState
              title="No cards found"
              description={`No cards match the ${searchType} "${searchQuery}"`}
              showCreateButton={false}
            />
          ) : (
            <CardGrid
              cards={displayedCards}
              currentIndex={currentIndex}
              totalCards={filteredCards.length}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPractice={handlePractice}
              onShowMore={handleShowMore}
            />
          )}
        </>
      )}

      {/* Modals */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, cardId: null, cardTitle: "" })
        }
        onConfirm={confirmDelete}
        cardTitle={deleteModal.cardTitle}
      />

      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, card: null })}
        onSave={saveEdit}
        card={editModal.card}
      />
    </div>
  );
}
