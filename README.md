# python-browser-console

Get an interactive python console to a live, running app easily.

## Installation

After cloning the repo, you will need to do the following to run the
application:

    $ sudo apt-get update
    $ sudo apt-get install python-virtualenv nodejs
    $ virtualenv env
    $ source env/bin/activate
    $ pip install -i requirements.txt
    $ sudo npm install -g browserify
    $ npm install
    $ browserify -t reactify -o static/app.js js/*.js
    $ python server.py

Then go to http://localhost:5000/

Whenever changes are made to the source javascript, you will need to
re-run `browserify -t reactify -o static/app.js js/*.js` and reload
your web page.

## Preview

Here's a screenshot of the end result:

![Screenshot](http://i.imgur.com/10WjB57.png)
