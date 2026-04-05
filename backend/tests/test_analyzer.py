# Ensure the repository root (backend/) is on sys.path so `app` can be imported when tests run
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.analyzer import analyze_files, PyflakesAnalyzer, ASTAnalyzer


def test_analyze_files_reports_unused_import():
    """Test that analyze_files detects unused imports"""
    files = {
        "example.py": "print('hello')\n",
        "unused.py": "import sys\n\n# no use of sys here\n",
    }

    reports = analyze_files(files)

    # example.py should be clean
    assert "example.py" in reports
    assert reports["example.py"] == []

    # unused.py should contain a pyflakes message about unused import
    assert "unused.py" in reports
    msgs = reports["unused.py"]
    assert any("unused import" in m or "imported but unused" in m.lower() or "F401" in m for m in msgs)


class TestPyflakesAnalyzer:
    def test_undefined_name(self):
        """Test detection of undefined name"""
        analyzer = PyflakesAnalyzer()
        code = "print(undefined_var)"
        issues = analyzer.analyze("test.py", code)
        assert len(issues) > 0

    def test_syntax_error(self):
        """Test detection of syntax errors"""
        analyzer = PyflakesAnalyzer()
        code = "def func(\n  pass"
        issues = analyzer.analyze("test.py", code)
        # Might have syntax errors


class TestASTAnalyzer:
    def test_missing_docstring(self):
        """Test detection of missing docstrings"""
        analyzer = ASTAnalyzer()
        code = "def public_function():\n    pass"
        issues = analyzer.analyze("test.py", code)
        assert any("docstring" in issue for issue in issues)

    def test_function_with_docstring(self):
        """Test function with docstring is not flagged"""
        analyzer = ASTAnalyzer()
        code = 'def public_function():\n    """This is documented."""\n    pass'
        issues = analyzer.analyze("test.py", code)
        assert not any("docstring" in issue for issue in issues)

    def test_private_function_no_docstring(self):
        """Test private functions don't require docstrings"""
        analyzer = ASTAnalyzer()
        code = "def _private_function():\n    pass"
        issues = analyzer.analyze("test.py", code)
        assert not any("docstring" in issue for issue in issues)


class TestAnalyzeFiles:
    def test_multiple_files(self):
        """Test analyzing multiple files"""
        files = {
            "file1.py": "import unused\nprint('hello')",
            "file2.py": "print(1 + 2)"
        }
        reports = analyze_files(files)
        assert "file1.py" in reports
        assert "file2.py" in reports

    def test_specific_engine(self):
        """Test using specific analysis engine"""
        files = {"test.py": "def func():\n    pass"}
        reports = analyze_files(files, engines=["ast"])
        assert "test.py" in reports
