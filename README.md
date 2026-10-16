# 音标点读（English IPA 点读应用）

一个离线可用的英语音标点读网页应用：点击音标符号听发音，点击示例词听单词发音。

## 如何使用

**最简单：直接双击 `index.html`**，用浏览器（Chrome / Edge）打开即可，无需联网、无需安装。

> 如果希望用本地服务器方式打开（可选）：
> ```
> cd 音标点读
> python -m http.server 8000
> ```
> 然后浏览器访问 http://127.0.0.1:8000

## 内容

- **48 个英语音标**（美式 General American）。
- **元音**按嘴部形状（舌位前后）分组：前元音 / 中元音 / 后元音 / 双元音 / 卷舌元音。
- **辅音**按发音部位（嘴型）× 清浊（声带震动）分组：双唇、唇齿、齿间、齿龈、龈后、硬腭、软腭、声门；卡片右上角标注「清音 / 浊音」。
- 每个音标带：IPA 符号、示例词、示例词音标。
- 界面支持中文 / English / 日本語 三种语言，右上角切换，自动跟随浏览器语言并记住选择。

## 目录结构

```
音标点读/
├── index.html        页面
├── style.css         样式
├── app.js            交互逻辑
├── data.js           音标数据（内联，供离线使用）
├── phonemes.json     音标数据（JSON，供脚本/二次开发）
├── audio/
│   ├── phonemes/     48 个音标发音 WAV
│   └── words/        48 个示例词发音 MP3
└── README.md
```

## 音频来源

- **音标发音**：Sounds American（soundsamerican.net）IPA 音标表，48 个标准发音。
- **示例词发音**：Sounds American（soundsamerican.net），与音标同源的美音真人朗读。

## 如何重新生成 / 修改

示例词发音由脚本抓取 Sounds American 各音标文章的词卡后下载生成，并重建 `phonemes.json` 与 `data.js`。
（需要能访问 soundsamerican.net；若你的网络环境需要代理，请在脚本中自行配置。）
