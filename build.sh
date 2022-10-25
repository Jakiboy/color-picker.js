#!/bin/bash

if ! uglifyjs -v uglifyjs &> /dev/null
then
    npm install uglify-js -g
fi

if ! uglifycss --version uglifycss &> /dev/null
then
    npm install uglifycss -g
fi

uglifycss "src/color-picker.css" --output "dist/color-picker.min.css"
uglifycss "src/color-picker.dark.css" --output "dist/color-picker.dark.min.css"
sleep 2
clear

uglifyjs "src/color-picker.js" -c -m --output "dist/color-picker.min.js"
sleep 2
clear
