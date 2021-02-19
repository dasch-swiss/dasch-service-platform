export interface Category {
  id: number;
  isOpen: boolean;
  name: string;
  sub: string[];
}

export class ProjectService {
  getCategories() {
    return [
      { id: 1, isOpen: true, name: 'Discipline', sub: ['Antropology', 'Geography', 'History'] },
      { id: 2, isOpen: true, name: 'Type of data', sub: [] },
      { id: 3, isOpen: true, name: 'Temporal coverage', sub: [] },
      { id: 4, isOpen: true, name: 'Spatial coverage', sub: [] },
      { id: 5, isOpen: true, name: 'Language', sub: [] },
      { id: 6, isOpen: true, name: 'Keywords', sub: [] },
      { id: 7, isOpen: true, name: 'Person', sub: [] },
      { id: 8, isOpen: true, name: 'Organization', sub: [] },
    ];
  };
}
