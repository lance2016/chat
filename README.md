**# 利用ChatGPT 生成前端界面**

## 1. 前端

> 前端代码和ChatGPT讨论生成

1. 组成：

```js
 - index.html
 - style.css 
 - script.js 
 # 由前端最原始最基础的部分组成
```

2. 效果图：![image-20230218122736164](https://i.328888.xyz/2023/02/18/BohfH.png)

## 2. 后端

后端基于[openai接口](https://openai.com/api/), 具体可参考官网API接口

返回体：

> 只做了做简单的返回

```json
{
	"message": "your message"
}


```

## 3. 运行

只需要修改script代码中具体请求路径为实际路径

```js
http://localhost:8000/chat/  替换为自己服务的实际路径
```

## 4.其他

欢迎有兴趣的小伙伴一起研究，讨论ChatGPT的有趣应用，发掘它的无限可能

email: lancefate@163.com



