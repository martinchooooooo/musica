
# Musica 

A set of node.js utilities that allows you to get mp3 links for songs (using youtube-mp3.org as the source).
Read `test/linkfinder.js` and `test/downloader.js` for sample implementations that download songs listed in `data/suggestions.txt`.

Also includes a suggester that uses last.fm to recommend similar music.
Read `test/suggester.js` for a sample implementation that suggests songs based on the list in `data/songs.txt`.

# Prerequisites 
You'll need [node.js](http://nodejs.org) as well as the following modules:

* request
* jsdom
* underscore

# API Documentation
Have a look inside the `docs` folder for some annotated source documentation (generated using [docco](http://jashkenas.github.com/docco/))

# Try it out 
Just clone this repository into a folder, and run the following:

	nodeunit test/linkfinder.js

This will find an mp3 link for the song in `data/suggestions.txt`. Replace the song with your favourite one and run it again to see if it comes up with another link.
By default, the sample downloader will save music in `$HOME/Music/download`. Create this directory if it doesn't already exist. Then run:

	nodeunit test/downloader.js

After the script completes, you'll see the mp3 of the song in the download folder. 
