

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors')
const axios = require('axios')
const fs = require('fs')
const accessToken= require('./token.json').access_token

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log('lambda')

app.get('/', async(req, res) => {

  // const accessToken = "AQW-EKEsqc0PgGsjML88Bddz8EaYyFpToo7kUxllXvor2wCzrq8OZgoD9fB9T_su6RQ8rNvMDwPp6-XfeAe_DL7Jl0w4csQFnytdnXN7ik4ey9Nt5ZqpwLUmpQWi8QlWBn5oHAKx0pbWpS6C9nS_PrHDcbfyFTmmptFUJTvbh6IT-OBuxUC521dtj4QERtRqfOahuI4JHiZSKi11nwCYL-HobJOKaFnUBGRsLuMMIX_Fo_kxZNUlPkTkA0y3wE_0P-KVSj6vBqEzbUf-E0jKTG-HEoCdz-1_hoHT1xpIjIUG0Z8IsYZqCTh_eULlMzcb1z8ALkKz28n-g0kA4dt-tDxxvKsOBA"

const getToken=async ()=>{

const result1 = await axios.get('https://api.linkedin.com/v2/me',{
    headers :{
        'Authorization': 'Bearer ' + accessToken,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
    }
})
    
console.log(result1.data.id)




  let title = "Hello from AWS lambda";
  let text = "click one the post!";
  let shareUrl = "https://www.github.com/ravimaddi"
  let shareThumbnailUrl = "https://www.example.com/image.jpg"


let body = {
    "owner": "urn:li:person:" + result1.data.id,
    "subject": title,
    "text": {
        "text": text // max 1300 characters
    },
    "content": {
        "contentEntities": [{
            "entityLocation": shareUrl,
            "thumbnails": [{
                "resolvedUrl": shareThumbnailUrl
            }]
        }],
        "title": title
    },
    "distribution": {
        "linkedInDistributionTarget": {}
    }
}

const result2 = await axios.post(`https://api.linkedin.com/v2/shares`,body,{
    headers : {
        'Authorization': 'Bearer ' + accessToken,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
        'x-li-format': 'json',
        'Content-Length': Buffer.byteLength(JSON.stringify(body))
    }
})

console.log(result2.data)
return result2.data
}


const result3 = await getToken()

   
     res.send({result:'success' })
 

 });


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


//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.hello = serverless(app);




