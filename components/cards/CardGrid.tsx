"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/actions/cardActions";
import CardItem from "./CardItem";

interface CardGridProps {
  cards: Card[];
  currentIndex: number;
  totalCards: number;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string, cardTitle: string) => void;
  onPractice: (cardId: string) => void;
  onShowMore: () => void;
}

export default function CardGrid({
  cards,
  currentIndex,
  totalCards,
  onEdit,
  onDelete,
  onPractice,
  onShowMore,
}: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No cards found</h3>
        <p className="text-muted-foreground mb-6">
          No cards match your search criteria
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onEdit={onEdit}
            onDelete={onDelete}
            onPractice={onPractice}
          />
        ))}
      </div>

      {/* Show More button */}
      {currentIndex < totalCards && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onShowMore}
            variant="outline"
            className="flex items-center gap-2"
          >
            Show More ({totalCards - currentIndex} remaining)
          </Button>
        </div>
      )}
    </>
  );
}
