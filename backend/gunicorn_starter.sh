#!/bin/sh
# Here we will be spinning up multiple threads with multiple worker processess(-w) and perform a binding.
gunicorn flask_run:"app" --log-level=debug -w 1 --threads 60 -b 0.0.0.0:8000
