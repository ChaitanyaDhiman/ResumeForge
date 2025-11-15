# ResumeForge 🚀

ResumeForge is an AI-powered resume optimization tool that helps job seekers tailor their resumes to specific job descriptions. By analyzing your resume against a job posting, ResumeForge provides actionable suggestions to improve ATS (Applicant Tracking System) keyword matching and overall resume alignment.

## ✨ Features

- **Resume Text Extraction**: Supports PDF and DOCX file formats
- **AI-Powered Analysis**: Uses OpenAI GPT-4o to analyze resume against job descriptions
- **Actionable Suggestions**: Provides three types of recommendations:
  - **ADD**: Suggestions for new content to include
  - **REVISE**: Recommendations to improve existing content
  - **REMOVE**: Content that should be removed or replaced
- **Section-Based Organization**: Suggestions are grouped by resume sections (Experience, Skills, Summary, etc.)
- **ATS Optimization**: Focuses on keyword matching and ATS compatibility
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## 🏗️ Architecture

ResumeForge consists of two main components:

1. **Next.js Frontend & API**: 
   - React-based user interface
   - Next.js API routes that handle file uploads and coordinate between services
   - OpenAI integration for resume analysis

2. **Flask Parser Service**:
   - Microservice for extracting text from PDF and DOCX files
   - Runs independently on port 5001

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Python** (3.9 or higher)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd resumeforge-app
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up Flask Parser Service

Navigate to the parser directory and set up a virtual environment:

```bash
cd resumeforge-parser
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

The Flask service will automatically use environment variables from `.env` if present, or you can set them directly.

### 5. Start the Flask Parser Service

In the `resumeforge-parser` directory (with venv activated):

```bash
python app.py
```

The Flask service will start on `http://localhost:5001`

### 6. Start the Next.js Development Server

In the root directory:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
resumeforge-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── parse-resume/
│   │   │       └── route.ts          # Main API endpoint for resume analysis
│   │   ├── components/
│   │   │   ├── UploadForm.tsx         # File upload and job description form
│   │   │   └── SuggestionDisplay.tsx  # Displays AI-generated suggestions
│   │   └── page.tsx                   # Main landing page
│   └── services/
├── resumeforge-parser/
│   ├── app.py                         # Flask service for text extraction
│   └── requirements.txt               # Python dependencies
├── package.json
└── README.md
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI SDK** - AI integration

### Backend
- **Flask** - Python web framework
- **pypdf** - PDF text extraction
- **python-docx** - DOCX text extraction
- **flask-cors** - CORS handling

## 🔌 API Endpoints

### Next.js API Routes

- `POST /api/parse-resume`
  - Accepts: FormData with `resumeFile` and `jobDescription`
  - Returns: JSON with extracted text and AI suggestions

### Flask Parser Service

- `GET /` - Health check endpoint
- `POST /extract-text`
  - Accepts: FormData with `file` (PDF or DOCX)
  - Returns: JSON with extracted clean text

## 📝 Usage

1. **Start both services** (Flask parser and Next.js app)
2. **Open** `http://localhost:3000` in your browser
3. **Upload** your resume (PDF or DOCX format)
4. **Paste** the job description in the text area
5. **Click** "Analyze & Get Suggestions"
6. **Review** the AI-generated suggestions organized by resume sections

## 🧪 Development

### Running in Development Mode

```bash
# Terminal 1: Flask service
cd resumeforge-parser
source venv/bin/activate
python app.py

# Terminal 2: Next.js app
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4o access | Yes |
| `FLASK_RUN_PORT` | Port for Flask service (default: 5001) | No |

## 🐛 Troubleshooting

### Flask service not connecting
- Ensure Flask service is running on port 5001
- Check that CORS is enabled in `app.py`
- Verify the `FLASK_PARSER_URL` in `src/app/api/parse-resume/route.ts`

### OpenAI API errors
- Verify your API key is set correctly in `.env.local`
- Check your OpenAI account has sufficient credits
- Ensure you have access to GPT-4o model

### File upload issues
- Ensure file is PDF or DOCX format
- Check file size limits
- Verify Flask service is running and accessible

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For contributions or issues, please contact the project maintainers.

---

Built with ❤️ using Next.js, Flask, and OpenAI
