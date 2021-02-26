# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
# THIS_FILE := $(lastword $(MAKEFILE_LIST))
THIS_FILE := $(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

include vars.mk

#################################
# Bazel targets
#################################

.PHONY: yarn
yarn: ## install dependencies
	@bazel run @nodejs//:yarn

.PHONY: build
build: yarn ## build all targets
	@bazel run @nodejs//:yarn -- run build
	@bazel build //...

.PHONY: test
test: yarn ## test all targets
	@bazel run @nodejs//:yarn -- run build
	@bazel test //...

.PHONY: buildifier
buildifier: ## format Bazel WORKSPACE and BUILD.bazel files
	@bazel run :buildifier

#################################
# Metadata service targets
#################################

.PHONY: metadata-gen-deps
metadata-gen-deps: ## regenerate dependencies file (services/metadata/backend/deps.bzl)
	@bazel run //services/metadata/backend:gazelle -- update-repos -from_file=services/metadata/backend/go.mod -to_macro=deps.bzl%go_dependencies

.PHONY: metadata-docker-build
metadata-docker-build: build ## publish linux/amd64 platform image locally
	@bazel run --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64 //services/metadata/backend/api:image -- --norun

.PHONY: metadata-docker-publish
metadata-docker-publish: build ## publish linux/amd64 platform image to Dockerhub
	@bazel run --platforms=@io_bazel_rules_go//go/toolchain:linux_amd64 //services/metadata/docker:push

.PHONY: metadata-service-run
metadata-service-run: build ## start the metadata service
	@bazel run //services/metadata/backend/api

.PHONY: metadata-service-test
metadata-service-test: ## run all metadata-service tests
	@bazel test //services/metadata/backend/...

#################################
# Other targets
#################################

.PHONY: metadata-server
metadata-server: ## start metadata json-server watching db.json
	@json-server --watch services/metadata/backend/data/db.json

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
