import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

interface Suggestion {
  type: 'ADD' | 'REVISE' | 'REMOVE';
  section: string;
  targetText?: string;
  suggestedText: string;
  reason: string;
}

interface LLMSuggestions {
  summary: string;
  changes: Suggestion[];
}

function generateAnalysisPrompt(resumeText: string, jobDescription: string): string {
  return `
    You are an expert Resume Analyst specializing in Applicant Tracking Systems (ATS) and career coaching.
    
    **PRIMARY GOAL:**
    Analyze the RESUME against the JOB DESCRIPTION (JD) to generate a detailed list of actionable changes that will maximize the resume's ATS keyword match percentage and improve its overall fit for the role.

    **MANDATORY HIGH-LEVEL ANALYSIS & GAPS:**
    1. **Experience Mismatch:** Compare the candidate's total years of experience against the JD's requirement. If the difference is 3 years or more, you MUST generate an "ADD" suggestion in the "Summary" section to address this gap (e.g., "Frame 3 years as 5+ years of relevant project delivery experience").
    2. **Core Skill Gaps:** If there are 3 or more core, non-transferable technology keywords in the JD that are completely missing from the resume, generate an "ADD" suggestion in the "Skills" section, advising the candidate that these are significant gaps they must address (e.g., "Add a short 'Career Development' section to list relevant training for missing skills like Python").
    3. **Keyword Maximization:** Ensure every required or preferred keyword from the JD is either present or suggested for addition/revision.

    **OUTPUT FORMAT INSTRUCTIONS:**
    1. The top-level array MUST be named **"changes"**.
    2. Every object in the "changes" array MUST include all five keys: "type", "section", "targetText", "suggestedText", and "reason".
    3. The "reason" field MUST explicitly reference the keyword or requirement from the JD that the suggestion addresses.
    4. For ADD suggestions, "targetText" should be null. For REVISE/REMOVE, "targetText" should be the original text snippet.
    
    --- START CONTEXT ---
    
    **JOB DESCRIPTION:**
    """${jobDescription}"""

    **CANDIDATE RESUME (Extracted Text):**
    """${resumeText}"""
    
    --- END CONTEXT ---
    
    **OUTPUT REQUIREMENT:**
    Return ONLY a single JSON object that strictly adheres to the LLMSuggestions interface defined below.
    
    {
      "summary": "A brief summary of the resume's alignment score (e.g., '75% match') and overall gap assessment.",
      "changes": [
        {
          "type": "REVISE",
          "section": "Experience",
          "targetText": "Collaborated effectively within cross-functional Agile teams...",
          "suggestedText": "Spearheaded collaboration across cross-functional Agile teams, implementing CI/CD pipelines and reducing deployment time by 30% to meet fast-paced project deadlines (JD Keyword: fast-paced Agile).",
          "reason": "Incorporates JD keywords 'Spearheaded' and 'fast-paced project deadlines' to address required team leadership and Agile environment experience."
        },
        // ... more Suggestion objects here
      ]
    }
  `;
}

const openai = new OpenAI();

const FLASK_PARSER_URL = process.env.FLASK_PARSER_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/python` : 'http://localhost:5001');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get('resumeFile');
    const jobDescription = formData.get('jobDescription') as string;

    if (!resumeFile || typeof resumeFile === 'string') {
      return NextResponse.json({ error: 'Resume file is missing or invalid' }, { status: 400 });
    }

    const flaskFormData = new FormData();
    flaskFormData.append('file', resumeFile);

    console.log(`Sending file to Flask at: ${FLASK_PARSER_URL}/extract-text`);

    // Forward authentication headers to bypass Vercel Deployment Protection
    const headers = new Headers();
    const cookie = request.headers.get('cookie');
    const authorization = request.headers.get('authorization');

    if (cookie) headers.set('cookie', cookie);
    if (authorization) headers.set('authorization', authorization);

    const parserResponse = await fetch(`${FLASK_PARSER_URL}/extract-text`, {
      method: 'POST',
      body: flaskFormData,
      headers: headers,
    });

    const responseText = await parserResponse.text();
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Flask response as JSON. Status:", parserResponse.status);
      console.error("Response body preview:", responseText.slice(0, 500));
      return NextResponse.json({
        error: `Invalid response from Python service (Status ${parserResponse.status}). Check server logs.`
      }, { status: 500 });
    }

    if (!parserResponse.ok) {
      return NextResponse.json({
        error: `File parsing failed in Python service: ${errorData.error}`
      }, { status: parserResponse.status });
    }

    const { clean_text: resumeText } = errorData;
    const analysisPrompt = generateAnalysisPrompt(resumeText, jobDescription);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert JSON generator. You must only output the requested JSON object.'
        },
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    let llmRawResponse = completion.choices[0].message.content;

    llmRawResponse = llmRawResponse || '{}';
    let llmSuggestions: LLMSuggestions;

    try {
      const parsed = JSON.parse(llmRawResponse) as Partial<LLMSuggestions>;

      llmSuggestions = {
        summary: parsed.summary || "LLM did not provide a detailed summary. Try running again.",
        changes: Array.isArray(parsed.changes) ? parsed.changes : [],
      };

    } catch (e) {
      console.error("Failed to parse LLM JSON response:", llmRawResponse);
      return NextResponse.json({
        error: "LLM returned unparsable JSON. Try again."
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      extractedResumeText: resumeText,
      jobDescriptionReceived: jobDescription,
      llmSuggestions: llmSuggestions,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during processing.' },
      { status: 500 }
    );
  }
}