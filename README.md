# 🎨 AI Photo Editor

AI-powered photo editing application with prompt support. Edit photos using natural language prompts!

## ✨ Features

- 📸 **Upload Images** - Drag and drop or click to upload
- 🎯 **Quick Filters** - Brightness, contrast, blur, sharpen, grayscale, sepia
- 💬 **Custom Prompts** - Describe your edits in natural language
- 🚀 **Real-time Preview** - See results instantly
- 💾 **Download Results** - Save your edited photos
- 🌐 **Web-based** - Works in any modern browser

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/sergeylugansk/photo-ai-editor.git
cd photo-ai-editor
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Start the server**
```bash
npm start
```

5. **Open in browser**
```
http://localhost:5000
```

## 🚀 Usage

1. **Upload a Photo**
   - Click on the upload area or drag & drop an image
   - Supported formats: JPG, PNG, GIF, WebP

2. **Choose Edit Method**
   - **Quick Filters**: Click any of the preset buttons (Brightness, Contrast, etc.)
   - **Custom Prompt**: Type your own description in English or Russian

3. **Download Result**
   - Click the download button to save your edited photo

## 📝 Example Prompts

- `increase brightness`
- `enhance contrast`
- `add blur effect`
- `sharpen the image`
- `convert to grayscale`
- `add sepia tone`
- `яркость` (brightness in Russian)
- `контраст` (contrast in Russian)

## 🔧 Advanced Features

### Using Replicate API for AI Editing

1. **Get API Token**
   - Visit https://replicate.com
   - Sign up and get your API token

2. **Add to .env**
```
REPLICATE_API_TOKEN=your_token_here
```

3. **Use Advanced Editing**
   - The app will automatically use AI-powered editing when token is configured

## 📂 Project Structure

```
photo-ai-editor/
├── public/
│   ├── index.html      # Frontend HTML
│   ├── style.css       # Styling
│   └── app.js          # Frontend JavaScript
├── uploads/            # Uploaded and edited images
├── server.js           # Express server
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🎨 Supported Edits

| Filter | Keywords |
|--------|----------|
| Brightness | brightness, яркость |
| Contrast | contrast, контраст |
| Blur | blur, размыто |
| Sharpen | sharpen, резкость |
| Grayscale | grayscale, ч/б |
| Sepia | sepia, сепия |

## 🔐 Security

- Files are limited to 10MB
- CORS is configured for safety
- Uploaded files are stored locally
- Consider implementing authentication for production

## 🌐 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel/Netlify
- Deploy the `public` folder as static site
- Use serverless functions for backend

## 📦 Dependencies

- **express** - Web framework
- **multer** - File upload handling
- **sharp** - Image processing
- **axios** - HTTP client
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🐛 Troubleshooting

### Port already in use
```bash
PORT=3000 npm start
```

### Image upload fails
- Check file size (max 10MB)
- Verify file format (JPG, PNG, etc.)
- Check server logs

### Sharp installation issues
```bash
npm rebuild sharp
```

## 📝 License

MIT License - feel free to use this project!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

[@sergeylugansk](https://github.com/sergeylugansk)

## 📞 Support

Have questions? Open an issue on GitHub!

---

**Made with ❤️ for photo enthusiasts**
