# pdf-generator-slack-slash-command
a simple slack slash command to generate pdf from url.

Prerequirement:

1 Nodejs 6.0 or above

2 Chrome/Chromium 59 or higher

`Note`:(cite:https://github.com/westy92/html-pdf-chrome)

It is strongly recommended that you keep Chrome running side-by-side with Node.js. There is significant overhead starting up Chrome for each PDF generation which can be easily avoided.

It's suggested to use pm2 to ensure Chrome continues to run. If it crashes, it will restart automatically.

As of this writing, headless Chrome uses about 65mb of RAM while idle.

# install pm2 globally
npm install -g pm2
# start Chrome and be sure to specify a port to use in the html-pdf-chrome options.
pm2 start google-chrome \
  --interpreter none \
  -- \
  --headless \
  --disable-gpu \
  --disable-translate \
  --disable-extensions \
  --disable-background-networking \
  --safebrowsing-disable-auto-update \
  --disable-sync \
  --metrics-recording-only \
  --disable-default-apps \
  --no-first-run \
  --mute-audio \
  --hide-scrollbars \
  --remote-debugging-port=<port goes here>
# run your Node.js app.


Usage:
1. git clone the repo
2. npm install the dependence
3. setup an slash command. For more detail: https://api.slack.com/slash-commands 
   and install the slash command into your team.
4. use your token, verify token to substitue index.js file related variables
5. run the app: node index.js
6. in slack channel, type command: /pdf url pdf-name. etc: /pdf https://api.slack.com/slash-commands slash.pdf
