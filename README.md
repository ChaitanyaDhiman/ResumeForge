# ResumeForge 🚀

ResumeForge is an AI-powered resume optimization tool that helps job seekers tailor their resumes to specific job descriptions. By analyzing your resume against a job posting, ResumeForge provides actionable suggestions to improve ATS (Applicant Tracking System) keyword matching and overall resume alignment.

## ✨ Features

### Core Functionality
- **Resume Text Extraction**: Supports PDF and DOCX file formats
- **AI-Powered Analysis**: Uses OpenAI GPT-4o to analyze resume against job descriptions
- **Actionable Suggestions**: Provides three types of recommendations:
  - **ADD**: Suggestions for new content to include
  - **REVISE**: Recommendations to improve existing content
  - **REMOVE**: Content that should be removed or replaced
- **Section-Based Organization**: Suggestions are grouped by resume sections (Experience, Skills, Summary, etc.)

### Security & Authentication
- **Secure Authentication**: Sign In and Sign Up with Google OAuth and email/password credentials
  - **Welcome Messages**: New users receive a friendly welcome toast notification
  - **Auth Protection**: Users must sign in to generate AI-powered suggestions
  - **Password Strength**: Enforced requirements (8+ chars, uppercase, lowercase, number, special character)
  - **Email Validation**: Strict RFC 5322 compliant email validation
  - **Email Verification**: OTP-based verification with retry logic (powered by Resend)
- **Security Headers**: Comprehensive protection via Next.js middleware
  - **Content Security Policy (CSP)**: Restricts resource loading to trusted sources
  - **X-Frame-Options**: Prevents clickjacking attacks
  - **X-Content-Type-Options**: Prevents MIME type sniffing
  - **HSTS**: Enforces HTTPS in production
  - **Referrer-Policy**: Controls referrer information
  - **Permissions-Policy**: Restricts browser features
- **Session Security**:
  - JWT-based sessions with 30-day expiration
  - Secure, HTTP-only cookies with SameSite protection
  - CSRF protection enabled
  - Session sliding (auto-renewal on activity)
- **Usage Limits**:
  - **Monthly Quota**: 3 resume optimizations per user per month
  - **Usage Tracking**: Real-time tracking of optimization requests
- **Rate Limiting**: Protection against API abuse and DoS attacks
  - Registration: 5 requests/minute per IP
  - Resume parsing: 10 requests/minute per user
  - OTP Resend: 5 requests/10 minutes per email
- **Input Validation**: Comprehensive validation and sanitization
  - File type validation (PDF, DOCX only - MIME type + extension)
  - File size limits (10MB default, configurable)
  - Enhanced XSS prevention (removes scripts, event handlers, data URIs)
  - Email format validation with additional checks
- **Optimized Database**: Prisma client singleton for improved performance

> **Security Note**: For detailed security information, see [SECURITY.md](./SECURITY.md)

### Authentication Flow
![Email Verification & OTP Flow](/email_otp_flow.png)

### User Experience
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Mobile Responsive**: Fully optimized for all device sizes
  - Responsive navigation with hamburger menu
  - Touch-friendly buttons (44x44px minimum)
  - Optimized typography and spacing for mobile
  - Tested on iPhone SE, iPhone 12/13, iPad, and desktop
- **Dedicated Pages**: "How it works", "Pricing", "Sign In", and "Sign Up" pages

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

### 4. Set Up Database

ResumeForge uses **PostgreSQL** with **Prisma ORM** for user authentication and data storage.

Follow the detailed guide in [DATABASE_SETUP.md](./DATABASE_SETUP.md) to:
- Create a PostgreSQL database (Vercel, Supabase, Neon, or any provider)
- Configure your `DATABASE_URL` environment variable
- Push the database schema

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database (PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database?schema=public

# Authentication (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Note**: For Google Authentication setup, see [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md).

The Flask service will automatically use environment variables from `.env` if present, or you can set them directly.

### 6. Start the Flask Parser Service

In the `resumeforge-parser` directory (with venv activated):

```bash
python app.py
```

The Flask service will start on `http://localhost:5001`

### 7. Start the Next.js Development Server

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
- **Prisma v5** - Database ORM
- **PostgreSQL** - Database
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

### Required Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4o access | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | URL of your Next.js app (e.g., http://localhost:3000) | Yes |
| `NEXTAUTH_SECRET` | Random string for session encryption (generate with `openssl rand -base64 32`) | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes (for Google Login) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes (for Google Login) |
| `RESEND_API_KEY` | Resend API key for sending emails | Yes |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `FLASK_RUN_PORT` | Port for Flask service | 5001 |
| `MAX_FILE_SIZE_MB` | Maximum file upload size in MB | 10 |
| `OTP_EXPIRY_MINUTES` | OTP expiration time in minutes | 15 |
| `RATE_LIMIT_BYPASS` | Bypass rate limiting (development only) | false |

> **Security Warning**: Never commit `.env.local` or `.env` files to version control. Use different secrets for development and production.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For contributions or issues, please contact the project maintainers.

---

Built with ❤️ using Next.js, Flask, and OpenAI
