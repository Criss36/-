#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
多模态查询示例

展示如何执行包含图像、表格、公式的多模态查询
"""

import asyncio

from raganything import RAGAnything, RAGAnythingConfig


async def multimodal_query_example():
    """多模态查询示例"""
    config = RAGAnythingConfig(
        working_dir="./rag_storage",
        parser="mineru",
        enable_image_processing=True,
        enable_table_processing=True,
        enable_equation_processing=True,
    )

    def llm_model_func(prompt, **kwargs):
        return f"LLM Response: {prompt[:50]}..."

    def embedding_func(texts):
        import numpy as np
        return np.random.rand(len(texts), 768).tolist()

    rag = RAGAnything(
        config=config,
        llm_model_func=llm_model_func,
        embedding_func=embedding_func,
    )

    # 表格查询示例
    table_content = {
        "type": "table",
        "table_data": "Method,Accuracy,F1-Score\nRAG,95.2%,0.91\nBaseline,87.3%,0.85",
        "table_caption": "模型性能对比",
    }

    result = await rag.query_with_multimodal(
        "Compare these methods and suggest the best one",
        multimodal_content=[table_content],
        mode="hybrid"
    )
    print(f"表格查询结果: {result}")

    # 公式查询示例
    equation_content = {
        "type": "equation",
        "equation_data": "E = mc^2",
        "equation_caption": "质能方程",
    }

    result = await rag.query_with_multimodal(
        "Explain this equation",
        multimodal_content=[equation_content],
        mode="hybrid"
    )
    print(f"公式查询结果: {result}")

    # 图像查询示例
    image_content = {
        "type": "image",
        "image_path": "./image.jpg",
        "image_caption": "架构图",
    }

    result = await rag.query_with_multimodal(
        "Describe this architecture",
        multimodal_content=[image_content],
        mode="hybrid"
    )
    print(f"图像查询结果: {result}")


async def main():
    print("多模态查询示例")
    print("=" * 50)

    try:
        await multimodal_query_example()
        print("\n多模态查询执行成功!")
    except Exception as e:
        print(f"\n执行出错: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
