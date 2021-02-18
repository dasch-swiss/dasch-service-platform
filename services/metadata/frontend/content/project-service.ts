export class ProjectService {
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
