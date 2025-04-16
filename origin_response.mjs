export const handler = async (event) => {
    const response = event.Records[0].cf.response;
    const request = event.Records[0].cf.request;
    // console.log(response.status);
    // console.log(request.headers);

    // 如果图片不存在(40x)且有原始URI信息
    if (response.status < 500 && response.status >= 400 && request.headers['x-original-uri']) {
        // 获取原始URI
        const originalUri = request.headers['x-original-uri'][0].value;
        console.log(originalUri);

        response.status = 302;
        response.statusDescription = 'Found';

        response.body = '';
        response.headers['location'] = [{ key: 'Location', value: originalUri }];
    }

    return response;
};
