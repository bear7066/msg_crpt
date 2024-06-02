# Meassage Encrption / Decrption in pulsar 

### 1. 首先起一個 standalone pulsar 
``` docker run --platform linux/amd64 -it -p 6650:6650 -p 8080:8080 apachepulsar/pulsar:2.7.0 bin/pulsar standalone ```

### 關掉之後可用這個指令重啟
``` docker start [container_name]```

### 2. 創建租戶（Tenant）
```
curl -X PUT "http://localhost:8080/admin/v2/tenants/my-tenant" \
-H "Content-Type: application/json" \
-d '{"adminRoles": ["admin"], "allowedClusters": ["standalone"]}'
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
### 5. 設置 Pulbic / Private key
此時 pulsar 設置好了，接著用 RSA 創建密鑰及公鑰

#### 公鑰
```
openssl genpkey -algorithm RSA -out test_rsa_privkey.pem -pkeyopt rsa_keygen_bits:2048
```

#### 密鑰
```
openssl rsa -pubout -in test_rsa_privkey.pem -out test_rsa_pubkey.pem
```

### 6. 啟動主程式

```
node main.js
```

### Ngrok
幫訊息加上一條保護層，避免外人監聽流量

1. 取得 authentication token 之後，將其配置在本地端
```
ngrok config add-authtoken 2hKHdIRtY4VxqKBzobUK5MIv22X_jQnCxZ26pfrmTyRBPv68
```
2. 查看配置

```
ngrok http 6650                                                            
```
- 也可以使用 ngrok.yml 手動配置可以通過保護層的人，如下：
```
ngrok.yml

authtoken: YOUR_AUTH_TOKEN
tunnels:
  user1:
    proto: http
    addr: 6650
    auth: "user1:password1"
  user2:
    proto: http
    addr: 6650
    auth: "user2:password2"
```

![註冊連結](https://dashboard.ngrok.com/)

