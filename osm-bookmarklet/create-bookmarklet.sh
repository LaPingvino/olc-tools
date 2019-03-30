#!/bin/bash
cat openlocationcode.js olc-osm.js > bookmarklet.source.js
cat openlocationcode.js plus.codes.js > bookmarklet-convert.source.js
echo -n "javascript:" > bookmarklet.txt ; hjsmin bookmarklet.source.js >> bookmarklet.txt
echo -n "javascript:" > bookmarklet-convert.txt ; hjsmin bookmarklet-convert.source.js >> bookmarklet-convert.txt
