import typer
import scan

app = typer.Typer()
app.add_typer(scan.app, name="scan")
if __name__ == "__main__":
    app()