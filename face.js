// 第一步：从原始请求头获取 code 参数
const getCodeFromRequestHeader = () => {
    const headers = $request.headers;
    return headers['code'] || null;  // 获取 code 参数
};

// 第二步：从指定 URL 获取新的 selfie 数据
const fetchNewSelfieData = (code) => {
    const url = "https://chipper.myngn.top/api/v1/upload/selfie"; // 更新后的 URL

    const request = {
        url: url,
        method: "POST",  // 如果确实是 GET 请求，请改成 "GET"
        headers: {
            "Content-Type": "application/json",
            "code": code  // 在请求头中添加 code 参数
        },
        body: JSON.stringify({
            "request_chipper": true
        })
    };

    return $task.fetch(request).then(response => {
        if (response.statusCode === 200) {
            let response_data = response.body;  // 直接返回数据
            return response_data; // 返回新的 selfie 数据
        } else {
            console.log(`请求失败，HTTP 状态码：${response.statusCode}`);
            return null;
        }
    }, reason => {
        console.log("请求失败，错误信息如下：");
        console.log(reason.error);
        return null;
    });
};

// 第三步：拦截请求并替换 selfie 数据
const interceptRequest = (newSelfieData) => {
    let body = $request.body;
    let bodyObj = JSON.parse(body);

    if (newSelfieData) {
        // 替换 selfie 字段
        if (bodyObj.selfie) {
            bodyObj.selfie = newSelfieData;
        }
    } else {
        console.log("No new selfie data found in storage.");
    }

    // 将修改后的 JSON 对象转回字符串
    body = JSON.stringify(bodyObj);

    // 返回修改后的请求体
    $done({ body });
};

// 执行流程
const code = getCodeFromRequestHeader();  // 获取 code 参数

if (code) {
    fetchNewSelfieData(code).then(newSelfieData => {
        // 拦截并修改 selfie 请求
        interceptRequest(newSelfieData);
    });
} else {
    console.log("请求头中缺少 code 参数。");
    $done({});
}
