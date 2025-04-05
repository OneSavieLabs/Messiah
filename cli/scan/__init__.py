"""This module is a bridge of fetching posts from multiple platforms"""

import typer
from . import scan 
app = typer.Typer()

@app.callback(invoke_without_command=True)
def default(ctx: typer.Context):
    """
    This is a command line interface for scanning JS files from a specified domain.
    """
    if ctx.invoked_subcommand is None:
        user_domain = input('請輸入要下載 JS 檔案的網域 (例如 example.com): ')
        scan.scan(user_domain)