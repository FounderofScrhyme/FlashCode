"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCards, Card } from "@/actions/cardActions";
import { Plus, FileText, Calendar, RefreshCw } from "lucide-react";

export default function CardPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const fetchedCards = await getCards();
      setCards(fetchedCards);
    } catch (error) {
      console.error("Card fetch error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-2">
            Manage flashcards specialized for code memorization
          </p>
        </div>
        <Link href="/dashboard/cards/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Card
          </Button>
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No cards yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first flashcard to start memorizing code
          </p>
          <Link href="/dashboard/cards/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Card
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground uppercase">
                    {card.language}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(card.createdAt)}
                </div>
              </div>

              {/* タグ表示 */}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {card.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <h3 className="font-medium text-sm mb-1">Question</h3>
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded  font-mono overflow-hidden">
                    {card.question.length > 100
                      ? `${card.question.substring(0, 100)}...`
                      : card.question}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm mb-1">Answer</h3>
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono overflow-hidden">
                    {card.answer.length > 100
                      ? `${card.answer.substring(0, 100)}...`
                      : card.answer}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Reviews: {card.reviewCount}</span>
                  <span>Next review: {formatDate(card.nextReview)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
