# 🚀 AI Legal-Doc Simplifier
**Tagline:** Simplifying complex legal documents into easy-to-understand bullet points.

## 📌 Problem Statement
Legal jargon is hard for common people to understand. This app uses AI to summarize complex legal texts into simple language, saving time and money.

## ⚙️ Setup Instructions
1. Clone this repository to your local machine.
2. Create a `.env` file and copy the contents from `.env.example`.
3. Add your actual Supabase and AI API keys in the `.env` file.
4. Run `index.html` using a Local Live Server to test the application.
   
# Clarum - AI Legal Document Simplifier ⚖️

Clarum is an AI-powered SaaS tool designed to translate complex legal jargon (NDAs, Leases, Contracts, Terms of Service) into plain, easy-to-understand English bullet points for laymen.

## 🚀 Live Demo
https://legal-doc-ai-mock.vercel.app/

## 🛠️ Tech Stack (End-to-End Architecture)
- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend:** Vercel Serverless Functions (Node.js /api routes)
- **Database:** Supabase (PostgreSQL) REST API
- **AI Engine:** Google Gemini 3.5 Flash API
- **Deployment/Hosting:** Vercel

## ✨ Key Features & Hackathon Compliance
- **100% Secure Backend:** API keys (Gemini & Supabase) are strictly hidden using Vercel Environment Variables. No keys are exposed in the client-side HTML, strictly following hackathon security rules.
- **Instant AI Simplification:** Engineered prompt to act as an expert lawyer and break down heavy jargon into 3-4 simple bullet points.
- **Smart Formatting:** Custom regex-based markdown parser to render clean bold text and bullet points directly in the UI.
- **Database Integration:** Automatically saves the original legal text and the AI-generated summary to a Supabase database.
- **Premium UI/UX:** Built with Tailwind CSS, featuring loading skeletons, empty states, copy-to-clipboard functionality, and a session-based recent history list.

## 📱 The "Built-on-Phone" Challenge
*Note for Judges:* This entire full-stack project—including GitHub repository setup, database creation, serverless backend coding, AI integration, and live deployment—was built **100% using a smartphone** during a mock hackathon drill!
