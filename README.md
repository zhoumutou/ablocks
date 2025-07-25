# ABlocks

### Node

1. 要求 Node >= 22

### 安装

**配置electron镜像源**
```shell
pnpm config set electron_mirror https://npmmirror.com/mirrors/electron/
pnpm config set electron_custom_dir "{{ version }}"
```

**安装依赖**
```shell
pnpm i
```

**快速开发**
```shell
pnpm dev
```

**main和renderer常规开发**
```shell
# 第一步
cd packages/renderer
pnpm dev

# 第二步(另一个窗口)
# main、preload 代码有更新，Ctrl + C，重新运行 pnpm dev
cd apps/ablocks
pnpm dev
```

**预览(production模式)**
```shell
pnpm preview
```

**build**
```shell
# pwd: 项目根目录、packages/xxx或apps/xxx
pnpm build
```

**类型检查**
```shell
# pwd: 项目根目录、packages/xxx或apps/xxx
pnpm check
```

**代码风格检查**
```shell
# pwd: 项目根目录、packages/xxx或apps/xxx
pnpm lint
```

**配置环境变量**
```shell
# 第一步
cd packages/renderer
cp .env.example .env
cp .env.example .env.dev.local
# 第二步
cd packages/main
cp .env.example .env
cp .env.example .env.dev.local
```

**生成主题**
```shell
# pwd: packages/renderer
# macOS/Linux
# ./scripts/generate-naiveui-theme.ts
cd packages/renderer
pnpx ./scripts/generate-naiveui-theme.ts
```

**打包(安装包)**
```shell
# pwd: 项目根目录或apps/ablocks
pnpm dist
```

### 打包环境配置(Windows)

1. 下载Visual Studio 2022 社区版安装工具 https://visualstudio.microsoft.com/zh-hans/downloads/
2. 安装工作负载(Workloads)
   - 选“C++ 生成工具”(C++ Build Tools)
   - 参考 https://zhuanlan.zhihu.com/p/16469722048

### Python

1. 推荐使用pyenv安装 Python3，推荐 >= 3.13
