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
