"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
var app = (0, express_1.default)();
var genAI = new GoogleGenerativeAI(process.env.GAIK);
var model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
app.use(express_1.default.json({ limit: 52428800 }));
app.use(express_1.default.urlencoded({ extended: true }));
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var imageData, validationError, sanitizedMessage, prompt, base64String, result, response, text, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.message) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid request body' })];
                }
                imageData = req.body.imageData;
                validationError = validateImageData(imageData);
                if (validationError) {
                    return [2 /*return*/, res.status(400).json({ success: false, error: validationError })];
                }
                sanitizedMessage = req.body.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                if (sanitizedMessage !== "Arriba las manos pequeño caperucito, este es el lobo del aire!") {
                    return [2 /*return*/, res.status(301).json({ success: false, error: validationError })];
                }
                prompt = "Please analyze the attached image and determine if it meets the                   following criteria consistent with a passing score on the                   clock drawing component of the Mini-Cog test:                   All numbers 1-12 are present and in the correct order.                   The numbers are placed in the proper positions on the clock face.                   Two hands are present, with the hour hand shorter than the minute hand.                   The hands are pointing to ten past eleven , 11:10.                   Since the drawing is done on a digital canvas, there is room for error and users only have one chance to submit.                  Respond in plain text, no markup and please be kind, older adults might read your response.";
                console.info("\n\n\t *** prompt");
                console.info(prompt);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                base64String = imageData.startsWith('data:')
                    ? imageData.split(',')[1]
                    : imageData;
                return [4 /*yield*/, model.generateContent([
                        prompt,
                        {
                            inlineData: {
                                data: base64String, // Only pass the Base64 string without the data URI prefix
                                mimeType: 'image/png'
                            }
                        }
                    ])];
            case 2:
                result = _a.sent();
                console.log("\t\t *** Gemini API result \"", result);
                return [4 /*yield*/, result.response];
            case 3:
                response = _a.sent();
                console.log("\t\t *** Gemini API response \"", response);
                return [4 /*yield*/, response.text()];
            case 4:
                text = _a.sent();
                console.log(text);
                res.status(201).json({ message: text });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error("Error: ", error_1);
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
var port = parseInt(process.env.PORT || '3999');
app.listen(port, function () {
    console.log("listening on port ".concat(port));
});
var MAX_IMAGE_SIZE_KB = 1512;
function validateImageData(imageData) {
    if (!imageData || imageData.trim() === '') {
        return 'Image data is empty or missing';
    }
    var base64Data = imageData.split(',')[1];
    if (!base64Data || base64Data.trim() === '') {
        return 'Missing Base64 data';
    }
    var imageSizeKB = (base64Data.length * 3) / 4 / 1024;
    if (imageSizeKB > MAX_IMAGE_SIZE_KB) {
        return "Image size exceeds ".concat(MAX_IMAGE_SIZE_KB, "KB limit");
    }
    var base64Pattern = /^data:image\/[a-zA-Z]+;base64,[^\s]+$/;
    if (!base64Pattern.test(imageData)) {
        return 'Invalid Base64 format';
    }
    console.log('\t *** received image data: ', imageData);
    console.log('\n\n\t *** received image is valid');
    return null; // No validation errors
}
//# sourceMappingURL=index.js.map