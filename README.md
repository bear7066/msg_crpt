# Meassage Encrption / Decrption in pulsar 

### 首先起一個 standalone pulsar 
``` docker run --platform linux/amd64 -it -p 6650:6650 -p 8080:8080 apachepulsar/pulsar:2.7.0 bin/pulsar standalone ```

之後用 docker start

curl -X PUT \ http://localhost:8080/admin/v2/tenants/my-tenant \
-H "Content-Type: application/json" \
-d '{
      "adminRoles": ["admin"],
      "allowedClusters": ["standalone"]
    }'

curl -X PUT \
http://localhost:8080/admin/v2/namespaces/my-tenant/my-ns \
-H "Content-Type: application/json"


curl -X POST \
http://localhost:8080/admin/v2/namespaces/my-tenant/my-ns/permissions/public \
-H "Content-Type: application/json" \
-d '["produce", "consume"]'

因為要驗證的關係，TLS可能會影響整體效能