# yaml-links-support

一个简单的 vscode 插件，为 yaml 文件提供定制化跳转支持

## Build

~~~bash
vsce package
~~~

## Usage

配置 `yaml-links-support.rules` , 添加自定义正则表达式

~~~json
{
    "yaml-links-support.rules": [
        // 为 kether script 提供跳转支持
        "(?<file>\\S+\\.ks)",
        // 为 java 文件提供跳转支持
        "(?<file>\\S+\\.java)",
    ]
}
~~~

如你所见，file 捕获组中的内容会被视作文件名，没有命名捕获组时则使用 group 0

配置 `yaml-links-support.file-types` , 编辑可用语言类型 （并不只能支持yaml）

~~~json
{
    "yaml-links-support.file-types": [
        "yaml",
        "plaintext",
    ]
}
~~~