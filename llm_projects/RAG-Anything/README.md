# RAGAnything - 多模态文档处理RAG框架

> All-in-One Multimodal Document Processing RAG Framework

本项目整合自 [HKUDS/RAG-Anything](https://github.com/HKUDS/RAG-Anything)，提供完整的多模态文档处理RAG系统。

## 核心特性

- 🔄 **端到端多模态流程** - 从文档摄取、解析到智能多模态查询的完整工作流
- 📄 **通用文档支持** - 无缝处理PDF、Office文档、图片和多种文件格式
- 🧠 **专业内容分析** - 图像、表格、数学公式和异构内容类型的专用处理器
- 🔗 **多模态知识图谱** - 自动实体提取和跨模态关系发现
- ⚡ **自适应处理模式** - 基于MinerU的解析或直接多模态内容注入工作流
- 🎯 **混合智能检索** - 跨文本和多模态内容的高级搜索能力

## 支持的文档格式

| 格式 | 类型 | 说明 |
|------|------|------|
| PDF | 文档 | 高保真PDF解析 |
| DOC/DOCX | Office | Word文档 |
| PPT/PPTX | Office | PowerPoint演示文稿 |
| XLS/XLSX | Office | Excel表格 |
| TXT/MD | 文本 | 纯文本和Markdown |
| JPG/PNG | 图片 | 图像文件 |

## 目录结构

```
RAG-Anything/
├── raganything/              # 核心模块
│   ├── __init__.py          # 模块初始化
│   ├── raganything.py        # RAGAnything主类
│   ├── config.py            # 配置类
│   └── parser.py            # 文档解析器
├── examples/                 # 示例代码
│   ├── raganything_example.py      # 基本使用示例
│   ├── batch_processing_example.py # 批处理示例
│   └── multimodal_query_example.py  # 多模态查询示例
├── requirements.txt          # 依赖文件
└── README.md                 # 说明文档
```

## 快速开始

### 安装依赖

```bash
pip install -r requirements.txt
```

### 基本使用

```python
import asyncio
from raganything import RAGAnything, RAGAnythingConfig

# 创建配置
config = RAGAnythingConfig(
    working_dir="./rag_storage",
    parser="mineru",
    enable_image_processing=True,
    enable_table_processing=True,
    enable_equation_processing=True
)

# 初始化RAGAnything
rag = RAGAnything(config=config)

# 处理文档
result = await rag.process_file("document.pdf")
print(result)

# 查询
response = await rag.query("What is the document about?", mode="hybrid")
print(response)
```

### 批处理

```python
# 批量处理文件夹
results = await rag.process_folder(
    folder_path="./documents",
    recursive=True
)
```

### 多模态查询

```python
# 带表格的查询
result = await rag.query_with_multimodal(
    "Analyze this data",
    multimodal_content=[
        {
            "type": "table",
            "table_data": "Method,Accuracy\nRAG,95.2%",
            "table_caption": "性能对比"
        }
    ],
    mode="hybrid"
)

# 带公式的查询
result = await rag.query_with_multimodal(
    "Explain this equation",
    multimodal_content=[
        {
            "type": "equation",
            "equation_data": "E = mc^2",
            "equation_caption": "质能方程"
        }
    ],
    mode="hybrid"
)
```

## 配置选项

| 参数 | 默认值 | 说明 |
|------|--------|------|
| working_dir | "./rag_storage" | 工作目录 |
| parser | "mineru" | 解析器：mineru, docling, paddleocr |
| parse_method | "auto" | 解析方法：auto, ocr, txt |
| enable_image_processing | True | 启用图像处理 |
| enable_table_processing | True | 启用表格处理 |
| enable_equation_processing | True | 启用公式处理 |
| max_concurrent_files | 1 | 最大并发文件数 |
| context_window | 1 | 上下文窗口大小 |
| max_context_tokens | 2000 | 最大上下文token数 |

## 文档解析器

### MineruParser
- 高保真PDF解析
- 支持图像、表格、公式提取
- Office文档转换支持

### DoclingParser
- Office文档专用解析
- HTML支持
- PDF解析

### PaddleOCRParser
- OCR-based解析
- 扫描文档处理
- 多语言支持

## 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| **RAG框架** | LightRAG | 智能检索增强生成 |
| **PDF解析** | MinerU | 高保真文档解析 |
| **Office解析** | Docling | Office文档处理 |
| **OCR** | PaddleOCR | 光学字符识别 |
| **多模态** | VLM | 视觉语言模型 |

## 运行示例

```bash
# 基本示例
python examples/raganything_example.py

# 批处理示例
python examples/batch_processing_example.py

# 多模态查询示例
python examples/multimodal_query_example.py
```

## 参考资源

- [RAG-Anything原项目](https://github.com/HKUDS/RAG-Anything)
- [LightRAG](https://github.com/HKUDS/LightRAG)
- [MinerU](https://github.com/opendatalab/MinerU)
- [Docling](https://github.com/DS4SD/docling)

## 许可证

MIT License
