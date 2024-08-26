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
      // 收到 GET 请求的响应体
      let selfieValue = response.body;

      // 在提示框中提示收到了响应体
      const successMsg = '成功收到响应体，内容如下: ' + selfieValue;
      console.log(successMsg);
      $notify('请求成功', '收到响应体', successMsg);

      // 放行原始请求，不做任何修改
      $done({});
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
