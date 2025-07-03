"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export interface CreateCardData {
  question: string;
  answer: string;
  language: string;
  tags?: string[];
}

export interface Card {
  id: string;
  question: string;
  answer: string;
  language: string;
  tags: string[];
  isActive: boolean;
  reviewCount: number;
  nextReview: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createCard = async (cardData: CreateCardData): Promise<Card> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    const { question, answer, language, tags = [] } = cardData;

    if (!question || !answer || !language) {
      throw new Error("Question, answer, and language are required");
    }

    // First, ensure user exists in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create user if not exists
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "", // Will be updated if needed
        },
      });
    }

    // Set next review date based on Ebbinghaus forgetting curve (1 day later)
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    const card = await prisma.card.create({
      data: {
        question,
        answer,
        language,
        tags,
        userId: user.id,
        nextReview,
      },
    });

    revalidatePath("/dashboard/cards");
    return card;
  } catch (error) {
    console.error("Card creation error:", error);
    throw new Error("Failed to create card");
  }
};

export const getCards = async (): Promise<Card[]> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return [];
    }

    const cards = await prisma.card.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return cards;
  } catch (error) {
    console.error("Card fetch error:", error);
    throw new Error("Failed to fetch cards");
  }
};

export const updateCard = async (
  cardId: string,
  cardData: Partial<CreateCardData>
): Promise<Card> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify card belongs to user
    const existingCard = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    });

    if (!existingCard) {
      throw new Error("Card not found");
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: cardData,
    });

    revalidatePath("/dashboard/cards");
    return card;
  } catch (error) {
    console.error("Card update error:", error);
    throw new Error("Failed to update card");
  }
};

export const deleteCard = async (cardId: string): Promise<void> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify card belongs to user
    const existingCard = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    });

    if (!existingCard) {
      throw new Error("Card not found");
    }

    await prisma.card.delete({
      where: { id: cardId },
    });

    revalidatePath("/dashboard/cards");
  } catch (error) {
    console.error("Card deletion error:", error);
    throw new Error("Failed to delete card");
  }
};

export const toggleCardActive = async (cardId: string): Promise<Card> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify card belongs to user
    const existingCard = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    });

    if (!existingCard) {
      throw new Error("Card not found");
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: { isActive: !existingCard.isActive },
    });

    revalidatePath("/dashboard/cards");
    return card;
  } catch (error) {
    console.error("Card toggle error:", error);
    throw new Error("Failed to toggle card");
  }
};

export const getCardsForReview = async (): Promise<Card[]> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return [];
    }

    const now = new Date();

    const cards = await prisma.card.findMany({
      where: {
        userId: user.id,
        isActive: true,
        nextReview: {
          lte: now,
        },
      },
      orderBy: { nextReview: "asc" },
    });

    return cards;
  } catch (error) {
    console.error("Review cards fetch error:", error);
    throw new Error("Failed to fetch review cards");
  }
};

export const markCardReviewed = async (
  cardId: string,
  wasCorrect: boolean
): Promise<Card> => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify card belongs to user
    const existingCard = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    });

    if (!existingCard) {
      throw new Error("Card not found");
    }

    // Calculate next review date based on Ebbinghaus forgetting curve
    const nextReview = new Date();
    if (wasCorrect) {
      // If correct, increase interval (1, 3, 7, 14, 30 days)
      const intervals = [1, 3, 7, 14, 30];
      const currentInterval =
        intervals[Math.min(existingCard.reviewCount, intervals.length - 1)];
      nextReview.setDate(nextReview.getDate() + currentInterval);
    } else {
      // If incorrect, review again tomorrow
      nextReview.setDate(nextReview.getDate() + 1);
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        reviewCount: existingCard.reviewCount + 1,
        nextReview,
      },
    });

    revalidatePath("/dashboard/cards");
    return card;
  } catch (error) {
    console.error("Card review error:", error);
    throw new Error("Failed to mark card as reviewed");
  }
};
