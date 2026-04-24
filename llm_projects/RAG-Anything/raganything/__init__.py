# RAGAnything - All-in-One Multimodal Document Processing RAG Framework

"""
RAGAnything - 多模态文档处理RAG框架

支持功能：
- 文档解析：PDF、Office文档、图片、文本
- 多模态处理：图像、表格、公式
- 智能检索：LightRAG集成
- 批处理：文件夹批量处理
- 多种查询模式：混合查询、本地查询、全局查询

依赖：
- lightrag-hku
- mineru[core]
- tqdm

安装：
    pip install -r requirements.txt

示例：
    from raganything import RAGAnything, RAGAnythingConfig

    config = RAGAnythingConfig(
        working_dir="./rag_storage",
        parser="mineru",
        enable_image_processing=True
    )

    rag = RAGAnything(config=config)
"""

from raganything.raganything import RAGAnything
from raganything.config import RAGAnythingConfig
from raganything.parser import (
    MineruParser,
    DoclingParser,
    PaddleOCRParser,
    get_parser,
)

__version__ = "1.0.0"

__all__ = [
    "RAGAnything",
    "RAGAnythingConfig",
    "MineruParser",
    "DoclingParser",
    "PaddleOCRParser",
    "get_parser",
]
