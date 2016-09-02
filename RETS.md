## Triangle MLS Credentials

### Standard Feed
* URL: http://triangle.rets.paragonrels.com/rets/fnisrets.aspx/TRIANGLE/login?rets-version=rets/1.7
* user: RedDoorIDX
* pass: teBRaq7n

### Closed Feed
* URL: http://triangle.apps.retsiq.com/rets/login
* user: RedDoorIDX2
* pass: Z8vac4W2Mq6eMdxp

## retsci RETS Sync
* 30 Day Resync: https://api.rets.ci/v1/client/listings/sync.json?client=www.reddoorcompany.com 

If you have the issues, like legacy data for some property or missing property on RDC just use the above link.

It executes sync processes for all schedules, which sync all properties which were modified for last 30 days. Also it sends messages to #rets-ci channel in Slack, so you know the current status

Before sync process is started, script stops all pollers. When sync is completed, we start pollers again. It’s done to prevent Session Errors on doing requests to RETS

But, be careful, every time you’re opening link, it starts new sync process! Need to find a way to prevent executing new sync if sync is already running