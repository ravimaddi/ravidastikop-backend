const axios = require("axios");
const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });
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
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const year = [
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
  ];
  const month = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const apiKey = `AIzaSyDp0sNnHtWSN9bGjMZY4URT5LhI5KOz9nY`;

  let randomStartYear = randomIntFromInterval(0, year.length - 1);
  let randomEndYear = randomIntFromInterval(0, year.length - 1);

  let startYear = year[randomStartYear];
  let endYear = year[randomEndYear];

  //start year should be less than end year
  while (startYear > endYear) {
    randomStartYear = randomIntFromInterval(0, year.length - 1);
    startYear = year[randomStartYear];
  }

  console.log("startYear", startYear);
  console.log("endYear", endYear);

  let randomStartMonth = randomIntFromInterval(0, month.length - 1);
  let randomEndMonth = randomIntFromInterval(0, month.length - 1);
  let startMonth = month[randomStartMonth];
  let endMonth = month[randomEndMonth];
  if (startYear == endYear) {
    while (startMonth > endMonth) {
      randomStartMonth = randomIntFromInterval(0, month.length - 1);
      startMonth = month[randomStartMonth];
    }
  }
  console.log("randomstartMonth", startMonth);
  console.log("randomEndMonth", endMonth);
  const startDate = `${startYear}-${startMonth}-01T00:00:00.52Z`;
  const endDate = `${endYear}-${endMonth}-31T00:00:00.52Z`;
  const blogposts = await axios.get(
    `https://www.googleapis.com/blogger/v3/blogs/1839412217041753224/posts?key=${apiKey}&endDate=${endDate}&startDate=${startDate}`
  );
  console.log("blogposts", blogposts);

  if (blogposts.data.items && blogposts.data.items.length > 0) {
    console.log("postslength", blogposts.data.items.length);

    const postNumber = randomIntFromInterval(0, blogposts.data.items.length);
    console.log("postNumber", postNumber);

    const blogToPost = blogposts.data.items[postNumber];

    const payload = {
      title: blogToPost.title ? blogToPost.title : "Digital India",
      text: "Click the below link to view my blog",
      shareUrl: blogToPost.url,
      shareThumbnailUrl: "",
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

    const result2 = await axios.post(
      `https://api.linkedin.com/v2/shares`,
      body,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "cache-control": "no-cache",
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
          "x-li-format": "json",
          "Content-Length": Buffer.byteLength(JSON.stringify(body)),
        },
      }
    );

    console.log(result2.data);
    return result2.data;
  } else {
    postToLinkedIn(accessToken);
  }
};

module.exports.blog = async (event) => {
  console.log("inside blog function");
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
