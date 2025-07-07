"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  showCreateButton?: boolean;
}

export default function EmptyState({
  title,
  description,
  showCreateButton = true,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {showCreateButton && (
        <Link href="/dashboard/cards/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Card
          </Button>
        </Link>
      )}
    </div>
  );
}
