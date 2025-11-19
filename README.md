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
- **Authentication**: Secure Sign In and Sign Up with Google and Credentials support
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **New Pages**: Dedicated pages for "How it works" and "Pricing"

## 🏗️ Architecture

ResumeForge consists of two main components:

1. **Next.js Frontend & API**: 
   - React-based user interface
   - Next.js API routes for file uploads and orchestration
   - **NextAuth.js** for secure authentication
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
- **Google Cloud Console Project** (for Google Sign In)

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
# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Authentication (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
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
│   │   │   ├── auth/                 # NextAuth.js configuration
│   │   │   └── parse-resume/         # Resume analysis endpoint
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   ├── UploadForm.tsx        # Main upload & optimize flow
│   │   │   └── SuggestionDisplay.tsx # AI suggestions UI
│   │   ├── how-it-works/             # How it works page
│   │   ├── pricing/                  # Pricing page
│   │   ├── signin/                   # Sign In page
│   │   ├── signup/                   # Sign Up page
│   │   └── page.tsx                  # Landing page
│   └── services/
├── resumeforge-parser/
│   ├── app.py                        # Flask service for text extraction
│   └── requirements.txt              # Python dependencies
├── package.json
└── README.md
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth.js** - Authentication
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
3. **Sign In** or **Sign Up** to access features
4. **Upload** your resume (PDF or DOCX format)
5. **Paste** the job description in the text area
6. **Click** "Analyze & Get Suggestions"
7. **Review** the AI-generated suggestions organized by resume sections

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4o access | Yes |
| `NEXTAUTH_URL` | URL of your Next.js app (e.g., http://localhost:3000) | Yes |
| `NEXTAUTH_SECRET` | Random string for session encryption | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes (for Google Login) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes (for Google Login) |
| `FLASK_RUN_PORT` | Port for Flask service (default: 5001) | No |

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For contributions or issues, please contact the project maintainers.

---

Built with ❤️ using Next.js, Flask, and OpenAI
