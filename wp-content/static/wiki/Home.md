Welcome to the www.reddoorcompany.com wiki!


Provisioning Container:
```
rabbit run \
  --organization=UsabilityDynamics \
  --repository=www.reddoorcompany.com \
  --branch=production \
  --production
```

Provisioning production CloudFront distribution:

```
rabbit route create \
  --organization=UsabilityDynamics \
  --repository=www.Reddoorcompany.com \
  --branch=production \
  --domain=Reddoorcompany.com \
  --domain=www.Reddoorcompany.com \
  --skip-internal-route
```

Provisioning staging CloudFront distribution:
```
rabbit route create \
  --organization=UsabilityDynamics \
  --repository=www.Reddoorcompany.com \
  --branch=staging \
  --domain=staging.Reddoorcompany.com \
  --skip-internal-route
```