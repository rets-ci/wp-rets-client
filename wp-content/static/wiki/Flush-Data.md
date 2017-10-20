## Flush Imported Properties Data

In some cases, we have to flush all imported data. To make ability to sync everything from scratch.
Here is the instructions, how it can be done fast.

### Steps

Because of huge amount of the data, the process of removing all properties, their attachments and taxonomy terms may take too long time.
To force the process, the following steps are proposed:

* Delete media attachments and post meta using direct SQL queries. See: SQL queries section below.
* Optimize `wp_postmeta` and `wp_posts` MySQL tables.
* Delete all broken and non-registered taxonomies terms via running WP-CLI command `wp wpp-term cleanup`.
* Flush all wp-property terms via running WP-CLI command `wp wpp-term delete`.
* Optimize terms tables: `wp_terms`, `wp_termmeta`, `wp_term_taxonomy`, `wp_term_relationships`.
* Flush Object Cache by running WP-CLI command `wp cache flush`.
* And now, flush all properties by running WP-CLI command `wp property delete`.
* Flush Object Cache and Optimize posts and terms tables one more time.

**Note.** All steps must be done in the same order.

### SQL queries

1. delete all post meta tied to properties media attachments

```sql
DELETE FROM wp_postmeta WHERE post_id IN ( SELECT ID FROM wp_posts WHERE post_type="attachment" AND guid LIKE "%cdn.rets.ci%" );
```

2. Delete all posts tied to properties media attachments

```sql
DELETE FROM wp_posts WHERE post_type="attachment" AND guid LIKE "%cdn.rets.ci%";
```

3. Delete all post meta tied to properties

```sql
DELETE FROM wp_postmeta WHERE post_id IN ( SELECT ID FROM wp_posts WHERE post_type="property" );
```