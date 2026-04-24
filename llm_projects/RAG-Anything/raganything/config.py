#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Configuration classes for RAGAnything
"""

from dataclasses import dataclass, field
from typing import List


def get_env_value(key: str, default, type_):
    """Get environment variable value with type conversion"""
    import os
    value = os.getenv(key)
    if value is None:
        return default

    if type_ == bool:
        return value.lower() in ("true", "1", "yes")
    elif type_ == int:
        try:
            return int(value)
        except ValueError:
            return default
    elif type_ == float:
        try:
            return float(value)
        except ValueError:
            return default
    else:
        return value


@dataclass
class RAGAnythingConfig:
    """Configuration class for RAGAnything with environment variable support"""

    working_dir: str = field(default="./rag_storage")
    parser: str = field(default="mineru")
    parse_method: str = field(default="auto")
    parser_output_dir: str = field(default="./output")
    display_content_stats: bool = field(default=True)

    enable_image_processing: bool = field(default=True)
    enable_table_processing: bool = field(default=True)
    enable_equation_processing: bool = field(default=True)

    max_concurrent_files: int = field(default=1)
    supported_file_extensions: List[str] = field(
        default_factory=lambda: [
            ".pdf", ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif",
            ".gif", ".webp", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt", ".md"
        ]
    )
    recursive_folder_processing: bool = field(default=True)

    context_window: int = field(default=1)
    context_mode: str = field(default="page")
    max_context_tokens: int = field(default=2000)
    include_headers: bool = field(default=True)
    include_captions: bool = field(default=True)
    context_filter_content_types: List[str] = field(default_factory=lambda: ["text"])
    content_format: str = field(default="minerU")

    use_full_path: bool = field(default=False)

    def __post_init__(self):
        """Post-initialization processing"""
        pass
