export interface ReelItemType {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string | null;
  likes: number;
  comments: number;
  user: {
    name: string;
    avatar: string;
  };
}
