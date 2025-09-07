This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:


Compliance Copilot 🛡️🤖

Compliance Copilot is an AI-powered assistant that helps organizations streamline compliance tasks, reduce risk, and ensure adherence to regulatory frameworks (GDPR, HIPAA, SOC 2, ISO, etc.).

It combines RAG (Retrieval-Augmented Generation) with large language models to deliver accurate, auditable, and explainable compliance answers, document analysis, and workflow automation.

✨ Features

📑 Policy & Regulation Q&A — Ask compliance-related questions and get precise, cited answers.

🔎 Document Analysis — Upload policies, audit reports, or contracts and let Copilot extract obligations, risks, and gaps.

✅ Compliance Checklists — Auto-generate tailored checklists for standards like GDPR, HIPAA, or ISO 27001.

📊 Risk Insights Dashboard — Summarized view of compliance health across teams/projects.

🔐 Explainable AI — Sources and justifications are always cited for audit readiness.

🛠️ Custom Integrations — Plug into Slack, Jira, Confluence, or internal compliance tools.

🏗️ Architecture

Compliance Copilot is built with:

Frontend: Next.js + TailwindCSS + shadcn/ui

Backend: FastAPI (Python)

Database: PostgreSQL (compliance data, audit logs, caching)

AI Layer: RAG pipeline with vector database (Pinecone / Weaviate / pgvector) + LLM (OpenAI / Anthropic)

Deployment: Docker + AWS (ECS / EKS)

🚀 Getting Started
Prerequisites

Node.js (v18+)

Python 3.10+

PostgreSQL

Docker (optional but recommended)

API keys (LLM provider, vector DB, etc.) in .env file```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
