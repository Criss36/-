# RAGAnything - Multimodal Document Processing RAG Framework

"""
RAGAnything - All-in-One Multimodal Document Processing RAG Framework

This module provides a comprehensive RAG system that can process various document formats
including PDFs, Office documents, images, and more. It integrates with LightRAG for
intelligent retrieval and supports multimodal content processing.
"""

from raganything.raganything import RAGAnything
from raganything.config import RAGAnythingConfig
from raganything.parser import MineruParser, DoclingParser, PaddleOCRParser, get_parser

__version__ = "1.0.0"

__all__ = [
    "RAGAnything",
    "RAGAnythingConfig",
    "MineruParser",
    "DoclingParser",
    "PaddleOCRParser",
    "get_parser",
]
