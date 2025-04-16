# 使用 Lambda.edge 完成url自动重写

## 功能描述
使用 AWS CloudFront作为CDN，图片存储在S3中。
当链接参数中有size参数，且格式为w*h时，修改请求路径。
例如：
访问图片链接：https://example.com/test.jpg?size=300*400；
重写后的路径为：/300_400_test.jpg

当/300_400_test.jpg 文件不存在时，重定向到 https://example.com/test.jpg

## 部署步骤

### 创建lambda
Region: us-east-1

**路径重写lambda:**
Runtime: Node.js 22.x
Architecture: x86_64
代码参见 `origin_response.mjs`

**40x捕捉lambda:**
Runtime: Node.js 22.x
Architecture: x86_64
代码参见 `viewer_request.mjs`

**lambda权限配置**
```
{  
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:*:*:*"
            ]
        }
    ]
}
```

### 将lambda 发布到lambda.edge
Viewer request 使用 `路径重写lambda`;
Origin response 使用 `40x捕捉lambda`;

### CloudFront 配置

#### 新建origin request policy
**1. Headers - Include the following headers**
```
Origin
Access-Control-Request-Method
Access-Control-Request-Headers
x-original-uri
```
在distribution中使用以上policy
