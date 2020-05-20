const express = require("express")
const AWS = require('aws-sdk')
const rp = require('request-promise')
const app = express()
const multer = require("multer")
const request = require('request')

AWS.config.update({
    accessKeyId: "**********",
    secretAccessKey: "*************",
    region: "*************"
})

const s3 = new AWS.S3

const params = {
    Bucket: "******",
    Key: "Jellyfish.jpg"
}


app.get('/s3data', async (req, res ) => {
    const s3data = await s3.getObject(params).promise().then(data => {
        console.log(data);
        
    })
    // res.setHeader('ContentType', 'image/jpg')
    // res.status(200).send(s3data)
})

app.get ("/imgurl", async (req, res ) => {
    var options = {
        method: "GET",
        url: 'http://pix6.agoda.net/hotelImages/686/686275/686275_14072514060020486303.jpg?2000x',
        encoding: null
    }
    request(options, (err, response, body) => {
        console.log("body",body);
        console.log("response", response)
        var params = {
            Bucket: 'alpha-aj2',
            Key: 'qwerty1223.jpg',
            Body: body,
            ACL: 'public-read',     // to give public read access to everyone, before this turn off 'block all public access fron s3 bucket'
            ContentType: 'image/jpg'
        }
        
    s3.putObject(params).promise().then(data => {
        console.log(data);
        console.log(data.location);
        
        res.status(200).send(data)
    }).catch(err => {
        console.log(err);
        
    })
})
    // res.setHeader('ContentType', "image/png")
    // res.status(200).send(data)
})


var upload = multer({
    limits: {
        fileSize: 2000000
    }
})

app.post('/upploadTos3', upload.single('upload'), async (req, res) => {
    console.log(req.file);
    var params = {
        Bucket: 'alpha-aj2',
        Key: req.file.originalname,
        Body: req.file.buffer,
        ACL: 'public-read',
        ContentType: req.file.mimetype
    }
    s3.putObject(params).promise().then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);  
    })
})

// app.get()

app.listen(3030, () => {
    console.log("server running");
    
})
