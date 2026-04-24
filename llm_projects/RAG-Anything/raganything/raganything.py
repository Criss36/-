#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RAGAnything - Multimodal Document Processing RAG Framework

This module provides comprehensive multimodal document processing capabilities
including PDF parsing, image processing, table extraction, and equation processing.
"""

import os
import asyncio
import logging
from typing import Dict, Any, List, Optional, Callable
from dataclasses import dataclass, field
from pathlib import Path
from dotenv import load_dotenv

logger = logging.getLogger(__name__)


@dataclass
class RAGAnythingConfig:
    """Configuration class for RAGAnything"""

    working_dir: str = "./rag_storage"
    parser: str = "mineru"
    parse_method: str = "auto"
    enable_image_processing: bool = True
    enable_table_processing: bool = True
    enable_equation_processing: bool = True
    max_concurrent_files: int = 1
    context_window: int = 1
    max_context_tokens: int = 2000


class RAGAnything:
    """
    Multimodal Document Processing Pipeline

    Complete document parsing and insertion pipeline that integrates:
    1. Document parsing (using configurable parsers like MinerU, Docling)
    2. Multimodal content processing (images, tables, equations)
    3. LightRAG integration for intelligent retrieval
    """

    def __init__(
        self,
        llm_model_func: Optional[Callable] = None,
        embedding_func: Optional[Callable] = None,
        config: Optional[RAGAnythingConfig] = None,
        **kwargs
    ):
        """Initialize RAGAnything

        Args:
            llm_model_func: LLM model function for text analysis
            embedding_func: Embedding function for text vectorization
            config: Configuration object
            **kwargs: Additional parameters
        """
        self.config = config or RAGAnythingConfig()
        self.llm_model_func = llm_model_func
        self.embedding_func = embedding_func
        self.lightrag = None
        self.modal_processors = {}
        self.working_dir = self.config.working_dir

        if not os.path.exists(self.working_dir):
            os.makedirs(self.working_dir)

        logger.info("RAGAnything initialized")
        logger.info(f"  Working directory: {self.config.working_dir}")
        logger.info(f"  Parser: {self.config.parser}")
        logger.info(f"  Parse method: {self.config.parse_method}")

    async def initialize(self):
        """Initialize LightRAG and processors"""
        if self.llm_model_func is None or self.embedding_func is None:
            logger.warning("LLM model function or embedding function not provided")
            return

        try:
            from lightrag import LightRAG

            self.lightrag = LightRAG(
                working_dir=self.working_dir,
                llm_model_func=self.llm_model_func,
                embedding_func=self.embedding_func
            )
            await self.lightrag.initialize_storages()

            self._initialize_processors()
            logger.info("LightRAG and processors initialized successfully")
        except ImportError as e:
            logger.error(f"Failed to import LightRAG: {e}")
        except Exception as e:
            logger.error(f"Failed to initialize: {e}")

    def _initialize_processors(self):
        """Initialize multimodal processors"""
        if self.config.enable_image_processing:
            self.modal_processors["image"] = ImageModalProcessor(
                self.lightrag,
                self.llm_model_func
            )

        if self.config.enable_table_processing:
            self.modal_processors["table"] = TableModalProcessor(
                self.lightrag,
                self.llm_model_func
            )

        if self.config.enable_equation_processing:
            self.modal_processors["equation"] = EquationModalProcessor(
                self.lightrag,
                self.llm_model_func
            )

        logger.info(f"Initialized processors: {list(self.modal_processors.keys())}")

    async def process_file(
        self,
        file_path: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Process a single document file

        Args:
            file_path: Path to the document file
            **kwargs: Additional parameters

        Returns:
            Processing results
        """
        file_path = Path(file_path)
        if not file_path.exists():
            return {"success": False, "error": f"File not found: {file_path}"}

        try:
            parser = self._get_parser()
            content_list = parser.parse_document(
                str(file_path),
                method=self.config.parse_method,
                **kwargs
            )

            results = {
                "success": True,
                "file_path": str(file_path),
                "content_count": len(content_list),
                "content_types": self._count_content_types(content_list)
            }

            if self.lightrag and self.modal_processors:
                await self._process_multimodal_content(content_list)

            return results

        except Exception as e:
            logger.error(f"Error processing file: {e}")
            return {"success": False, "error": str(e)}

    async def process_folder(
        self,
        folder_path: str,
        recursive: bool = True,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Process all documents in a folder

        Args:
            folder_path: Path to the folder
            recursive: Whether to process subfolders
            **kwargs: Additional parameters

        Returns:
            List of processing results
        """
        folder = Path(folder_path)
        if not folder.exists():
            return [{"success": False, "error": f"Folder not found: {folder_path}"}]

        files = []
        if recursive:
            for ext in [".pdf", ".docx", ".pptx", ".xlsx", ".txt", ".md"]:
                files.extend(folder.rglob(f"*{ext}"))
        else:
            for ext in [".pdf", ".docx", ".pptx", ".xlsx", ".txt", ".md"]:
                files.extend(folder.glob(f"*{ext}"))

        results = []
        for file_path in files:
            result = await self.process_file(str(file_path), **kwargs)
            results.append(result)

        return results

    async def query(
        self,
        query_text: str,
        mode: str = "mix",
        **kwargs
    ) -> Any:
        """Query the RAG system

        Args:
            query_text: Query text
            mode: Query mode (hybrid, local, global, mix)
            **kwargs: Additional parameters

        Returns:
            Query results
        """
        if self.lightrag is None:
            return {"error": "RAG not initialized"}

        try:
            if mode == "hybrid":
                return await self.lightrag.ahybrid_query(query_text, **kwargs)
            elif mode == "local":
                return await self.lightrag.alocal_query(query_text, **kwargs)
            elif mode == "global":
                return await self.lightrag.aglobal_query(query_text, **kwargs)
            else:
                return await self.lightrag.amix_query(query_text, **kwargs)
        except Exception as e:
            logger.error(f"Error querying: {e}")
            return {"error": str(e)}

    def _get_parser(self):
        """Get document parser based on configuration"""
        parser_name = self.config.parser.lower()

        if parser_name == "mineru":
            return MineruParserWrapper()
        elif parser_name == "docling":
            return DoclingParserWrapper()
        elif parser_name == "paddleocr":
            return PaddleOCRParserWrapper()
        else:
            return MineruParserWrapper()

    def _count_content_types(self, content_list: List[Dict]) -> Dict[str, int]:
        """Count content types in parsed content"""
        counts = {}
        for item in content_list:
            content_type = item.get("type", "unknown")
            counts[content_type] = counts.get(content_type, 0) + 1
        return counts

    async def _process_multimodal_content(self, content_list: List[Dict]):
        """Process multimodal content (images, tables, equations)"""
        for item in content_list:
            content_type = item.get("type")

            if content_type == "image" and "image" in self.modal_processors:
                processor = self.modal_processors["image"]
                await processor.process(item)

            elif content_type == "table" and "table" in self.modal_processors:
                processor = self.modal_processors["table"]
                await processor.process(item)

            elif content_type == "equation" and "equation" in self.modal_processors:
                processor = self.modal_processors["equation"]
                await processor.process(item)

    async def finalize(self):
        """Finalize and cleanup resources"""
        if self.lightrag:
            await self.lightrag.finalize_storages()


class MineruParserWrapper:
    """Wrapper for MinerU parser"""

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def parse_document(self, file_path: str, method: str = "auto", **kwargs) -> List[Dict]:
        """Parse document using MinerU"""
        try:
            from raganything.parser import MineruParser

            parser = MineruParser()
            return parser.parse_document(file_path, method=method, **kwargs)
        except ImportError:
            self.logger.warning("MinerU not installed, using fallback parser")
            return self._fallback_parse(file_path)
        except Exception as e:
            self.logger.error(f"MinerU parsing error: {e}")
            return self._fallback_parse(file_path)

    def _fallback_parse(self, file_path: str) -> List[Dict]:
        """Fallback parsing for when MinerU is not available"""
        path = Path(file_path)
        ext = path.suffix.lower()

        if ext == ".pdf":
            return [{"type": "text", "text": f"PDF content from {path.name}"}]
        elif ext in [".docx", ".doc"]:
            return [{"type": "text", "text": f"DOC content from {path.name}"}]
        elif ext in [".pptx", ".ppt"]:
            return [{"type": "text", "text": f"PPT content from {path.name}"}]
        elif ext in [".xlsx", ".xls"]:
            return [{"type": "text", "text": f"Excel content from {path.name}"}]
        else:
            return [{"type": "text", "text": f"Content from {path.name}"}]


class DoclingParserWrapper:
    """Wrapper for Docling parser"""

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def parse_document(self, file_path: str, method: str = "auto", **kwargs) -> List[Dict]:
        """Parse document using Docling"""
        try:
            from raganything.parser import DoclingParser

            parser = DoclingParser()
            return parser.parse_document(file_path, method=method, **kwargs)
        except ImportError:
            self.logger.warning("Docling not installed")
            return [{"type": "text", "text": f"Content from {file_path}"}]
        except Exception as e:
            self.logger.error(f"Docling parsing error: {e}")
            return [{"type": "text", "text": f"Content from {file_path}"}]


class PaddleOCRParserWrapper:
    """Wrapper for PaddleOCR parser"""

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def parse_document(self, file_path: str, method: str = "auto", **kwargs) -> List[Dict]:
        """Parse document using PaddleOCR"""
        try:
            from raganything.parser import PaddleOCRParser

            parser = PaddleOCRParser()
            return parser.parse_document(file_path, method=method, **kwargs)
        except ImportError:
            self.logger.warning("PaddleOCR not installed")
            return [{"type": "text", "text": f"Content from {file_path}"}]
        except Exception as e:
            self.logger.error(f"PaddleOCR parsing error: {e}")
            return [{"type": "text", "text": f"Content from {file_path}"}]


class ImageModalProcessor:
    """Image content processor"""

    def __init__(self, lightrag, llm_model_func):
        self.lightrag = lightrag
        self.llm_model_func = llm_model_func

    async def process(self, item: Dict[str, Any]):
        """Process image content"""
        img_path = item.get("img_path", "")
        if not img_path or not Path(img_path).exists():
            return

        try:
            if self.llm_model_func:
                caption = await self._generate_caption(img_path)
                if caption and self.lightrag:
                    await self.lightrag.ainsert(caption)
        except Exception as e:
            logging.error(f"Error processing image: {e}")

    async def _generate_caption(self, img_path: str) -> str:
        """Generate caption for image using LLM"""
        if self.llm_model_func is None:
            return f"Image: {img_path}"

        try:
            prompt = f"Please describe this image: {img_path}"
            response = await self.llm_model_func(prompt)
            return response
        except Exception:
            return f"Image: {img_path}"


class TableModalProcessor:
    """Table content processor"""

    def __init__(self, lightrag, llm_model_func):
        self.lightrag = lightrag
        self.llm_model_func = llm_model_func

    async def process(self, item: Dict[str, Any]):
        """Process table content"""
        table_body = item.get("table_body", [])
        if not table_body:
            return

        try:
            table_text = self._format_table(table_body)
            if table_text and self.lightrag:
                await self.lightrag.ainsert(table_text)
        except Exception as e:
            logging.error(f"Error processing table: {e}")

    def _format_table(self, table_body: Any) -> str:
        """Format table content as text"""
        if isinstance(table_body, list):
            return "\n".join([str(row) for row in table_body])
        return str(table_body)


class EquationModalProcessor:
    """Equation content processor"""

    def __init__(self, lightrag, llm_model_func):
        self.lightrag = lightrag
        self.llm_model_func = llm_model_func

    async def process(self, item: Dict[str, Any]):
        """Process equation content"""
        equation_text = item.get("text", "")
        if not equation_text:
            return

        try:
            if self.lightrag:
                await self.lightrag.ainsert(f"Equation: {equation_text}")
        except Exception as e:
            logging.error(f"Error processing equation: {e}")


async def main():
    """Example usage"""
    # Configuration
    config = RAGAnythingConfig(
        working_dir="./rag_storage",
        parser="mineru",
        enable_image_processing=True,
        enable_table_processing=True,
        enable_equation_processing=True
    )

    # Initialize RAGAnything
    rag_anything = RAGAnything(config=config)

    # Example LLM and embedding functions
    async def example_llm(prompt):
        return "This is a simulated LLM response"

    def example_embedding(text):
        import numpy as np
        return np.random.rand(768)

    rag_anything.llm_model_func = example_llm
    rag_anything.embedding_func = example_embedding

    # Initialize
    await rag_anything.initialize()

    # Process a document
    # result = await rag_anything.process_file("document.pdf")
    # print(result)

    # Query
    # response = await rag_anything.query("What is the document about?")
    # print(response)

    # Finalize
    await rag_anything.finalize()


if __name__ == "__main__":
    asyncio.run(main())
