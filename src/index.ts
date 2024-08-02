import express from 'express';
const app = express();

app.use(express.json());

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
  
  console.log("\t sanitizedMessage: ", sanitizedMessage);

  res.status(201).json({ message: 'Message received successfully' });
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
  return null; // No validation errors
}
