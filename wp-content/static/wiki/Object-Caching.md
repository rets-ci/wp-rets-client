Following commands can be used to work with Memcached server directly:

```
echo 'stats' | nc localhost 23038
echo 'flush_all' | nc localhost 23038
echo 'flush_all 10' | nc localhost 23038
```