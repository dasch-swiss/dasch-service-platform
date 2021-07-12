# Deployment Configuration

To use this API, a few things must be configured first.

## keycloak.json

This file provides the necessary info for Keycloak.

It should be placed in your public/admin directory.

These values should match your Keycloak server/realm configurations.

```json
{
  "realm": "my-realm-name",
  "auth-server-url": "https://auth.server.url",
  "ssl-required": "external",
  "resource": "dasch-service-platform",
  "public-client": true,
  "confidential-port": 0
}
```

## keycloak_realm_key.rsa.pub
This file is found in services/admin/backend/config. The contents should be replaced with the public key from your Keycloak realm which can be found under the "Keys" tab under "Realm Settings" in the Keycloak admin console. The file name must remain "keycloak_realm_key.rsa.pub".