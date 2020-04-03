const axios = require('axios')
const fs = require('fs')
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log('insideAccessToken')

app.get('/api/token/:code', async(req, res) => {
    const code = req.params.code
    console.log('code',code)
   const resAccestoken= await axios.post(`https://linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&redirect_uri=http://localhost:3000&client_id=81gad30pe28yok&client_secret=EpKnXhd7T5iwGDkW&code=${code}`,'')
  
  console.log('resAccestoken.data',resAccestoken.data)
  let access_token = resAccestoken.data.access_token;
              //	let expires_in = Date.now() + (JSON.parse(r.body).expires_in * 1000); // token expiry in epoc format
                  let token_json = '{"access_token":"' + access_token + '"}';
  const resWriteFile = await fs.writeFile("./token.json", token_json, e => {if(e){console.log('ERROR - ' + e)}else{
    console.log('writefileSuccess')
  }});
  console.log('resWriteFile',resWriteFile)
    res.send({result:resAccestoken.data});
  });
  

module.exports.storage=serverless(app)