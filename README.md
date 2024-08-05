# Node + Express Service Starter

#### Project by icaza@gatech.edu, fponce6@gatech.edu, cc: Contact@Mini-Test.com

## Introduction

This is a API based in Node.js with express.js based on [Google Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service) that communicates with Gemini API to determine if a given image passes the Mini-Test.com Drawing Evaluation. 


## Getting Started

**Note: Must have a Google Gemini API key before moving foward.**

Set Env Variable before running: `export GAIK="<PASTE-YOUR-API-KEY-HERE>"`


#### Dev Environment
Server should run automatically when starting a workspace. To run manually, run:
```sh
npm run dev
```

```
curl -X POST http://localhost:3999/ -H "Content-Type: application/json" -d "{\"message\": \"Your test message\", \"imageData\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\"}"
```

#### Deployment
```
gcloud run deploy --update-env-vars GAIK=<PASTE-YOUR-API-KEY-HERE>
```