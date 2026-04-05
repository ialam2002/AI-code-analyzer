import subprocess
import tempfile
import os
import ast
from typing import Dict, List
from abc import ABC, abstractmethod


class BaseAnalyzer(ABC):
    """Base class for code analyzers"""
    
    @abstractmethod
    def analyze(self, filename: str, content: str) -> List[str]:
        """Analyze code and return list of issues"""
        pass


class PyflakesAnalyzer(BaseAnalyzer):
    """Pyflakes static analyzer"""
    
    def analyze(self, filename: str, content: str) -> List[str]:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as tmp:
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            completed = subprocess.run(
                ["pyflakes", tmp_path], capture_output=True, text=True
            )
            output = completed.stdout.strip()
            if output:
                lines = [line.replace(tmp_path, filename) for line in output.splitlines()]
            else:
                lines = []
            
            err = completed.stderr.strip()
            if err:
                lines.extend([f"[stderr] {l}" for l in err.splitlines()])
            
            return lines
        finally:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


class PylintAnalyzer(BaseAnalyzer):
    """Pylint static analyzer"""
    
    def analyze(self, filename: str, content: str) -> List[str]:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as tmp:
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            # Run pylint with minimal output
            completed = subprocess.run(
                ["pylint", tmp_path, "--disable=all", "--enable=E,F", "-f", "parseable"],
                capture_output=True, text=True, timeout=10
            )
            
            output = completed.stdout.strip()
            if output:
                lines = [line.replace(tmp_path, filename) for line in output.splitlines()]
            else:
                lines = []
            
            return lines
        except (FileNotFoundError, subprocess.TimeoutExpired):
            # Pylint might not be installed, return empty list
            return []
        finally:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


class ASTAnalyzer(BaseAnalyzer):
    """Custom AST-based analyzer for code complexity and patterns"""
    
    def analyze(self, filename: str, content: str) -> List[str]:
        issues = []
        
        try:
            tree = ast.parse(content)
            
            # Check for long functions
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    lines = node.end_lineno - node.lineno + 1
                    if lines > 50:
                        issues.append(f"{filename}:{node.lineno}: Function '{node.name}' is very long ({lines} lines)")
                
                # Check for deeply nested code
                if isinstance(node, ast.FunctionDef):
                    max_depth = self._get_max_nesting_depth(node)
                    if max_depth > 4:
                        issues.append(f"{filename}:{node.lineno}: Function '{node.name}' has high nesting depth ({max_depth})")
            
            # Check for missing docstrings in public functions
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef) and not node.name.startswith("_"):
                    if not ast.get_docstring(node):
                        issues.append(f"{filename}:{node.lineno}: Public function '{node.name}' has no docstring")
        
        except SyntaxError as e:
            issues.append(f"{filename}:{e.lineno}: {e.msg}")
        
        return issues
    
    def _get_max_nesting_depth(self, node, depth=0):
        """Get maximum nesting depth in a node"""
        max_depth = depth
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.If, ast.For, ast.While, ast.With, ast.Try)):
                child_depth = self._get_max_nesting_depth(child, depth + 1)
                max_depth = max(max_depth, child_depth)
        return max_depth


def analyze_files(files: Dict[str, str], engines: List[str] = None) -> Dict[str, List[str]]:
    """Run multiple analysis engines on provided files
    
    Args:
        files: mapping of filename -> file contents
        engines: list of engines to use (pyflakes, pylint, ast). Default: all
    
    Returns:
        Dict mapping filename -> list of issues found
    """
    if engines is None:
        engines = ["pyflakes", "ast"]
    
    reports: Dict[str, List[str]] = {}
    
    analyzers = {
        "pyflakes": PyflakesAnalyzer(),
        "pylint": PylintAnalyzer(),
        "ast": ASTAnalyzer(),
    }
    
    for logical_name, content in files.items():
        all_issues = []
        
        for engine in engines:
            if engine in analyzers:
                try:
                    issues = analyzers[engine].analyze(logical_name, content)
                    all_issues.extend(issues)
                except Exception as e:
                    all_issues.append(f"[{engine} error] {str(e)}")
        
        # Deduplicate while preserving order
        seen = set()
        unique_issues = []
        for issue in all_issues:
            if issue not in seen:
                seen.add(issue)
                unique_issues.append(issue)
        
        reports[logical_name] = unique_issues
    
    return reports

