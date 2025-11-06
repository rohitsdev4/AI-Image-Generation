
export interface ChatMessage {
  id: string;
  prompt: string;
  inputImageUrl?: string | null;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
