export interface Document {
  id?: number;
  title: string;
  content: string;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  name: string;
}
