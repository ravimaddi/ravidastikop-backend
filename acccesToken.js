const axios = require("axios");
const fs = require("fs");
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const app = express();
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
app.use(cors());

app.post("/api", async (req, res) => {
  console.log("insideAccessToken");

  const code = req.query.code;
  console.log("code", code);
  const resAccestoken = await axios.post(
    `https://linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&redirect_uri=https://ravilinkedinshare.herokuapp.com/auth&client_id=81gad30pe28yok&client_secret=EpKnXhd7T5iwGDkW&code=${code}`,
    ""
  );

  console.log("resAccestoken.data", resAccestoken.data);
  let access_token = resAccestoken.data.access_token;

  let table = process.env.TABLE;
  console.log("table", table);

  let params = {
    TableName: table,
    Key: {
      username: "ravi",
    },
    UpdateExpression: "set #MyVariable = :r",
    ExpressionAttributeNames: {
      "#MyVariable": "linkedintoken",
    },
    ExpressionAttributeValues: {
      ":r": `${access_token}`,
    },
    ReturnValues: "UPDATED_NEW",
  };

  function updateItem(params) {
    let promise = new Promise(function (resolve, reject) {
      dynamoDb.update(params, function (error, data) {
        if (error) {
          console.error(
            "Unable to update item. Error JSON:",
            JSON.stringify(error, null, 2)
          );
          reject(error);
        } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          resolve(data);
        }
      });
    });
    return promise;
  }

  const updatedResult = await updateItem(params);
  console.log(updatedResult);

  // dynamoDb.update(params, function (err, data) {
  //   if (err) {
  //     console.log("dynamo update error", err);
  //   } else {
  //     console.log("updation succesful", data);
  //   }
  // });

  res.send({ result: "success" });
});

module.exports.storage = serverless(app);
