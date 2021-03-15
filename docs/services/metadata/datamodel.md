# Metadata

## Domain Entities

![domain entities](./domain-entities.svg)

## API representation

A metadata set can be serialized to json. This json data must conform to the [json-schema](schema-metadata.json).

The json representation is "flat", i.e. not nested, except in cases where there is a clear one-to-one relationship. Namely, if an object can only occur once and can not be referenced anywhere else.

### Macro structure

The overall structure of the json representation of a metadata-set should look like this:

```json
{
  "$schema": "...",
  "project": {
    ...
  },
  "datasets": [
    ...
  ],
  "persons": [
    ...
  ],
  "organizations": [
    ...
  ],
  "grants": [
    ...
  ]
}
```

As only datasets can occur that are part of the project (or vice versa: the project must contain all datasets), this connection is always assumed and not linked explicitly.

`project` and `datasets` are required, `persons`, `organizations` and `grants` are optional.

### project

## Open Questions:

- How to handle URLs? Do we want/need PropertyID?
- How to treat `Place`
- How to handle different type options in domain entities?
- How to handle authority file references?
- Should plural be used for properties that can be multiple?
