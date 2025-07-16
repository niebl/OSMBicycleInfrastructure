#!/bin/bash
mkdir out
python3 serve.py & node bicycleinfrastructure.js && fg
