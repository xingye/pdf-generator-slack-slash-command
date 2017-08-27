const express = require('express');
const bodyParser = require('body-parser');
const htmlPdf = require('html-pdf-chrome');
const request = require('request');
const path = require('path');
const Slack = require('node-slack-upload');
const fs = require('fs');

const slackUrl = '';
const verifyToken = '';
const token = '';
const slack = new Slack(token);

const commandError = {
    text: 'Command Error. /pdf [url] [pdfname]'
};

const options = {
    port: 9000,
};

var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8085, () => {
    console.log('Server listen on port: ', 8085);
});

app.post("/", (req, res) => {
    console.log(req.body);
    if (req.body.token !== verifyToken) {
        return;
    }

    const channel = req.body.channel_name;
    const text = req.body.text.trim();
    const comp = text.split(" ").filter((ele) => { return ele.length > 0 });
    if (comp.length < 2) {
        res.json(commandError);
        return;
    }

    res.json({ text: 'Generating PDF...' });

    const url = comp[0].replace(/[<|>]/g, '');
    let pdfName = comp[1]
    if (path.extname(pdfName).length === 0) {
        pdfName += '.pdf';
    }

    const pdfPath = path.join('.', pdfName);

    console.log(`url:${url}, name:${pdfName}, path:${pdfPath}, 
                 channel:${channel}`);

    htmlPdf.create(url, options).then((pdf) => {
        console.log('### create pdf success');
        
        pdf.toFile(pdfPath).then((response) => {
            console.log('### save pdf success');
            slack.uploadFile({
                file: fs.createReadStream(pdfPath),
                filetype: 'auto',
                title: pdfName,
                channels: channel,
                initial_comment: pdfName,
            }, (error, data) => {
                fs.unlink(pdfPath, (error) => {
                    console.log(`### delete file ${pdfName} ${error}`);
                });

                if (error) {
                    console.log(`### upload file ${pdfName} fail, error:${error}`);
                    sendMessage(`upload ${pdfName}, error:${error}`, channel);
                    return;
                }
                sendMessage(`upload ${pdfName} successfully`, channel);
                console.log(`### upload file ${pdfName} successfully`);
            });
        });
    }).catch((error) => {
        sendMessage(`create ${pdfName} ${error}`, channel);
        console.log("### create pdf error", error);
    });
});

function sendMessage(msg, channel) {
    channel = '#' + channel;
    request.post({
        url: slackUrl,
        form: {
            token: token,
            channel: channel,
            text: msg,
        }
    }, function (error, response, body) {
        console.log(`#### send message error: ${error}, response:${response}, body:${body}`);
    });
}