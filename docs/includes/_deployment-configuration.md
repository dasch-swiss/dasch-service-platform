# Deployment Configuration

To use this API, a few things must be configured first.

## keycloak.json

This file provides the necessary info for Keycloak.

It should be placed in your public/admin directory.

These values should match your Keycloak server/realm configurations.

```json
{
  "realm": "admin-service-dsp-1760",
  "auth-server-url": "https://auth.dasch.swiss/auth/",
  "ssl-required": "external",
  "resource": "dasch-service-platform",
  "public-client": true,
  "confidential-port": 0
}
```

## key.rsa.pub
TODO: Once the public key is moved to a file, clarify that this file must be updated with the Keycloak realms public key.