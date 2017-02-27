### Simple Query 
Aggregations are returned by default for [tax_input.wpp_listing_category].

```
curl "https://api.realty.ci/elasticsearch/v1/616bf200-b814-4a8b-816e-a4405061e3b8/post/_search?q=post_content:beautiful"  
```

```
curl "https://api.realty.ci/elasticsearch/v1/616bf200-b814-4a8b-816e-a4405061e3b8/post/_search?q=post_content:beautiful&_source=post_content,post_title"  
```

### Complex Query with Aggregations
We search both post_content and post_title for some keywords. Those two fields are analyzed using the `nGram_analyzer` analyzer.
We also request a list of agents and landing page categories fur us to use for facets.

```
curl -XPOST "https://api.realty.ci/elasticsearch/v1/616bf200-b814-4a8b-816e-a4405061e3b8/post/_search?size=0&pretty=true" -d '{
  "query": {
    "simple_query_string" : {
      "fields" : [ "post_content", "post_title" ],
      "query" : "Beautiful brick end unit"
    }
  },
  "aggs": { 
    "agents": { "terms" : { "field" : "tax_input.wpp_agency_agent.name.raw" }},
    "categories": { "terms" : { "field" : "tax_input.wpp_listing_category.meta.url_path" }},
    "status": { "terms" : { "field" : "tax_input.wpp_listing_status.name.raw" }},
    "types": { "terms" : { "field" : "tax_input.wpp_listing_type.name.raw" }}
  }
}'
```

Take note that we are appending `.raw` to the end of the terms to avoid them being tokenized. Try doing aggregation query without `.raw`.

```
curl -XPOST "https://api.realty.ci/elasticsearch/v1/616bf200-b814-4a8b-816e-a4405061e3b8/post/_search?size=0&pretty=true" -d '{  "query": {
    "simple_query_string" : {
      "fields" : [ "post_content", "post_title" ],
      "query" : "Beautiful brick end unit"
    }
  },
  "aggs": { 
    "agents": { "terms" : { "field" : "tax_input.wpp_agency_agent.name.raw" }},
    "categoryPaths": { "terms" : { "field" : "tax_input.wpp_listing_category.meta.url_path" }},
    "status": { "terms" : { "field" : "tax_input.wpp_listing_status.name.raw" }},
    "types": { "terms" : { "field" : "tax_input.wpp_listing_type.name.raw" }}
  }
}'
```

### Do Geo-Polygon Search:
The geo coordinates are stored in `_system.location`. We aggregate `wpp_listing_location` to see which of our known areas fall into the bounding box.

```
curl -XPOST "https://api.realty.ci/elasticsearch/v1/616bf200-b814-4a8b-816e-a4405061e3b8/post/_search?size=0&pretty=true" -d '{
  "filter": {
    "geo_bounding_box": {
      "post_meta.wpp_location_pin": {
        "top_left": {
          "lat": "37.797962",
          "lon": "-78.6787949"
        },
        "bottom_right": {
          "lat": "35.797962",
          "lon": "-74.6787949"
        }
      }
    }
  },
  "aggs": { 
    "wpp_agency_agent":     { "terms" : { "field" : "tax_input.wpp_agency_agent.name.raw" }}
  }  
}'
```

### Get Agent Names and Slugs
Simple aggregation of agents using the slug and name in two separate aggregations. The results can be combined client-side.

```
curl -XPOST "https://api.realty.ci/elasticsearch/v1/616bf200-b814-4a8b-816e-a4405061e3b8/post/_search?size=0&pretty=true" -d '{
  "aggs": { 
    "agentsSlugs": { "terms" : { "field" : "tax_input.wpp_agency_agent.slug" }}, 
    "agentsNames": { "terms" : { "field" : "tax_input.wpp_agency_agent.name.raw" }} 
  }
}'
```

### Get Top Landing Categories
Simple aggregation of top categories, except we exclude townhouses. As an example, check on the post_status.

```
curl -XPOST "https://api.realty.ci/elasticsearch/v1/616bf200-b814-4a8b-816e-a4405061e3b8/post/_search?size=0&pretty=true" -d '{
  "aggs": {
    "categories": { "terms" : {  "field" : "tax_input.wpp_listing_category.meta.url_path", "exclude" : [ "/townhouse/" ] } }, 
    "post_status": { "terms" : {  "field" : "post_status" } } 
  }
}'
```

### Advanced Notes
The Elasticsearch index is hosted on our rabbit.ci infrastructure. The cluster/index may be accessed directly like so:

  * https://api.realty.ci:kpcrcsqunvsmhrtf@api.wpcloud.io:19100/616bf200-b814-4a8b-816e-a4405061e3b8/
  
It may also be accessed using `api.realty.ci`:
  
  * https://api.realty.ci/elasticsearch/v1/616bf200-b814-4a8b-816e-a4405061e3b8
  
The RDC custom domain will be setup to work like so:

  * https://api.reddoorcompany.com/v3/search/
  
 



