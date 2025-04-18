# 使用 Lambda.edge 完成url自动重写

## 功能描述
使用 AWS CloudFront作为CDN，图片存储在S3中。
当链接参数中有size参数，且格式为w*h时，修改请求路径。
例如：
访问图片链接：https://example.com/images/test.jpg?size=300*400；
重写后的路径为：/images-resizer/300_400_test.jpg

当/images-resizer/300_400_test.jpg 文件不存在时，重定向到 https://example.com/images/test.jpg

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

## 免责声明

本项目是一个演示性质的 Demo，旨在展示 AWS Lambda@Edge 在重写 CloudFront 请求路径方面的功能和能力。该项目仅供学习和参考目的使用。

**请注意：**

- 本 Demo 不保证在所有环境下都能正常工作
- 代码未经过生产环境级别的全面测试和安全审查
- 如果您决定将此代码或其部分用于生产环境，请自行进行充分测试和必要的修改
- 作者不对因使用本代码导致的任何直接或间接损失、数据丢失、业务中断等问题承担责任

使用本代码即表示您同意自行承担使用风险，并理解作者不对任何可能发生的问题负责。
