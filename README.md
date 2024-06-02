# Meassage Encrption / Decrption in pulsar 

### 1. 首先起一個 standalone pulsar 
``` docker run --platform linux/amd64 -it -p 6650:6650 -p 8080:8080 apachepulsar/pulsar:2.7.0 bin/pulsar standalone ```

### 關掉之後可用這個指令重啟
``` docker start [container_name]```

### 2. 創建租戶（Tenant）
```
curl -X PUT \ http://localhost:8080/admin/v2/tenants/my-tenant \
-H "Content-Type: application/json" \
-d '{
      "adminRoles": ["admin"],
      "allowedClusters": ["standalone"]
    }'
```
### 3. 創建命名空間（Namespace）
```
curl -X PUT \
http://localhost:8080/admin/v2/namespaces/my-tenant/my-ns \
-H "Content-Type: application/json"
```

### 4. 設置命名空間的權限
```
curl -X POST \
http://localhost:8080/admin/v2/namespaces/my-tenant/my-ns/permissions/public \
-H "Content-Type: application/json" \
-d '["produce", "consume"]'
```
