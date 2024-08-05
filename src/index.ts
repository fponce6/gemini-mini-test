import express from 'express';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GAIK);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

app.use(express.json({ limit: 52428800 }))
app.use(express.urlencoded({ extended: true }))

const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.post('/', async (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { imageData } = req.body;
  const validationError = validateImageData(imageData);

  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const sanitizedMessage = req.body.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (sanitizedMessage !== "Arriba las manos pequeño caperucito, este es el lobo del aire!") {
    return res.status(301).json({ success: false, error: validationError });
  }

  // const prompt = `You will analyze a Base64 Image data and determine if it meets the \
  const prompt = `Please analyze the attached image and determine if it meets the \
                  following criteria consistent with a passing score on the \
                  clock drawing component of the Mini-Cog test: \
                  All numbers 1-12 are present and in the correct order. \
                  The numbers are placed in the proper positions on the clock face. \
                  Two hands are present, with the hour hand shorter than the minute hand. \
                  The hands are pointing to ten past eleven , 11:10. \
                  Since the drawing is done on a digital canvas, there is room for error and users only have one chance to submit.\
                  Respond in plain text, no markup and please be kind, older adults might read your response.`;

  console.info("\n\n\t *** prompt");
  console.info(prompt);

  try {
    const base64String = imageData.startsWith('data:')
      ? imageData.split(',')[1]
      : imageData;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64String,  // Only pass the Base64 string without the data URI prefix
          mimeType: 'image/png'
        }
      }]
    );

    console.log(`\t\t *** Gemini API result "`, result);
    const response = await result.response;
    console.log(`\t\t *** Gemini API response "`, response);
    const text = await response.text();
    console.log(text);
    res.status(201).json({ message: text });
  } catch (error) {
    console.error(`Error: `, error);
    res.status(500).json({ error: error.message });
  }
});

const port = parseInt(process.env.PORT || '3999');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const MAX_IMAGE_SIZE_KB = 1512;

function validateImageData(imageData: any) {
  if (!imageData || imageData.trim() === '') {
    return 'Image data is empty or missing';
  }
  const base64Data = imageData.split(',')[1];
  if (!base64Data || base64Data.trim() === '') {
    return 'Missing Base64 data';
  }
  const imageSizeKB = (base64Data.length * 3) / 4 / 1024;
  if (imageSizeKB > MAX_IMAGE_SIZE_KB) {
    return `Image size exceeds ${MAX_IMAGE_SIZE_KB}KB limit`;
  }
  const base64Pattern = /^data:image\/[a-zA-Z]+;base64,[^\s]+$/;
  if (!base64Pattern.test(imageData)) {
    return 'Invalid Base64 format';
  }
  console.log('\t *** received image data: ', imageData);
  console.log('\n\n\t *** received image is valid');

  return null; // No validation errors
}
