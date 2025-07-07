"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  searchQuery: string;
  searchType: "tag" | "language";
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: "tag" | "language") => void;
  filteredCardsCount: number;
}

export default function SearchBar({
  searchQuery,
  searchType,
  onSearchChange,
  onSearchTypeChange,
  filteredCardsCount,
}: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-2 items-end">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search cards by ${searchType}`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Search by:</span>
          <Select value={searchType} onValueChange={onSearchTypeChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tag">Tag</SelectItem>
              <SelectItem value="language">Language</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {searchQuery && (
        <div className="mt-2 text-sm text-muted-foreground">
          Found {filteredCardsCount} card
          {filteredCardsCount !== 1 ? "s" : ""} with {searchType} "{searchQuery}
          "
        </div>
      )}
    </div>
  );
}
