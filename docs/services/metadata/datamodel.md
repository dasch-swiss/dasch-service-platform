# Metadata

## Domain Entities

![domain entities](./domain-entities.svg)

## API representation

A metadata set can be serialized to json. This json data must conform to the [json-schema](schema-metadata.json).  
The following example illustrates how the json might look:

![json example](./api-example.svg)  
(Cf. `example.json` too.)

The json representation is "flat", i.e. not nested, so all top-level types are present in the first level of depth of the json document tree. All those objects have a unique `@id` property. Wherever this object is referenced further down in the document, this is done so by this ID.  
(NB: json schema does not allow for consistency checks of internal references, so the existence of an object with a given ID can not be guaranteed by json validation.)

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
  ],
  "dataManagementPlan": {
    ...
  }
}
```

As only datasets can occur that are part of the project (or vice versa: the project must contain all datasets), this connection is always assumed and not linked explicitly.

`project` and `datasets` are required, `persons`, `organizations`, `grants` and `dataManagementPlan` are optional.


## Open Questions:

- [ ] type of Date?
- [ ] should we link to datasets in project, in json, after all?



## Tasks:
- [ ] for all classes, that have two options, simply split it into two datastructures that hold it
