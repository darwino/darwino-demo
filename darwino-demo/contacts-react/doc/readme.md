# Contact demo application
--------------------------

## Data migration
Darwino is very flexible in term of data migration. For example, the whole NSF content can be replicated to a single Darwino store, or split into multiple stores. A good practice is to create one Darwino store per Form within an NSF. That way, queries generally don't have to select the documents based on the form field value.

## Migrating views

## Migrating forms

## Data grid
The data grid is used to display the result of a query, which would be a view in Notes/Domino. The grid is using the react-data-grid and provide the following capabilities:

- Sorting
The sort is done on the server side, by forcing the orderBy parameter for the query. This ensures that the grid supports very large data set.
The sorting capability is demonstrated through the AllContacts page.

