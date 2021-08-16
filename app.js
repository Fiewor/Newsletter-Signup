const express = require("express");
// const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();
const port = 3000;

// const apiKey = '3049345402cdf1663df9c1a2df731f34-us5';
// const server_prefix = "us5";

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.get("/", function(req, res){
    // console.log(`<h1>Is this on?</h1>`);
    res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: "3049345402cdf1663df9c1a2df731f34-us5",
  server: "us5"
});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const listId = "98efb23e64";
    
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    
    const run = async () => {
      const response = await client.lists.addListMember(`${listId}`, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
        }
      });
      res.sendFile(__dirname + "/success.html");
      console.log(response);
    };
    
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
    
    // let data = {
    //     members: [
    //         {
    //             email_address: email,
    //             status: "subscribed",
    //             merge_fields: {
    //                 FNAME: firstName,
    //                 LNAME: lastName
    //             }
    //         }
    //     ]
    // }

    // const jsonData = JSON.stringify(data);
    // const url = `https://${region}.api.mailchimp.com/3.0/lists/${listId}/members?skip_merge_validation=<SOME_BOOLEAN_VALUE>`;
    // const options = {
    //     method: `POST`,
    //     auth: `john: ${apiKey}`
    // }
    
    // const request = https.request(url, options, function(response){
    //         response.on("data", function(data){
    //             console.log(JSON.parse(data));
    //         })
    //     })

    // request.write(jsonData);
    // request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(port, function(){
    console.log(`Server is running on port ${port}`)
});
