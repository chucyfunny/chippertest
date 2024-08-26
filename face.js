// replace_selfie.js

const redirectUrl = "https://chipper.myngn.top/api/v1/upload/selfie";

// 从请求头中获取 'code'
const code = $request.headers['code'];

if (!code) {
  const errorMsg = '请求头中缺少 "code" 参数。';
  console.log(errorMsg);
  $notify('拦截请求失败', '缺少 "code" 参数', errorMsg);
  $done({ response: { status: 400, body: errorMsg } });
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

      console.log('请求体已成功修改:', requestBody);
      $notify('请求成功', '请求体已修改', '请求体中的 "selfie" 值已被成功替换。');

      // 放行修改后的请求
      $done({ body: JSON.stringify(requestBody) });
    } else {
      const errorMsg = `获取 selfie 数据失败，状态码: ${response.statusCode}`;
      console.log(errorMsg);
      $notify('请求错误', '获取 selfie 数据失败', errorMsg);
      $done({ response: { status: response.statusCode, body: errorMsg } });
    }
  }, error => {
    const errorMsg = '无法从服务器获取数据，错误信息: ' + error.error;
    console.log(errorMsg);
    $notify('请求失败', '网络错误', errorMsg);
    $done({ response: { status: 500, body: '服务器请求失败，无法获取数据。' } });
  });
}
