@echo off
D:\zprogram\cloc\cloc.exe --fullpath --not-match-d="(node_modules|dist|components|lib|static|uni_modules|uniCloud-aliyun|unpackage)" --not-match-f="(yarn\.lock|package\.json|package\-lock\.json)"  .
D:\zprogram\cloc\cloc.exe --fullpath --not-match-d="(node_modules|dist|components|lib|static|uni_modules|uniCloud-aliyun|unpackage)" --not-match-f="(yarn\.lock|package\.json|package\-lock\.json)"  ../health_keeper
pause