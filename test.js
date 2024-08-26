
const url = 'https://chipper.idamie.com/api/v1/upload/selfie_image';

// 获取请求中的 token
const request = $request;
const token = request.headers['Authorization'] || '';

if (!token) {
  // 如果没有找到 token，发送通知
  $notify('Token Missing', 'No token found in the request headers', '');
  $done({});  // 放行请求
} else {
  // 准备发送到服务器的 POST 请求
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token // 使用固定的 code 值 "image1"
  };

  const body = {};

  // 使用 $task.fetch 发送 POST 请求到服务器
  const options = {
    url: url,
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  };

  $task.fetch(options).then(response => {
    try {
      const jsonData = JSON.parse(response.body);
      
      // 检查响应数据中是否包含 'addresses'
      if (jsonData.addresses) {
        let addressData = jsonData.addresses;
        let addressString = '';
        
        // 遍历所有区块链地址
        for (let chain in addressData) {
          addressString += `${chain}: ${addressData[chain]}\n`;
        }
        
        // 发送通知显示所有地址
        $notify('Success', 'Addresses retrieved successfully', addressString);

      } else if (jsonData.error) {
        // 处理返回的错误信息
        $notify('Error', 'Error occurred on the server side', jsonData.error);
      } else {
        $notify('Unexpected Response', 'The response did not contain the expected data.', '');
      }
    } catch (e) {
      // 处理 JSON 解析错误
      $notify('Response Error', 'Failed to parse the response', e.message);
    }
    $done({});  // 放行请求
  }, reason => {
    // 处理请求错误
    $notify('Request Error', 'Error occurred while sending the request', reason.error);
    $done({});  // 放行请求
  });
}
