# Metadata Service

## Go dependencies

The go dependencies for the Metadata-Service are defined inside the `go.mod` and the corresponding `go.sum` files.
To be able to use external dependencies with Bazel, all external dependencies need to be registered with Bazel
so that they can be referenced in the `BUILD.bazel` files.

The steps to add an external dependency are as follows:
1. add repository and version to `go.mod`
1. from inside this directory, run `go mod download gihub.com/stretchr/testify`
  (exchange the name of the package with the one you would like to add)
1. from the root of the repository, run `make metadata-gazelle-generate-dependencies`

Running the `make metadata-gazelle-generate-dependencies` will regenerate the `deps.bzl` file found
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
