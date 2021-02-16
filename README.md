# dsp-repository
Service for browsing, searching, and editing of project metadata


## Services

### Metadata

Service for providing users with project and dataset specific metadata.

#### Server

For now, test data is served from a simple `json-server` in order to be able to design the API and quickly start developing the front end.

Be sure to have `json-server` installed:

```bash
npm install -g json-server
```

`json-server` watches and serves a single `db.json` file on port 3000.

To run `json-server` either navigate to the `db.json` file and run `json-server --watch db.json` or simply run
```bash
make metadata-server
```

Currently, two routes are being served: `http://localhost:3000/projects/` and `http://localhost:3000/metadata/`.
- `/projects` returns all projects for which there is metadata available.  
  For now, projects only contain an `id` (i.e. the project shortcode).
- `/metadata` returns all metadata-sets available.

Metadata of a specific project can be retrieved by getting `/metadata/<id>`. (E.g. `http://localhost:3000/metadata/9997` to get the minimal metadata set.)

Full text search can be performed by adding `?q=<search-query>` (e.g. `http://localhost:3000/metadata?q=agriculture`).

`json-server` also supports updating and deleting data. For more capabilities of `json-server`, see the [the docs](https://github.com/typicode/json-server).
