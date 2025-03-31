#!/bin/bash
mkdir out
./serve.py & node bicycleinfrastructure.js && fg
