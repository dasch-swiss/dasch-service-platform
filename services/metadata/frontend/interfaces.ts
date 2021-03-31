export interface Category {
  id: number;
  isOpen: boolean;
  name: string;
  sub: string[];
}

export interface PaginationData {
  totalCount: number;
  totalPages: number;
}

export interface Project {
  description: string;
  id: string;
  name: string;
}
