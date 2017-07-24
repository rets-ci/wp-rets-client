* To install Elasticsearch feature for WP-Property based on Elasticpress plugin, WP-CLI has to be used.
* Elasticsearch index of client equals `site_id`
* For RDC client ( and, in theory, for all clients in future ) we are using Elasticsarch v5.X.

## Install Main index

Since we are using `term_suggest` (completion) we have to store terms data in separate index. So, main index includes the following types:
* `post` ( native ElasticPress )
* `term` ( our custom terms type )

To create new index with `post` and `term` types, the following WP-CLI commands have to be used:

```
wp elasticpress put-mapping
```

**Note!** It deletes the current index if it already exists!!! So you will have to index all properties ( and terms ) from scratch.

To index the data:


```
wp elasticpress index --posts-per-page=100
```

For more details see ElasticPress CLI documentation [here](https://github.com/10up/ElasticPress#wp-cli-commands)

## Install Saved Search (Percolator) Index

`wp-property-pro` theme includes WP-CLI stuff for creating `search` index, which is used to store percolators.

* **Note!** It's designed for Elasticsearch v5.X. You can look through good example for using percolators in ES v5.X [here](https://amsterdam.luminis.eu/2016/10/13/using-the-new-elasticsearch-5-percolator/)
* Since, percolator is being stored in separate index, we have to create the same mapping ( and analyzers! ) as we have for `post` type in main index.
* CLI command (below) gets mapping and settings ( which includes analyzers ) from our main index and puts it to Saved Search index.
* Saved Search index's name is `{main_index}-search`

To create new Saved Search index, the following WP-CLI command has to be run:

```
wp saved-search put-mapping
```

**Note!**, main index must exist to run the command. In other case error will be returned. 



