# Axo Longevity — Biomarker Intelligence

Upload any lab report PDF and instantly get a clear, AI-powered breakdown of every biomarker — translated to English, classified as **optimal**, **normal**, or **out of range** based on your age and sex.

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/axo-longevity-challenge
cd axo-longevity-challenge

# 2. Install dependencies
npm install

# 3. Add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env.local

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and upload the sample PDF.

> **Free API key:** Sign up at [console.groq.com](https://console.groq.com) — no credit card required.

---

## How It Works

```
User uploads PDF
      │
      ▼
POST /api/analyze
      │
      ├─ pdf-parse      → extract raw text (free, no API)
      │
      ├─ Groq API       → structured JSON via Llama 3.3 70B
      │   • Extract patient info (name, age, sex, dates)
      │   • Translate Spanish → English biomarker names
      │   • Standardize units
      │   • Parse reference ranges
      │
      └─ TypeScript classifier
          • Out of range  → outside lab's reference range
          • Normal        → within reference range
          • Optimal       → within evidence-based performance range
                │
                ▼
         Results dashboard
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI / NLP | Groq API (Llama 3.3 70B) |
| PDF parsing | pdf-parse |
| Icons | Lucide React |

---

## Classification Logic

Three-tier classification inspired by Axo's longevity-first philosophy:

| Status | Rule |
|---|---|
| 🟢 **Optimal** | Within evidence-based performance range (e.g. LDL <70, HbA1c <5.0%) |
| 🟡 **Normal** | Within the lab's reference range, but not in optimal zone |
| 🔴 **Out of Range** | Outside the lab's printed reference range |

Optimal ranges are adjusted per sex where clinically relevant (e.g. hemoglobin, hormones, creatinine).

---

## Production Deployment Plan

### AWS Architecture

```
                ┌──────────────────────────────────────┐
                │           CloudFront CDN              │
                │  (HTTPS, edge caching, global dist.)  │
                └──────────────┬───────────────────────┘
                               │
              ┌────────────────┴─────────────────┐
              │                                  │
     ┌────────▼────────┐              ┌──────────▼──────────┐
     │   S3 Bucket     │              │   API Gateway        │
     │ (Next.js static │              │ (POST /api/analyze)  │
     │  export / SSR)  │              └──────────┬──────────┘
     └─────────────────┘                         │
                                       ┌─────────▼─────────┐
                                       │   Lambda Function  │
                                       │  (pdf-parse +      │
                                       │   Groq API call +  │
                                       │   classifier)      │
                                       └───────────────────┘
```

| Service | Purpose |
|---|---|
| **S3** | Host Next.js static export; receive PDF uploads via presigned URLs |
| **Lambda** | Run the analyze function serverlessly (512MB memory, 30s timeout) |
| **API Gateway** | HTTP trigger for Lambda, handles CORS |
| **CloudFront** | CDN in front of S3 + API Gateway for global low-latency |

### With Supabase (full product)

- **Auth:** Supabase Auth for user sign-up / login
- **Database:** Postgres to store analysis history per user
- **Storage:** Supabase Storage for PDF files (GDPR-compliant EU region)
- **Row Level Security:** Each user only accesses their own results

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing / upload page
│   ├── results/page.tsx            # Results dashboard
│   └── api/analyze/route.ts        # PDF processing endpoint
├── components/
│   ├── upload/UploadZone.tsx       # Drag & drop upload
│   ├── results/
│   │   ├── PatientCard.tsx         # Patient info header
│   │   ├── SummaryStats.tsx        # Animated stat cards
│   │   ├── FilterBar.tsx           # Status filter + search
│   │   ├── CategorySection.tsx     # Collapsible category group
│   │   ├── BiomarkerRow.tsx        # Single biomarker row
│   │   └── RangeBar.tsx            # Visual range indicator
│   └── ui/
│       ├── GlassCard.tsx           # Glassmorphism card
│       └── StatusBadge.tsx         # Colored status pill
├── lib/
│   ├── pdf-parser.ts               # pdf-parse wrapper
│   ├── groq.ts                     # Groq API + prompt
│   ├── classifier.ts               # Classification logic
│   └── optimal-ranges.ts           # Evidence-based ranges
└── types/biomarker.ts              # All TypeScript interfaces
```

---

## Design Decisions

**Why Groq instead of OpenAI/Gemini?**
Groq is free (no credit card), globally available, and the Llama 3.3 70B model handles multilingual medical text extraction reliably. Gemini is blocked in certain regions; OpenAI requires a credit card.

**Why pdf-parse instead of a vision API?**
The sample report is text-based (not image-based), so text extraction is instant, free, and doesn't consume AI tokens for OCR. For image-based PDFs, the pipeline could fall back to a vision model.

**Why no database?**
This is a demo. Results are stored in `sessionStorage` for the session. A production system would persist results to Supabase Postgres with user auth.

**Optimal vs Normal — the distinction that matters**
Standard lab ranges tell you if something is *acceptable*. Optimal ranges reflect what the longevity literature says is *ideal for performance and healthspan* — tighter, evidence-based thresholds aligned with Axo's mission.
