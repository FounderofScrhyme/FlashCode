"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/actions/cardActions";
import { FileText, Calendar, Edit, Trash2, Play } from "lucide-react";

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string, cardTitle: string) => void;
  onPractice: (cardId: string) => void;
}

export default function CardItem({
  card,
  onEdit,
  onDelete,
  onPractice,
}: CardItemProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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

      {/* Tags display */}
      <div className="flex flex-wrap gap-1 mb-3">
        {card.tags && card.tags.length > 0 ? (
          card.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
            No tags
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <h3 className="font-medium text-sm mb-1">Question</h3>
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded font-mono overflow-hidden h-24">
            <div
              className="overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
              }}
            >
              {card.question.length > 100
                ? `${card.question.substring(0, 100)}...`
                : card.question}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Reviews: {card.reviewCount}</span>
          <span>Next review: {formatDate(card.nextReview)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPractice(card.id)}
            className="flex-1"
          >
            <Play className="h-3 w-3 mr-1" />
            Practice
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(card)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(card.id, card.question.substring(0, 50))}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
