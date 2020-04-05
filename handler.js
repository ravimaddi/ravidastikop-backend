const axios = require("axios");
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

function getItem(params) {
  let promise = new Promise(function (resolve, reject) {
    dynamoDb.get(params, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      if (result.Item) {
        resolve(result.Item);
      } else {
        reject({ error: "item not found" });
      }
    });
  });
  return promise;
}
const postToLinkedIn = async (accessToken) => {
  const youtubePageTokens = [
    "",
    "CDIQAA",
    "CGQQAA",
    "CJYBEAA",
    "CMgBEAA",
    "CPoBEAA",
    "CKwCEAA",
    "CN4CEAA",
    "CJADEAA",
    "CMIDEAA",
    "CPQDEAA",
    "CKYEEAA",
    "CNgEEAA",
  ];

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const randomPageNo = randomIntFromInterval(0, 12);
  console.log("random12", randomPageNo);

  const youtubeResult = await axios.get(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=UUgOkp2x0ivyBFCp4DN6p4Iw&key=AIzaSyDp0sNnHtWSN9bGjMZY4URT5LhI5KOz9nY&pageToken=${youtubePageTokens[randomPageNo]}`
  );

  const randomVideoNo = randomIntFromInterval(0, 49);
  console.log("randomVideoNo", randomVideoNo);

  const videoToPost = youtubeResult.data.items[randomVideoNo];
  console.log(videoToPost);

  const payload = {
    title: videoToPost.snippet.title,
    text: videoToPost.snippet.description,
    shareUrl: `https://www.youtube.com/watch?v=${videoToPost.snippet.resourceId.videoId}`,
    shareThumbnailUrl: videoToPost.snippet.thumbnails.high.url,
  };

  const result1 = await axios.get("https://api.linkedin.com/v2/me", {
    headers: {
      Authorization: "Bearer " + accessToken,
      "cache-control": "no-cache",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });

  console.log(result1.data.id);

  let body = {
    owner: "urn:li:person:" + result1.data.id,
    subject: payload.title,
    text: {
      text: payload.text, // max 1300 characters
    },
    content: {
      contentEntities: [
        {
          entityLocation: payload.shareUrl,
          thumbnails: [
            {
              resolvedUrl: payload.shareThumbnailUrl,
            },
          ],
        },
      ],
      title: payload.title,
    },
    distribution: {
      linkedInDistributionTarget: {},
    },
  };

  const result2 = await axios.post(`https://api.linkedin.com/v2/shares`, body, {
    headers: {
      Authorization: "Bearer " + accessToken,
      "cache-control": "no-cache",
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
      "x-li-format": "json",
      "Content-Length": Buffer.byteLength(JSON.stringify(body)),
    },
  });

  console.log(result2.data);
  return result2.data;
};

module.exports.hello = async (event) => {
  console.log("inside lambds");
  console.log(process.env.TABLE);
  const linkedinToken = await getItem({
    TableName: process.env.TABLE,
    Key: {
      username: "ravi",
    },
    KeyConditionExpression: "username = :username",
    ScanIndexForward: false, // true = ascending, false = descending
    ExpressionAttributeValues: {
      ":username": "ravi",
    },
  });
  console.log(linkedinToken);

  const result3 = await postToLinkedIn(linkedinToken.linkedintoken);

  return { result: "success" };
};
