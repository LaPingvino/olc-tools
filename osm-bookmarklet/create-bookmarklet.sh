#!/bin/bash
sed 's@//e@@' openlocationcode.js > encode.js
sed 's@//d@@' openlocationcode.js > decode.js
cat decode.js olc-osm.js > bookmarklet.source.js
cat decode.js plus.codes.js > bookmarklet-convert.source.js
cat encode.js osm-plus.js > bookmarklet-back.source.js
echo -n "javascript:" > bookmarklet.txt ; hjsmin bookmarklet.source.js >> bookmarklet.txt
echo -n "javascript:" > bookmarklet-convert.txt ; hjsmin bookmarklet-convert.source.js >> bookmarklet-convert.txt
echo -n "javascript:" > bookmarklet-back.txt ; hjsmin bookmarklet-back.source.js >> bookmarklet-back.txt
