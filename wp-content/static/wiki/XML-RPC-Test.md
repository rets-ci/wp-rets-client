### Create/Update Listing (wpp.editProperty)
To test XML-RPC "wpp.editProperty" being pushed, run:

```
curl --data @wp-content/static/data/sample-property-post.xml http://localhost/xmlrpc.php
```

```
curl --data @wp-content/static/data/removeDuplicatedMLS.xml http://localhost/xmlrpc.php
```


### Update Meta (wpp.updatePropertyMeta)

```
curl --data @wp-content/static/data/wpp.updatePropertyMeta.xml http://localhost/xmlrpc.php
```

### Update Property

```
curl -H "x-selected-branch:develop-v3-andy" --data @wp-content/static/test/fixtures/property-2112152.xml http://localhost/xmlrpc.php
```
