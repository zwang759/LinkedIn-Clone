<h1>Linkedin Clone</h1>

<p> A fake LinkedIn </p>

<p>Click <a href="http://3.89.217.107:5000">here</a> to live preview.</p>

## Tech stacks

- [x] JavaScript
- [x] React.js
- [x] Styled Components
- [x] Material-UI
- [x] Redux
- [x] Redux-Thunk
- [x] React Icons
- [x] React Router
- [x] Redux DevTools Extension
- [x] Moment.js
- [x] JSON Web Token
- [x] Express
- [x] Redis
- [x] MongoDB (Mongoose ODM)
- [x] Docker
- [x] AWS S3, ECR, ECS, Fargate

## Environment Setup

<p><a href="https://www.mongodb.com/cloud/atlas#:~:text=MongoDB%20Atlas%20is%20the%20global,data%20security%20and%20privacy%20standards.">Setup MongoDB Atlas</a></p>
<p><a href="https://redis.io/download">Download and install Redis</a></p>
<p><a href="https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Categories=categories%23storage&trk=ps_a134p000004f2aOAAQ&trkCampaign=acq_paid_search_brand&sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=Google&sc_category=Storage&sc_country=US&sc_geo=NAMER&sc_outcome=acq&sc_detail=aws%20s3&sc_content=S3_e&sc_matchtype=e&sc_segment=468090540619&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|Storage|S3|US|EN|Text&s_kwcid=AL!4422!3!468090540619!e!!g!!aws%20s3&ef_id=Cj0KCQjwit_8BRCoARIsAIx3Rj5CkTisgVGuaF9YP0eAKtW2XUY6VqZzCE-JMAmW85IdKZ3pynoc38EaAoc3EALw_wcB:G:s&s_kwcid=AL!4422!3!468090540619!e!!g!!aws%20s3">Create a free AWS account and create a S3 bucket</a></p>
<p><a href="https://docs.docker.com/get-docker/">Download and install Docker</a></p>

## Starting Development Environment

1. Under config file, add a file named `default.json` and input your configurations and secret keys
    ```
    {
        "mongo_URI": ""
        "jwtSecret": ""
        "githubToken": ""
        "AWSAccessKeyId": "" 
        "AWSSecretKey": ""
        "S3_BUCKET_NAME": ""
        "defaultAvatar": ""
        "defaultBackgroundMedia": "" 
        "signedUrlExpireSeconds": ""
        "NEWS_API_KEY": ""
    }
    ```

2. Run `cd server`, under server folder, Run `npm install`
3. Run `cd client`, under client folder, Run `npm install`
4. Run `cd ..`, in root directory, Run `npm run dev` and access `http://localhost:3000`.<br />

## Deployment

1. Run `docker-compose -f docker-compose.yml up -d --build`
2. <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html">Push images to Amazon
   ECR</a>
3. Create ECS cluster
4. Create a Task Definition and set configuration
5. Whitelist addresses in your Amazon S3, MongoDB, and edit inbound rules in your AWS Security Groups

## App Architecture

1. root folder contains the backend APIs built by <b> express </b>
2. client folder contains the frontend pages built by <b> react <b/>
