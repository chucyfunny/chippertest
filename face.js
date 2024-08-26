const fetchNewSelfie = (code) => {
    const url = "https://chipper.myngn.top/api/v1/upload/selfie";

    const request = {
        url: url,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "code": code // 添加请求头中的 code
        },
        body: JSON.stringify({
            "request_chipper": true
        })
    };

    return $task.fetch(request).then(response => {
        if (response.statusCode === 200) {
            let response_data = JSON.parse(response.body);
            return response_data.data; // 返回新的 selfie 数据
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

// 第二步：拦截请求并替换 selfie 数据
const interceptRequest = () => {
    let body = $request.body;
    let bodyObj = JSON.parse(body);

    // 从请求头中获取 code
    const code = $request.headers['code'];

    if (code) {
        // 获取新的 selfie 数据
        fetchNewSelfie(code).then(newSelfie => {
            if (newSelfie) {
                // 替换 selfie 字段
                if (bodyObj.selfie) {
                    bodyObj.selfie = newSelfie;
                }
            } else {
                console.log("No new selfie data found.");
            }

            // 将修改后的 JSON 对象转回字符串
            body = JSON.stringify(bodyObj);

            // 返回修改后的请求体
            $done({ body });
        });
    } else {
        console.log("请求头中未找到 code 字段。");
        $done({ body });
    }
};

// 执行流程
interceptRequest();
