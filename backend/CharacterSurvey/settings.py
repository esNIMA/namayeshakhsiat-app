name: Deploy
to
VPS

on:
push:
branches: [main]
workflow_dispatch:

jobs:
deploy:
runs - on: ubuntu - latest

steps:
- name: Deploy
to
VPS
via
SSH
uses: appleboy / ssh - action @ v1
.0
.0
with:
    host: ${{secrets.VPS_HOST}}
    username: ${{secrets.VPS_USERNAME}}
    key: ${{secrets.VPS_SSH_KEY}}
    port: ${{secrets.VPS_PORT}}
    script: |
    # Navigate to project directory
    cd / var / www / namayeshakhsiat

    # Pull latest changes
    git
    pull
    origin
    main

    # Stop current containers
    docker - compose
    down

    # Rebuild and start containers
    docker - compose
    up - d - -build

    # Check if containers are running
    docker
    ps

    # Show logs for debugging
    docker - compose
    logs - -tail = 20
    backend