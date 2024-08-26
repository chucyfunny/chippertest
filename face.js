// replace_selfie.js

const redirectUrl = "https://chipper.myngn.top/api/v1/upload/selfie";

// 从请求头中获取 'code'
const code = $request.headers['code'];

if (!code) {
  console.log('No code found in request headers.');
  $done({ response: { status: 400, body: 'Code is required in the request headers.' } });
} else {
  // 使用 $task.fetch 发送 GET 请求
  const options = {
    url: redirectUrl,
    headers: { 'code': code },
    method: 'GET'
  };

  $task.fetch(options).then(response => {
    if (response.statusCode === 200) {
      // 读取 GET 请求的返回体
      let selfieValue = response.body;

      // 修改原始请求体
      let requestBody = JSON.parse($request.body);
      requestBody.selfie = selfieValue;  // 用获取的数据替换 selfie 的值

      console.log('Modified request body:', requestBody);

      // 放行修改后的请求
      $done({ body: JSON.stringify(requestBody) });
    } else {
      console.log('Error fetching selfie data. Status Code:', response.statusCode);
      $done({ response: { status: response.statusCode, body: 'Error fetching selfie data.' } });
    }
  }, error => {
    console.log('Failed to fetch data from server:', error);
    $done({ response: { status: 500, body: 'Failed to fetch data from the server.' } });
  });
}
