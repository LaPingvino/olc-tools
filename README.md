olc-tools
=========

A repository with various tools to work with Open Location Codes (also known as Plus-codes). Read more at <https://plus.codes>.

## Purpose of this repository

The purpose of this repository is to provide a proof of concept for things you can do with plus codes, and work around lacking support where it matters most. Don't expect any kind of long term support for things found here, rather let them inspire you to build something great. Some projects here might over time get their own repositories, especially if someone more responsible long-term for supporting them can be found. I'm an inventor/initiator, I'm terrible at long term stuff. Do feel free to participate, correct, clone and create based on anything found here; the goal is to make the world a better place to live, not to have any kind of ownership of anything here.

## OSM Bookmarklet

**Purpose: hack support for plus codes into your browser on OSM while there is no official support. Mobile apps like OSMAnd DO have support.**

Copy the contents of bookmarklet.txt to a bookmark in your browser to enable searching for OLC on OpenStreetMap. The provided files are a smaller version of the official JS API from Google, a little bit of JS to perform the actual search and a minified version, together with a short shell script to recreate these files. For recreating these files you need to have hjsmin installed. The bookmarklet-convert.txt reads a Plus-code from the current link and searches it on OSM. The purpose of this part of the repository is to provide tools to work with OSM as much as possible instead of relying on proprietary tools to use the free OLC standard for easy navigation, as efforts to integrate OLC support officially (https://github.com/openstreetmap/openstreetmap-website/issues/1807) don't seem to go anywhere because the standard is misunderstood as a commercial fancy.

## WhenWhere (and paper map project)

**Purpose: show how plus codes can work without internet access or even any local mapping. For using OLC in Africa, e.g. navigating when on roaming and navigating without visuals for e.g. blind usage.**

A simple PWA that runs over IPFS and can be installed for completely offline navigation using OLC. Try it out at [whenwhere.cf](https://whenwhere.cf)

## OLN

**Purpose: use OLC as a rudimentary geohash and tag system to enable independent location based ad-hoc "services".**

OLN is short for Open Location Network or Open Listening Network. It's a project to create a worldwide community overlay using OLC as a tagging and indexing tool together with hashtags to give people access to information that is relevant to them.
