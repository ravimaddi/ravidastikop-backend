
const axios = require('axios')
const accessToken= require('./token.json').access_token
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.hello=async(event)=>{

    console.log('lambda')
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
        
           
            return {result:'success' }
         
}




