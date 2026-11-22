#!/bin/bash
# build.sh scenes.js out.html  — assembles the v2 engine + scene file
E=$(dirname "$0")/../engine
{ cat $E/pre.html; echo '<script>'; cat $E/land.js $E/head.js $E/people.js $E/body.js $E/chronicle.js "$1"; echo '</script></body></html>'; } > "$2"
