# dsp-repository
Service for browsing, searching, and editing of project metadata


## Services

### Metadata

Service for providing users with project and dataset specific metadata.

#### Front-end

The front-end part is basing on [Svelte](https://svelte.dev). To run it, `yarn` and/or `make` need to be installed. 

1. Clone the repoistory:

```
https://github.com/dasch-swiss/dasch-service-platform.git
```


2. Install the dependencies:

```bash
yarn install
```

or

```bash
make yarn
```

3. Start the application:

```bash
yarn run dev
```

This starts the application on the [localhost:5000](http://localhost:5000).

*Note that you will also need to have [Node.js](https://nodejs.org) installed.*

#### Server

For now, test data is served from a simple `json-server` in order to be able to design the API and quickly start developing the front end.

Be sure to have `json-server` installed:

```bash
yarn install -g json-server
```

`json-server` watches and serves a single `db.json` file on port 3000.

To run `json-server` either navigate to the `db.json` file and run `json-server --watch db.json` or simply run
```bash
make metadata-server
```

Currently one route is being served: `http://localhost:3000/projects/`. It returns all projects for which there is metadata available. For now, projects only contain an `id` (i.e. the project shortcode), `name`, `description` and `metadata`.

Metadata of a specific project can be retrieved by getting `/projects/<id>`. (E.g. `http://localhost:3000/projects/9997` to get the minimal metadata set.)

Full text search can be performed by adding `?q=<search-query>` (e.g. `http://localhost:3000/projects?q=agriculture`).

`json-server` also supports updating and deleting data. For more capabilities of `json-server`, see the [the docs](https://github.com/typicode/json-server).


## Go dependencies

The Go dependencies are defined inside the `go.mod` and the corresponding `go.sum` files.
To be able to use external dependencies with Bazel, all external dependencies need to be registered with Bazel
so that they can be referenced in the `BUILD.bazel` files.

The steps to add an external dependency are as follows:
1. to add repository and version to `go.mod`, run `go get gihub.com/stretchr/testify`
  (exchange the name of the package with the one you would like to add)
1. from inside this directory, run `go mod download gihub.com/stretchr/testify`
  (exchange the name of the package with the one you would like to add)
1. from the root of the repository, run `make gen-go-deps`

Running the `make gen-go-deps` will regenerate the `deps.bzl` file found
in the root of the repository. This file is loaded inside the `WORKSPACE` file, so that Bazel
can go and fetch the external repositories and make them available to be used in rules.

From then on, you should be able to use the external dependency in a `BUILD.bazel` file like so:

```bazel
go_test(
    name = "entity_test",
    srcs = ["organization_test.go"],
    embed = [":entity"],
    deps = ["@com_github_stretchr_testify//assert"],
)
```

## Docs
Three make commands are available for the docs

`make docs-build` - builds the docs

`make docs-serve` - serves the docs locally; useful for when you want to work on the docs locally

`make docs-publish` - publishes the docs to Github Pages which can then be accessed via https://dasch-swiss.github.io/dasch-service-platform
