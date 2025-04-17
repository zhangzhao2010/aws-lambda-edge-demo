export const handler = async (event) => {
    const request = event.Records[0].cf.request;
    const queryString = request.querystring;
    const uri = request.uri;

    // 检查是否有size参数且格式为w*h
    const params = new URLSearchParams(queryString);
    if (params.has('size')) {
        const sizeValue = params.get('size');
        const sizeMatch = sizeValue.match(/^(\d+)\*(\d+)$/);

        if (sizeMatch) {
            const width = sizeMatch[1];
            const height = sizeMatch[2];

            // 解析原始路径
            const pathParts = uri.split('/');

            if (pathParts.length > 0) {
                pathParts[0] = pathParts[0] + '-resizer';
            }

            const fileName = pathParts.pop();
            const newPath = pathParts.join('/');

            // 构建新路径
            const newUri = `${newPath}/${width}_${height}_${fileName}`;

            // 保存原始URI以便在找不到调整大小的图片时回退
            if (!request.headers['x-original-uri']) {
                request.headers['x-original-uri'] = [{
                    key: 'X-Original-Uri',
                    value: request.uri
                }];
            }

            request.uri = newUri;
        }
    }

    return request;
}