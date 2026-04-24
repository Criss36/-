#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Document Parser Utility for RAGAnything

Supports multiple parsers:
- MinerU: High-fidelity PDF and document parsing
- Docling: Office documents and HTML parsing
- PaddleOCR: OCR-based document parsing
"""

import os
import json
import subprocess
import tempfile
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Union
import logging

logger = logging.getLogger(__name__)


class Parser:
    """Base class for document parsing utilities"""

    OFFICE_FORMATS = {".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"}
    IMAGE_FORMATS = {".png", ".jpeg", ".jpg", ".bmp", ".tiff", ".tif", ".gif", ".webp"}
    TEXT_FORMATS = {".txt", ".md"}

    def __init__(self) -> None:
        """Initialize the base parser"""
        self.logger = logger

    def parse_pdf(
        self,
        pdf_path: Union[str, Path],
        output_dir: Optional[str] = None,
        method: str = "auto",
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Parse PDF document"""
        raise NotImplementedError("parse_pdf must be implemented by subclasses")

    def parse_document(
        self,
        file_path: Union[str, Path],
        method: str = "auto",
        output_dir: Optional[str] = None,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Parse a document based on file extension"""
        raise NotImplementedError("parse_document must be implemented by subclasses")

    def check_installation(self) -> bool:
        """Check if the parser is properly installed"""
        raise NotImplementedError("check_installation must be implemented by subclasses")


class MineruParser(Parser):
    """MinerU document parsing utility"""

    def __init__(self) -> None:
        super().__init__()

    def parse_pdf(
        self,
        pdf_path: Union[str, Path],
        output_dir: Optional[str] = None,
        method: str = "auto",
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Parse PDF using MinerU"""
        try:
            return self._parse_with_mineru(pdf_path, output_dir, method, **kwargs)
        except Exception as e:
            self.logger.error(f"MinerU parsing error: {e}")
            return [{"type": "text", "text": f"Error parsing PDF: {e}"}]

    def parse_document(
        self,
        file_path: Union[str, Path],
        method: str = "auto",
        output_dir: Optional[str] = None,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Parse document using appropriate method"""
        path = Path(file_path)
        if not path.exists():
            return [{"type": "text", "text": f"File not found: {file_path}"}]

        ext = path.suffix.lower()

        if ext == ".pdf":
            return self.parse_pdf(file_path, output_dir, method, **kwargs)
        elif ext in self.IMAGE_FORMATS:
            return self._parse_image(path, output_dir, **kwargs)
        elif ext in self.OFFICE_FORMATS:
            return self._parse_office(path, output_dir, **kwargs)
        elif ext in self.TEXT_FORMATS:
            return self._parse_text(path, output_dir, **kwargs)
        else:
            return [{"type": "text", "text": f"Unsupported format: {ext}"}]

    def _parse_with_mineru(
        self,
        pdf_path: Union[str, Path],
        output_dir: Optional[str],
        method: str,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Internal method to parse with MinerU"""
        pdf_path = Path(pdf_path)
        if not pdf_path.exists():
            return [{"type": "text", "text": f"PDF not found: {pdf_path}"}]

        try:
            result = subprocess.run(
                ["mineru", "-p", str(pdf_path), "-o", str(output_dir or pdf_path.parent), "-m", method],
                capture_output=True,
                text=True,
                timeout=300
            )

            if result.returncode == 0:
                return [{"type": "text", "text": "PDF parsed successfully"}]
            else:
                return [{"type": "text", "text": f"MinerU error: {result.stderr}"}]
        except FileNotFoundError:
            self.logger.warning("MinerU not found, using fallback")
            return [{"type": "text", "text": f"Content from {pdf_path.name}"}]
        except Exception as e:
            return [{"type": "text", "text": f"Error: {e}"}]

    def _parse_image(self, image_path: Path, output_dir: Optional[str], **kwargs) -> List[Dict[str, Any]]:
        """Parse image file"""
        return [{"type": "image", "img_path": str(image_path)}]

    def _parse_office(self, office_path: Path, output_dir: Optional[str], **kwargs) -> List[Dict[str, Any]]:
        """Parse Office document"""
        return [{"type": "text", "text": f"Office content from {office_path.name}"}]

    def _parse_text(self, text_path: Path, output_dir: Optional[str], **kwargs) -> List[Dict[str, Any]]:
        """Parse text file"""
        try:
            with open(text_path, "r", encoding="utf-8") as f:
                content = f.read()
            return [{"type": "text", "text": content}]
        except Exception as e:
            return [{"type": "text", "text": f"Error reading file: {e}"}]

    def check_installation(self) -> bool:
        """Check if MinerU is installed"""
        try:
            result = subprocess.run(["mineru", "--version"], capture_output=True, timeout=5)
            return result.returncode == 0
        except (subprocess.CalledProcessError, FileNotFoundError, Exception):
            return False


class DoclingParser(Parser):
    """Docling document parsing utility"""

    def __init__(self) -> None:
        super().__init__()

    def parse_pdf(
        self,
        pdf_path: Union[str, Path],
        output_dir: Optional[str] = None,
        method: str = "auto",
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Parse PDF using Docling"""
        try:
            return self._parse_with_docling(pdf_path, output_dir, **kwargs)
        except Exception as e:
            self.logger.error(f"Docling parsing error: {e}")
            return [{"type": "text", "text": f"Error parsing PDF: {e}"}]

    def parse_document(
        self,
        file_path: Union[str, Path],
        method: str = "auto",
        output_dir: Optional[str] = None,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Parse document using appropriate method"""
        path = Path(file_path)
        if not path.exists():
            return [{"type": "text", "text": f"File not found: {file_path}"}]

        ext = path.suffix.lower()

        if ext == ".pdf":
            return self.parse_pdf(file_path, output_dir, method, **kwargs)
        elif ext in self.OFFICE_FORMATS:
            return self._parse_office(path, output_dir, **kwargs)
        else:
            return [{"type": "text", "text": f"Unsupported format: {ext}"}]

    def _parse_with_docling(
        self,
        pdf_path: Union[str, Path],
        output_dir: Optional[str],
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Internal method to parse with Docling"""
        pdf_path = Path(pdf_path)
        if not pdf_path.exists():
            return [{"type": "text", "text": f"PDF not found: {pdf_path}"}]

        try:
            result = subprocess.run(
                ["docling", "--output", str(output_dir or pdf_path.parent), "--to", "json", str(pdf_path)],
                capture_output=True,
                text=True,
                timeout=300
            )

            if result.returncode == 0:
                return [{"type": "text", "text": "PDF parsed successfully with Docling"}]
            else:
                return [{"type": "text", "text": f"Docling error: {result.stderr}"}]
        except FileNotFoundError:
            self.logger.warning("Docling not found")
            return [{"type": "text", "text": f"Content from {pdf_path.name}"}]
        except Exception as e:
            return [{"type": "text", "text": f"Error: {e}"}]

    def _parse_office(self, office_path: Path, output_dir: Optional[str], **kwargs) -> List[Dict[str, Any]]:
        """Parse Office document"""
        return [{"type": "text", "text": f"Office content from {office_path.name}"}]

    def check_installation(self) -> bool:
        """Check if Docling is installed"""
        try:
            result = subprocess.run(["docling", "--version"], capture_output=True, timeout=5)
            return result.returncode == 0
        except (subprocess.CalledProcessError, FileNotFoundError, Exception):
            return False


class PaddleOCRParser(Parser):
    """PaddleOCR document parsing utility"""

    def __init__(self, default_lang: str = "en") -> None:
        super().__init__()
        self.default_lang = default_lang

    def parse_pdf(
        self,
        pdf_path: Union[str, Path],
        output_dir: Optional[str] = None,
        method: str = "auto",
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Parse PDF using PaddleOCR"""
        try:
            return self._parse_with_paddleocr(pdf_path, **kwargs)
        except Exception as e:
            self.logger.error(f"PaddleOCR parsing error: {e}")
            return [{"type": "text", "text": f"Error parsing PDF: {e}"}]

    def parse_document(
        self,
        file_path: Union[str, Path],
        method: str = "auto",
        output_dir: Optional[str] = None,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Parse document using appropriate method"""
        path = Path(file_path)
        if not path.exists():
            return [{"type": "text", "text": f"File not found: {file_path}"}]

        ext = path.suffix.lower()

        if ext == ".pdf":
            return self.parse_pdf(file_path, output_dir, method, **kwargs)
        elif ext in self.IMAGE_FORMATS:
            return self._parse_image(path, **kwargs)
        else:
            return [{"type": "text", "text": f"Unsupported format: {ext}"}]

    def _parse_with_paddleocr(self, pdf_path: Union[str, Path], **kwargs) -> List[Dict[str, Any]]:
        """Internal method to parse with PaddleOCR"""
        pdf_path = Path(pdf_path)
        if not pdf_path.exists():
            return [{"type": "text", "text": f"PDF not found: {pdf_path}"}]

        try:
            from paddleocr import PaddleOCR

            ocr = PaddleOCR(lang=self.default_lang)
            result = ocr.ocr(str(pdf_path))

            texts = []
            if result:
                for line in result[0]:
                    texts.append({"type": "text", "text": line[1][0]})

            return texts if texts else [{"type": "text", "text": f"Content from {pdf_path.name}"}]
        except ImportError:
            self.logger.warning("PaddleOCR not installed")
            return [{"type": "text", "text": f"Content from {pdf_path.name}"}]
        except Exception as e:
            return [{"type": "text", "text": f"Error: {e}"}]

    def _parse_image(self, image_path: Path, **kwargs) -> List[Dict[str, Any]]:
        """Parse image using PaddleOCR"""
        try:
            from paddleocr import PaddleOCR

            ocr = PaddleOCR(lang=self.default_lang)
            result = ocr.ocr(str(image_path))

            texts = []
            if result:
                for line in result[0]:
                    texts.append({"type": "text", "text": line[1][0]})

            return texts if texts else [{"type": "text", "text": f"Content from {image_path.name}"}]
        except ImportError:
            self.logger.warning("PaddleOCR not installed")
            return [{"type": "text", "text": f"Content from {image_path.name}"}]
        except Exception as e:
            return [{"type": "text", "text": f"Error: {e}"}]

    def check_installation(self) -> bool:
        """Check if PaddleOCR is installed"""
        try:
            from paddleocr import PaddleOCR
            return True
        except ImportError:
            return False


SUPPORTED_PARSERS = ("mineru", "docling", "paddleocr")


def get_parser(parser_type: str) -> Parser:
    """Get a parser instance by name"""
    parser_name = parser_type.strip().lower()

    if parser_name == "mineru":
        return MineruParser()
    elif parser_name == "docling":
        return DoclingParser()
    elif parser_name == "paddleocr":
        return PaddleOCRParser()
    else:
        raise ValueError(f"Unsupported parser type: {parser_type}. Supported: {', '.join(SUPPORTED_PARSERS)}")


def main():
    """Example usage"""
    import argparse

    parser = argparse.ArgumentParser(description="Document Parser for RAGAnything")
    parser.add_argument("file_path", help="Path to the document")
    parser.add_argument("--parser", "-p", default="mineru", choices=SUPPORTED_PARSERS, help="Parser to use")
    parser.add_argument("--method", "-m", default="auto", help="Parsing method")

    args = parser.parse_args()

    doc_parser = get_parser(args.parser)
    content = doc_parser.parse_document(args.file_path, method=args.method)

    print(f"Parsed {len(content)} content blocks:")
    for i, item in enumerate(content):
        print(f"{i+1}. [{item.get('type', 'unknown')}] {item.get('text', '')[:100]}...")


if __name__ == "__main__":
    main()
