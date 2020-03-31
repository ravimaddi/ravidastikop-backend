"use strict";
const { tagEvent } = require("./serverless_sdk");


module.exports.hello = async event => {
  
  tagEvent("custom-tag", "hello world", { custom: { tag: "data" } });

console.log(event)
 

const axios = require('axios')
const accessToken = "AQW-EKEsqc0PgGsjML88Bddz8EaYyFpToo7kUxllXvor2wCzrq8OZgoD9fB9T_su6RQ8rNvMDwPp6-XfeAe_DL7Jl0w4csQFnytdnXN7ik4ey9Nt5ZqpwLUmpQWi8QlWBn5oHAKx0pbWpS6C9nS_PrHDcbfyFTmmptFUJTvbh6IT-OBuxUC521dtj4QERtRqfOahuI4JHiZSKi11nwCYL-HobJOKaFnUBGRsLuMMIX_Fo_kxZNUlPkTkA0y3wE_0P-KVSj6vBqEzbUf-E0jKTG-HEoCdz-1_hoHT1xpIjIUG0Z8IsYZqCTh_eULlMzcb1z8ALkKz28n-g0kA4dt-tDxxvKsOBA"

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
}


const result3 = await getToken()



  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  };

};
