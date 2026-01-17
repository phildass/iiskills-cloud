name: Deploy All Apps

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Deploy all apps via SSH
        env:
          SERVER_IP: ${{ secrets.SERVER_IP }}
          SERVER_USER: ${{ secrets.SERVER_USER }}
        run: |
          ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP '
            cd /root/iiskills-cloud && \
            git pull && \
            chmod +x deploy-all.sh && \
            ./deploy-all.sh
          '