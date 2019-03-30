#!/bin/bash
cat openlocationcode.js olc-osm.js > bookmarklet.source.js
echo -n "javascript:" > bookmarklet.txt ; hjsmin bookmarklet.source.js >> bookmarklet.txt
