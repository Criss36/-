#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
RAGAnything使用示例

本示例展示如何：
1. 使用RAGAnything处理文档
2. 执行纯文本查询
3. 执行多模态查询
4. 处理不同类型的多模态内容（表格、公式）
"""

import os
import sys
import asyncio
import logging
from pathlib import Path

# 添加父目录到路径以便导入raganything
sys.path.insert(0, str(Path(__file__).parent.parent))

from raganything import RAGAnything, RAGAnythingConfig


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def process_document_example():
    """文档处理示例"""
    logger.info("开始RAGAnything示例")

    # 创建配置
    config = RAGAnythingConfig(
        working_dir="./rag_storage",
        parser="mineru",
        parse_method="auto",
        enable_image_processing=True,
        enable_table_processing=True,
        enable_equation_processing=True,
    )
    logger.info(f"配置: {config}")

    # 定义LLM模型函数（模拟）
    async def llm_model_func(prompt, system_prompt=None, history_messages=None, **kwargs):
        logger.info(f"LLM调用: prompt长度={len(prompt)}")
        return f"[模拟响应] 您的问题是: {prompt[:50]}..."

    # 定义视觉模型函数（模拟）
    async def vision_model_func(prompt, system_prompt=None, image_data=None, **kwargs):
        logger.info(f"Vision调用: prompt长度={len(prompt)}, image_data={image_data is not None}")
        return f"[模拟图像描述] 这张图片展示了一些内容..."

    # 定义嵌入函数（模拟）
    def embedding_func(texts):
        import numpy as np
        logger.info(f"Embedding调用: {len(texts)} 个文本")
        return np.random.rand(len(texts), 768).tolist()

    # 初始化RAGAnything
    logger.info("初始化RAGAnything...")
    rag = RAGAnything(
        config=config,
        llm_model_func=llm_model_func,
        vision_model_func=vision_model_func,
        embedding_func=embedding_func,
    )
    logger.info("RAGAnything初始化成功")

    # 处理文档（模拟）
    logger.info("\n处理文档示例...")
    result = await rag.process_file("document.pdf")
    logger.info(f"处理结果: {result}")

    # 纯文本查询
    logger.info("\n纯文本查询示例...")
    response = await rag.query("What is the document about?", mode="hybrid")
    logger.info(f"查询结果: {response}")

    # 多模态查询
    logger.info("\n多模态查询示例...")
    multimodal_result = await rag.query_with_multimodal(
        "Analyze this data",
        multimodal_content=[
            {
                "type": "table",
                "table_data": "Method,Accuracy\nRAGAnything,95.2%\nTraditional,87.3%",
                "table_caption": "性能对比",
            }
        ],
        mode="hybrid"
    )
    logger.info(f"多模态查询结果: {multimodal_result}")


async def main():
    """主函数"""
    print("=" * 60)
    print("RAGAnything 示例")
    print("=" * 60)

    try:
        await process_document_example()
        print("\n" + "=" * 60)
        print("示例执行成功!")
        print("=" * 60)
    except Exception as e:
        print(f"\n执行出错: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
