---
post_title: Is EdgeDB the Future?
post_author: James Olaogun
post_author_avatar: james.png
date: '2022-06-23'
post_image: edgedb-future.png
post_excerpt: EdgeDB solves some design flaws of relational and No-SQL databases. Read the differences between EdgeDB, MongoDB, and GraphQL and the best use cases for EdgeDB.
post_slug: is-EdgeDB-the-future
tags: ['post', 'developer tools']
post_date_in_url: false
post_og_image: 'hero'
posts_related:
  [
    'process-large-files-nodejs-streams',
    'remix-react-framework',
    'first-nodejs-github-action',
  ]
---

Databases are a vital part of any application, but not all engineering teams are successful with them. With so many databases to choose from, each with its own set of limitations, it can be tough to pick the right one for your projects. Some of these databases are relational or table-based, while others are NoSQL or document-based; as a result, some engineering teams use both.

But what if there were a database that combined the features of a NoSQL and a SQL database? That’s what [EdgeDB](https://www.edgedb.com/) can provide for your organization.

This article will provide more details on how EdgeDB works and how it compares to other popular databases such as MongoDB and PostgreSQL.

## What Is EdgeDB?

![EdgeDB](https://i.imgur.com/nXLEqRk.png)

EdgeDB is an open source database created to be an ideal complement to SQL and the relational paradigm. Its goal is to address complex design issues that make existing databases difficult to use. The query engine used by EdgeDB is Postgres, and it considers schema to be an object with properties linked together by connections. EdgeDB functions similarly to a relational database with an object-oriented data model or a graph database with a strict schema. It’s also referred to as a graph-relational database.

The following are more details about the essential components and functionalities of EdgeDB, including its schema, query language, migrations, clients, and feature sets.

### Schema

A database schema is the structure that describes the logical view of the entire database. It defines how an application’s data is organized and how the relationships among the data are connected. It also handles all the constraints to be applied to the database.

According to EdgeDB’s schema, it’s a graph-relational database, a relational database with an object-oriented data model, a list of objects with properties connected by links, and a graph database with a strictly enforced schema. These are described below:

* **Graph-relational database:** In this type of database, data is described as a strongly typed object with set-valued properties.
* **Relational database with object-oriented data model:** Here, the object-oriented data model blends object-oriented programming concepts with relational database principles.
* **Objects with properties connected by links:** Link items are used to define a specific relationship between two object types, and link instances relate one object to one or more different objects (in a one-to-one or one-to-many relationship).
* **Graph database with strict schema:** EdgeDB enforces a strict schema, unlike most graph databases. In EdgeDB, the engineering team must design the logical view of the database.

Other databases like MongoDB, RethinkDB, and CouchDB provide an object-oriented data model, but they offer a dynamic schema, not a strict one.

### Query Language

A query language (QL) is a computer programming language that utilizes queries to request and fetch data from the database. EdgeDB uses EdgeQL. Unlike with Structured Query Language (SQL), engineers can use EdgeQL to execute a deep fetching query [without needing the `JOIN` clause](https://www.edgedb.com/blog/edgedb-1-0#:~:text=Task%3A%20get%20a,written%20in%20EdgeQL%3A).

Additionally, EdgeQL returns query results as a structured object. A structured object can have one or more key-value pairs, also known as properties. It can also have zero key-value pairs and be considered an empty object. A key-value pair is made up of a key and a value; the key is a string that identifies the key-value pair, and the value can be a string, number, float, array, boolean, structured object, or empty value.

Since the query response is already a structured object, it can easily be exported into a JSON file or communicated to a [REST API endpoint](https://www.techtarget.com/searchapparchitecture/definition/API-endpoint).

Databases such as MongoDB also return query results as a structured object. However, most SQL databases like PostgreSQL, MySQL, and SQLite don’t return a structured object, meaning that instead of returning a nested object for a deep-fetched data request, they return the values on the same level as the parent data.

### Migrations

A database migration is a set of coordinated changes used to alter the structure of database objects. Whether it’s eliminating components, splitting fields, or changing types and constraints, migrations help move database schemas from one state to another.

In EdgeDB, you can track migrations and run an interactive sanity check on each migration step:

* **Tracked migrations:** EdgeDB makes it simple to handle incremental schema changes during the migration or development process. Each EdgeDB instance automatically keeps its own migration history auditable, and the instance generates all migration logic. Other database migration tools for databases like MongoDB and PostgreSQL often keep duplicate copies of your schema in opaque/backup files or build new tables to monitor migration history.
* **Interactive sanity checks:** In EdgeDB, creating a migration is like having a conversation with your database. Each identified schema change is offered to you for approval, ensuring that you understand the migration details and that any inconsistencies are automatically resolved. This allows you to run sanity checks like setting the default value for a required property.

### Feature Set

EdgeDB has a robust feature set that allows engineering teams to focus on their tasks more effectively. These features include the addition of computed properties, default values, constraints, deletion policies, and indexes to your application’s database.

#### Computed Properties

Computed properties can be found in EdgeDB object types (also called database tables in a relational database). Each computed property will return the modified value of the referenced property. For example, the `Student` object type below has the properties `firstname` and `lastname` and a computed property called `processed_firstname`. When you query this object type, the computed property will return the `firstname` in capital letters:

```js
type Student {
  required property firstname -> str;
  required property lastname -> str;
  property processed_firstname := str_upper(__subject__.firstname);
}
```

Other databases such as MongoDB allow you to add computed properties to your database schema. However, SQL databases such as MySQL and PostgreSQL lack this functionality. Engineers who work with SQL databases are frequently assigned the task of developing a computed property in the codebase.

#### Default Values 

Default values can be set for a column or object property when no other value is specified in the `INSERT` query. In EdgeDB, object properties can have a default value, which can be a static value or an EdgeQL expression that is evaluated when the `INSERT` query is executed.

The following code demonstrates how to set a default static value in EdgeDB:

```js
type Student {
  required property status -> str {
    default := 'active';
  }
}
```

And this code demonstrates how to set a default expression value in EdgeDB:

```js
type Student {
  required property student_location -> float64 {
    default := (360 * random() - 180);
  }
}
```

Other databases such as MongoDB and PostgreSQL allow the use of a default value when the value of an object property or column is not specified. The default value, however, cannot be an expression. It must be a constant or static value.

#### Constraints 

Constraints guarantee that rules set during data model creation are followed when data is modified in a database, such as when data is inserted, updated, or deleted. EdgeDB comes with a variety of [built-in constraints](https://www.edgedb.com/docs/datamodel/constraints#built-in-constraints). Constraints can be applied to EdgeDB object properties, object types, object links, and custom scalars.

Constraints are also available in databases such as MongoDB and PostgreSQL, and each database has its own techniques for defining constraints. Naming conventions for built-in constraint functions vary with each database.

#### Deletion Policies

This feature refers to the deletion rule specified in the database. EdgeDB relationships, also known as links, can each declare their own deletion policy to be triggered when the target of a link is deleted.

Additionally, EdgeDB offers [four options](https://www.edgedb.com/docs/datamodel/links#deletion-policies) when a target is deleted: `restrict`, `delete source`, `allow`, and `deferred restrict`. The `restrict` option is the default action.

For example, the following code can be used to set the `deferred restrict` action on a link in EdgeDB:

```js
type Father {
  property name -> str;
}

type Child {
  link parent -> Father {
    on target delete deferred restrict;
  }
}
```

While this is a standard feature in most, if not all databases, each database has its own method of declaring its deletion policy. You can learn more about the naming convention of your selected database by reading its documentation.

#### Indexes

An index is a data structure used internally by a database to speed up data retrieval operations such as filtering and sorting. In EdgeDB, indexes are specified within object type declarations and refer to a specific object property; as a result, any query referencing that object property in a `filter` or `order by` clause will be processed faster than usual.

The following code demonstrates how to set an index in a EdgeDB object property:

```js
type User {
  required property firstname -> str;
  required property lastname -> str;
  index on (.firstname);
}
```

Indexes are a common feature in most, if not all databases, and each database has its own technique for declaring an index. Indexes increase disk and memory use in all databases, though, so establishing too many indexes may be detrimental. Try to only index object properties or columns that you frequently `filter` or `order by`.

### Clients

EdgeDB clients are libraries written in a specific programming language that allow engineering teams to connect to EdgeDB and run queries from within that language. EdgeDB’s most stable version, 1.0, offers official libraries in three programming languages/frameworks: TypeScript and JavaScript, Python, and Golang. EdgeDB also has an official driver for Deno.

#### TypeScript and JavaScript

To start using EdgeDB with TypeScript or JavaScript, install the `edgedb` module from either the npm package manager or the Yarn package manager:

```
npm install edgedb      # npm users
yarn add edgedb         # yarn users
```

This library comprises two components: the driver and the query builder. You can read more about the EdgeDB TypeScript or JavaScript library and how its components work in the [official documentation](https://www.edgedb.com/docs/clients/01_js/index).

#### Python 

The official EdgeDB Python library may be installed using `$ pip install edgedb`, and it supports both blocking and async IO implementations. The [documentation](https://www.edgedb.com/docs/clients/00_python/index) has more information on how the official library works in Python.

#### Golang

The official Go EdgeDB driver is the `edgedb` package, which may be initialized by adding the lines of code below to the top of the script under the `package main` line:

```js
import (
    "context"
    "log"

    "github.com/edgedb/edgedb-go"
)
```

Alternatively, you can use a DSN to connect to EdgeDB:

```js
url := "edgedb://edgedb@localhost/edgedb"
client, err := edgedb.CreateClientDSN(ctx, url, opts)
```

Or an option field:

```js
opts := edgedb.Options{
    Database:    "edgedb",
    User:        "edgedb",
    Concurrency: 4,
}
client, err := edgedb.CreateClient(ctx, opts)
```

Read the [official documentation](https://www.edgedb.com/docs/clients/02_go/index) for more on connecting and using all of EdgeDB’s functionalities in Golang.

#### Deno 

The official EdgeDB driver for Deno is `edgedb-deno`, which can be initialized by importing the following line of code:

```js
import * as edgedb from "https://deno.land/x/edgedb/mod.ts"
```

You must use Deno conventions by continuously importing a specific tagged version of `edgedb-deno` rather than from the underlined `/src` path. More information on connecting and using the EdgeDB Deno driver may be found in the [official repo](https://github.com/edgedb/edgedb-deno). Keep in mind that the EdgeDB Deno driver is [currently experimental](https://github.com/edgedb/edgedb-deno#tls).

In addition to the official libraries described above, there are unofficial EdgeDB libraries for other programming languages. However, EdgeDB does not provide support to unofficial EdgeDB libraries and drivers.

## Conclusion

EdgeDB, which is still in its early stages, offers a variety of solid capabilities in service of its ambitious objective: to reimagine relational databases with a focus on developer experience.

The release of EdgeDB version 1.0 in February 2022 included an integrated access control system and a query language, EdgeQL, that’s designed to be much quicker than conventional SQL. It’s possible that in the coming years, EdgeDB will support most if not all programming languages, provide a database visualization UI, and establish an open standard for running binary programs in web browsers.

If you’re interested in using or experimenting with EdgeDB for your next project, [Fusebit](https://fusebit.io/) can help you scaffold it and set up the necessary connections. Fusebit is a software-as-a-service (SaaS) integration platform that allows developers to add third-party integrations to their projects without writing code. Its flexible, cloud-native design supports the seamless deployment and operation of your projects at scale, and it prioritizes developer experience at every phase.

For more developers’ content like this, follow [@fusebitio](https://twitter.com/fusebitio) on Twitter to be notified when new articles are released.
