#!/bin/sh
python translator/main.py & 
cd queue-listener && npm run start