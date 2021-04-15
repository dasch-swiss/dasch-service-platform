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

export interface ProjectMetadata {
  description: string;
  id: string;
  name: string;
  metadata: any[];
}
