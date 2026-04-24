#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
批处理示例

展示如何批量处理文件夹中的文档
"""

import os
import asyncio
from pathlib import Path

from raganything import RAGAnything, RAGAnythingConfig


async def batch_process_example():
    """批处理示例"""
    config = RAGAnythingConfig(
        working_dir="./rag_storage",
        parser="mineru",
        max_concurrent_files=4,
    )

    def llm_model_func(prompt, **kwargs):
        return f"Response to: {prompt[:50]}..."

    def embedding_func(texts):
        import numpy as np
        return np.random.rand(len(texts), 768).tolist()

    rag = RAGAnything(
        config=config,
        llm_model_func=llm_model_func,
        embedding_func=embedding_func,
    )

    # 批量处理文件夹
    results = await rag.process_folder(
        folder_path="./documents",
        recursive=True
    )

    print(f"处理了 {len(results)} 个文档")
    for result in results:
        print(f"  - {result.get('file_path', 'unknown')}: {'成功' if result.get('success') else '失败'}")


async def main():
    print("批处理示例")
    print("=" * 50)

    try:
        await batch_process_example()
        print("\n批处理执行成功!")
    except Exception as e:
        print(f"\n执行出错: {e}")


if __name__ == "__main__":
    asyncio.run(main())
