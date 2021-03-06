# Metadata Service

## Architecture Overview
The code follows [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) as
described by Uncle Bob and depicted in the following diagram:

![Clean Architecture Diagram](CleanArchitecture.jpg "The Clean Architecture")

### Entities Layer

The innermost layer, is the entities layer found in the `entity` package:

> Entities encapsulate Enterprise wide business rules. An entity can be an object with methods, or it can be a set of data structures and functions. It doesn’t matter so long as the entities could be used by many different applications in the enterprise.

In this package we have the definition of our entities, and their respective unit tests.

### Use Cases Layer

According to Uncle Bob:

> The software in this layer contains application specific business rules. It encapsulates and implements all of the use cases of the system

Inside the `usecase` package, we implement the other business rules of our product.
We also find here the `mocks` generated by `Gomock`. The outermost layer of the
architecture will use them during the tests.



### Interface Adapters Layer


#### HTTP API

The codes in this layer adapt and convert the data to the format used by the entities and use cases for
external agents such as databases, web, etc.

In this application, UseCases are accessed through an HTTP API.

The `api` package is divided into three packages: `handler`, `presenter`, and `middleware`.

The `handler` package handles HTTP requests and responses, as well as using existing business rules in the `usecases`.

The `presenters` are responsible for formatting the data generated as a `response` by `handlers`. This gives us
control over how an entity will be delivered via the `API`.

In the last package of the API we find the `middlewares`, used by several endpoints, implementing `cors` and `metrics`.

#### GraphQL


### Frameworks and Drivers layer

According to Uncle Bob:

> The outermost layer is generally composed of frameworks and tools such as the Database, the Web Framework, etc.
> This layer is where all the details go.

For example, in the file `infrastructure/repository/user_keyvalue.go` we have the implementation of
the interface `Repository` for a KeyValue Store. If we need to change to another database, this
is where we would create the new implementation.


### Support Packages

Support packages inside `pkg`, provide common functionality such as encryption, logging, file handling, etc. These
features are not part of the domain of our application, and all the layers can use them. Even other applications
can import and use these packages.
