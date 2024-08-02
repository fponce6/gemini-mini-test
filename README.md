# Node + Express Service Starter

This is a simple API sample in Node.js with express.js based on [Google Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service).

## Getting Started

Server should run automatically when starting a workspace. To run manually, run:
```sh
npm run dev
```

```
curl -X POST http://localhost:3999/ -H "Content-Type: application/json" -d "{\"message\": \"Your test message\", \"imageData\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\"}"
```