export class Location {

  name: string;
  locations: Array<Location>;

  constructor(name: string, locations: Array<string>, visible: boolean) {
    this.name = name;
    this.locations = locations.map(l => new Location(l, [], false));
  }

  addLocation(name: string) {
    let newLocation = new Location(name, [], false);
    this.locations.push(newLocation);
    return newLocation;
  }
  
  getLocation(name: string) {
    return this.locations.find(l => l.name === name);
  }
}