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

**Note!**, main index must exist to run the command. Also, it's good to index properties before create Saved Search index, since the mapping may be updated on indexing new data. In other case error may be occurred. 


### Saved Search Percolator

The following CURL request is example of Saved Search Percolator object:

```
curl -X PUT \
  https://api.realty.ci-v5:jhygeipvfuujblue@api.wpcloud.io:19100/mocha-test-search/search/1 \
  -H 'cache-control: no-cache' \
  -d '{
  "query": {
    "bool": {
      "must": [
        {
          "exists": {
            "field": "wpp_location_pin"
          }
        },
        {
          "term": {
            "terms.wpp_listing_status.slug": "for-rent"
          }
        },
        {
          "terms": {
            "terms.wpp_listing_type.slug": [
              "apartment",
              "multifamily",
              "land_vacant",
              "land_farm",
              "land_manufactured_house_lot",
              "commercial_apartment",
              "commercial_entertainment",
              "commercial_healthcare",
              "commercial_hotel",
              "commercial_industrial",
              "commercial_multifamily",
              "commercial_office",
              "commercial_other",
              "commercial_residential",
              "commercial_retail",
              "land_other",
              "land_industrial",
              "land_residential",
              "land_commercial",
              "land_ranch",
              "land_hunting",
              "land_recreational",
              "residential",
              "residential_apartment",
              "residential_condo",
              "residential_house",
              "residential_manufactured",
              "residential_multifamily",
              "residential_other",
              "residential_townhouse",
              "house",
              "condo",
              "townhouse",
              "other",
              "duplex",
              "manufactured"
            ]
          }
        },
        {
          "range": {
            "meta.rets_total_baths.double": {
              "gte": "1"
            }
          }
        },
        {
          "range": {
            "meta.rets_beds.double": {
              "gte": "2"
            }
          }
        },
        {
          "range": {
            "meta.rets_list_price.double": {
              "gte": 1000,
              "lt": 4750
            }
          }
        },
        {
          "range": {
            "meta.rets_living_area.double": {
              "gte": 1000,
              "lt": 9500
            }
          }
        },
        {
          "range": {
            "meta.rets_lot_size_area.double": {
              "lt": "9.75"
            }
          }
        },
        {
          "bool": {
            "should": [
              {
                "term": {
                  "terms.wpp_location.name.raw": "Raleigh, NC"
                }
              },
              {
                "term": {
                  "terms.wpp_location.name.raw": "Durham, NC"
                }
              },
              {
                "term": {
                  "terms.wpp_location.name.raw": "Cary, NC"
                }
              }
            ]
          }
        }
      ]
    }
  },
  "meta": {
	"site_id": "616bf200-b814-4a8b-816e-a4405061e3b8",
    "user_id": 25,
    "name": "My Saved Search Title",
    "notification": {
      "active": true
    },
    "created": "2017-07-17T12:00:01",
    "modified": "2017-07-17T13:12:01",
    "comment": "Any comment can be added here"
  }
}'
```

To percolate the property `5908107`, which tied to just added Saved Search:

```
curl -X POST \
  https://api.realty.ci-v5:jhygeipvfuujblue@api.wpcloud.io:19100/mocha-test-search/_search \
  -H 'cache-control: no-cache' \
  -d '{
  "query": {
    "percolate": {
      "field": "query",
      "document_type": "doctype",
      "index": "mocha-test",
      "type": "post",
      "id": 5908107
    }
  }
}'
```

To percolate the property `9273045`, which DOES NOT tied to just added Saved Search:

```
curl -X POST \
  https://api.realty.ci-v5:jhygeipvfuujblue@api.wpcloud.io:19100/mocha-test-search/_search \
  -H 'cache-control: no-cache' \
  -H 'postman-token: 6feea984-cb35-3fed-bdd6-ecd9317ac79c' \
  -d '{
  "query": {
    "percolate": {
      "field": "query",
      "document_type": "doctype",
      "index": "mocha-test",
      "type": "post",
      "id": 9273045
    }
  }
}'
```
