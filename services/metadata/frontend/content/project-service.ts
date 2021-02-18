export class ProjectService {
  name = "Project X";
  description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  
  getProjects() {
    return [
      { name: this.name, description: this.description, id: 1 },
      { name: this.name, description: this.description, id: 2 },
      { name: this.name, description: this.description, id: 3 },
      { name: this.name, description: this.description, id: 4 },
      { name: this.name, description: this.description, id: 5 },
      { name: this.name, description: this.description, id: 6 }
    ];
  };

  getCategories() {
    return [
      { name: "Discipline" },
      { name: "Type of data" },
      { name: "Temporal coverage" },
      { name: "Spatial coverage" },
      { name: "Language" },
      { name: "Keywords" },
      { name: "Person" },
      { name: "Organization" },
    ];
  };
}