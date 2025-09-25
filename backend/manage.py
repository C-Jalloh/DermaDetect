#!/usr/bin/env python
from __future__ import annotations

import click

from app import create_app, db

app = create_app()


@app.shell_context_processor
def make_shell_context():
    from app import models

    return {"db": db, **models.__dict__}


@click.group()
def cli():
    """Management commands."""


@cli.command()
def run():
    """Run the Flask development server."""
    app.run(host='0.0.0.0', port=5000)


@cli.command("create-db")
def create_db():
    """Create database tables."""
    with app.app_context():
        db.create_all()
        click.echo("Database tables created.")


if __name__ == "__main__":
    cli()
