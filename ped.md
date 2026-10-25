# MUALink — Product Requirements Document (PRD)
**Version:** 1.0
**Date:** October 2026
**Status:** Ready to Build

---

# TABLE OF CONTENTS

1. Product Overview
2. Problem Statement
3. User Personas
4. Goals & Success Metrics
5. Product Scope
6. User Flows
7. Feature Specifications
8. Database Schema
9. AI System Design
10. Tech Stack
11. Security
12. Error Handling
13. Build Timeline
14. Launch Plan
15. Future Roadmap
16. Definition of Done

---

# 1. PRODUCT OVERVIEW

| Field | Detail |
|---|---|
| Product Name | MUALink (working title) |
| Type | Web App (Mobile First PWA) |
| Users | Makeup Artists (MUAs) + Their Clients (Brides/Customers) |
| Core Value | MUA gets a shareable profile link → Bride fills a smart form → AI qualifies the lead → MUA gets a clean request card + WhatsApp ping |
| Business Model | 100% Free (V1) |
| Geography | India — Starting Delhi NCR |
| Language | English + Hinglish support |
| Platform | Web (PWA — works like an app on mobile) |

---

# 2. PROBLEM STATEMENT

## For MUAs:

Current Reality:
- Bride DMs on Instagram → MUA misses it
- Bride WhatsApps → MUA replies 6 hours later
- Back and forth for 2 days → No proper details collected
- No contract → No confirmation → MUA gets ghosted
- OR bride books someone else who replied faster

Specific Pains:
- No professional way to receive enquiries
- Leads come from 4–5 different places (Instagram DM, WhatsApp, calls, referrals)
- No record of who enquired, what they wanted, what date
- Manually typing same information repeatedly to every bride
- No way to quickly check if a date is already taken
- Looking unprofessional compared to bigger studios
- Spending 30–45 minutes per enquiry just on back and forth

## For Brides:

Current Reality:
- Find MUA on Instagram → Go to bio → WhatsApp number
- Send "Hi, are you available for [date]?"
- Wait 12–24 hours for reply
- Then back and forth for pricing, services, location
- Still don't know if MUA is right for her style/budget

Specific Pains:
- No way to see full service list and prices upfront
- Can't check availability without DMing
- No idea what information to give the MUA
- Process feels informal and uncertain

---

# 3. USER PERSONAS

## Persona 1 — The MUA

| Field | Detail |
|---|---|
| Name | Priyanka, 24 |
| Location | Lajpat Nagar, Delhi |
| Experience | 2 years freelance |
| Monthly Income | ₹40,000–₹70,000 |
| Bookings/Month | 8–15 |
| Tech Comfort | Instagram power user, basic WhatsApp |
| Current Tools | Instagram, WhatsApp, Google Calendar (sometimes) |
| Biggest Frustration | "I lose so many leads just because I couldn't reply fast enough" |
| Goal | Look professional, get more confirmed bookings, stop losing leads |

## Persona 2 — The Bride

| Field | Detail |
|---|---|
| Name | Sneha, 26 |
| Location | Gurgaon |
| Wedding Date | 3 months away |
| How She Finds MUAs | Instagram, Google, friend referral |
| Device | iPhone or mid-range Android |
| Biggest Frustration | "I message 5 MUAs and only 2 reply and I don't know who's best for me" |
| Goal | Find the right MUA, know the price, confirm the booking stress-free |

---

# 4. GOALS & SUCCESS METRICS

## Product Goals (V1 — First 3 Months):

| Goal | Target |
|---|---|
| MUAs who create profiles | 200+ |
| Bride requests submitted | 1,000+ |
| Profile links shared by MUAs | 400+ |
| Average form completion rate | 70%+ |
| WhatsApp click rate from MUA dashboard | 60%+ |
| System uptime | 99%+ |
| AI lead card generation success rate | 95%+ |

## North Star Metric:
Number of bride requests that result in MUA clicking "Reply on WhatsApp"
This means the product worked — lead came in, AI processed it, MUA found it valuable enough to act on it.

---

# 5. PRODUCT SCOPE

## IN SCOPE (V1):
- MUA signup and profile creation
- Public profile page with shareable link
- Bride enquiry form (multi-step)
- AI lead qualification and summary
- MUA dashboard with lead inbox
- WhatsApp click-to-chat notification
- Basic lead status management
- Mobile-first responsive design
- Image upload for portfolio

## OUT OF SCOPE (V1):
- Payment / booking fees
- In-app chat
- Calendar sync (Google Calendar)
- Instagram integration
- Reviews and ratings
- MUA search / discovery page
- SMS notifications
- Multiple team members per MUA
- Analytics dashboard

---

# 6. USER FLOWS

## Flow 1 — MUA Onboarding & Profile Creation

Step 1:  MUA lands on homepage
Step 2:  Clicks "Create My Profile — Free"
Step 3:  Signs up with email + password (Supabase Auth)
Step 4:  Email verification sent → MUA clicks verify
Step 5:  Onboarding wizard starts (can't skip)
Step 6:  Basic Info — name, city, phone, WhatsApp number
Step 7:  Bio — text area, 300 char max
Step 8:  Profile Photo + Logo Upload
Step 9:  Services Setup — name + description + price/custom quote toggle
Step 10: Portfolio Upload — up to 20 photos, tagged by look type
Step 11: Working Info — cities covered, working hours, travel yes/no
Step 12: Profile Preview shown
Step 13: "Your link is ready! → mualink.in/[username]"
Step 14: Share buttons — Copy Link / WhatsApp Share / Instagram Bio
Step 15: MUA lands on Dashboard

## Flow 2 — Bride Submits Request

Step 1:  Bride opens mualink.in/[mua-username]
Step 2:  Sees MUA's full profile page
Step 3:  Scrolls through photos, services, location, bio
Step 4:  Clicks "Request a Booking"
Step 5:  Multi-step form begins

         Screen 1: "Let's check if [MUA Name] is right for you!"
                   Enter name + WhatsApp number

         Screen 2: What's the occasion?
                   Bridal (Main Wedding) / Engagement / Pre-Wedding Shoot /
                   Reception / Party / Function / Other

         Screen 3: Which services do you need?
                   MUA's own services auto-loaded as checkboxes
                   If family makeup selected → "How many people?" spinner

         Screen 4: Event date (calendar picker)
                   Ready-by time (time picker)
                   Venue city / area (text input)

         Screen 5: Budget range (optional)
                   Under ₹5,000 / ₹5–10K / ₹10–20K / ₹20K+ / Prefer not to say

         Screen 6: Anything else?
                   Open text box (optional)
                   Upload inspiration photo (optional)

         Screen 7: Review screen — full summary shown → Bride confirms

Step 6:  "Submitted! [MUA Name] will get back to you on WhatsApp within 24 hours ✅"
Step 7:  Submission saved to Supabase immediately
Step 8:  AI processes lead in background
Step 9:  MUA gets WhatsApp click-to-chat ping
Step 10: MUA sees lead in dashboard

## Flow 3 — MUA Receives & Manages Lead

Step 1: MUA opens dashboard
Step 2: Sees new lead card with red dot (unread)
Step 3: Opens lead card — sees full bride details + AI summary + fit label
Step 4: Chooses action:
        Option A → Reply on WhatsApp (opens pre-filled chat)
        Option B → Mark Unavailable
        Option C → Archive
Step 5: Updates lead status:
        New → Replied → Quote Sent → Confirmed → Lost

---

# 7. FEATURE SPECIFICATIONS

## 7.1 Basic Info Section

| Field | Type | Required | Validation |
|---|---|---|---|
| Full Name | Text | YES | 2–60 chars |
| Username | Text | YES | 3–30 chars, unique, alphanumeric + underscore, auto-suggested from name |
| City | Text | YES | Free text |
| WhatsApp Number | Number | YES | 10 digit Indian number |
| Display Email | Email | NO | Valid email format |
| Bio | Textarea | YES | Max 300 characters with live counter |

## 7.2 Services Section

Each service has:

| Field | Type | Notes |
|---|---|---|
| Service Name | Text | E.g. "Bridal Makeup" |
| Short Description | Text | Max 100 chars |
| Price Type | Toggle | Fixed Price / Starting From / Custom Quote |
| Price Amount | Number | Only shown if not Custom Quote |
| Visible on Profile | Toggle | Can hide service temporarily |

Rules:
- Minimum 1 service required to publish profile
- Maximum 15 services
- MUA can reorder services by drag and drop
- Delete service = soft delete (stays in old lead data)

## 7.3 Portfolio Section

| Field | Detail |
|---|---|
| Max Photos | 20 |
| Accepted File Types | JPG, PNG, WEBP |
| Max Size Per Photo | 5MB (compressed on upload using Sharp) |
| Tags Per Photo | Bridal / Engagement / Party / HD / Airbrush / Hair / Other |
| Display Order | MUA can drag to reorder |
| Cover Photo | First photo is default cover, MUA can change |

## 7.4 Working Info Section

| Field | Type |
|---|---|
| Cities/Areas Served | Multi-text input (add as tags) |
| Travel Available | Toggle Yes/No |
| Working Days | Multi-select checkboxes (Mon–Sun) |
| Working Hours From | Time picker |
| Working Hours To | Time picker |
| Languages Spoken | Multi-select (Hindi / English / Punjabi / Other) |

## 7.5 Public Profile Page

What Bride Sees:

Header Section:
- Cover photo (full width, from first portfolio image)
- Profile photo (circular, overlapping cover)
- MUA name, City, Languages spoken
- "Request a Booking" CTA button (sticky at bottom on mobile)

Portfolio Section:
- Grid layout — 3 columns on desktop, 2 columns on mobile
- Tap/click to expand full screen
- Filter tabs by tag (All / Bridal / Party / Hair etc.)

Services Section:
- One card per service
- Service name + short description
- Price displayed or "Custom Quote" shown

About Section:
- Full bio text
- Working cities listed
- Working hours shown
- Travel availability shown (Yes/No)

Footer:
- "Request a Booking" button shown again

## 7.6 Bride Enquiry Form Rules

- No login or account required for bride — fully public
- Form saves progress to localStorage automatically
  (If bride refreshes or closes by mistake, answers are saved)
- One question per screen — mobile optimized
- Back button works on every screen without losing data
- Progress bar shown at top — "Step X of 7"
- WhatsApp number validated — must be 10 digit Indian number
- Date picker blocks all past dates
- If MUA has marked a date as unavailable:
  Show warning "This date may not be available — submit anyway and she'll confirm"
  But DO NOT block submission

## 7.7 MUA Dashboard

Tabs:
- New (with unread count badge)
- Replied
- Confirmed
- Archived

Lead Card — Collapsed View:
- Bride name
- Occasion type + services summary
- Event date + venue location + budget range
- Fit label with color coding
- "Open" button

Lead Card — Expanded View:
- Bride name + WhatsApp number
- Full event details (occasion, date, ready-by time, venue)
- All services requested
- Family member count (if applicable)
- Budget range
- Special notes (if any)
- Inspiration photo thumbnail (if uploaded) — tap to expand
- AI Summary paragraph
- Fit label (color coded) + reason text
- Suggested WhatsApp opener message
- "Copy Message" button
- "Reply on WhatsApp" button → opens wa.me link
- "Mark Unavailable" button
- "Archive" button
- Status dropdown → New / Replied / Quote Sent / Confirmed / Lost

## 7.8 WhatsApp Notification System (Zero API Cost)

When a new lead is submitted:

System auto-generates a click-to-chat URL:
https://wa.me/91[MUA_WHATSAPP]?text=🔔 New Booking Request! From: [Bride Name] | [Occasion] | [Date] | [Location] | Budget: [Budget] | Open your MUALink dashboard to see full details and reply.

This link is shown as a prominent button in the MUA dashboard notification banner.

How it works:
- MUA taps the button
- WhatsApp opens on their phone
- Pre-filled message to themselves is ready
- MUA presses Send
- Saved in their own WhatsApp as a reminder

Why this is the right approach:
- Cost = ₹0
- No WhatsApp Business API approval needed
- No third-party platform subscription
- Works on any Android or iPhone
- MUA can also forward the message to an assistant

---

# 8. DATABASE SCHEMA

## Table: muas

| Column | Type | Notes |
|---|---|---|
| id | uuid | PRIMARY KEY, auto generated |
| email | text | UNIQUE, NOT NULL |
| username | text | UNIQUE, NOT NULL, 3-30 chars |
| full_name | text | NOT NULL |
| city | text | |
| bio | text | Max 300 chars |
| whatsapp | text | 10 digit number |
| profile_photo | text | Supabase storage URL |
| logo_url | text | Supabase storage URL |
| working_days | text[] | Array e.g. ["Monday","Saturday"] |
| working_from | time | e.g. 08:00 |
| working_to | time | e.g. 20:00 |
| service_cities | text[] | Array of city/area strings |
| travel_available | boolean | DEFAULT false |
| languages | text[] | Array e.g. ["Hindi","English"] |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |
| is_active | boolean | DEFAULT true |

## Table: services

| Column | Type | Notes |
|---|---|---|
| id | uuid | PRIMARY KEY |
| mua_id | uuid | REFERENCES muas(id) |
| name | text | NOT NULL |
| description | text | Max 100 chars |
| price_type | text | fixed / starting_from / custom_quote |
| price_amount | numeric | Null if custom_quote |
| is_visible | boolean | DEFAULT true |
| display_order | integer | For drag reorder |
| created_at | timestamp | Auto |

## Table: portfolio_photos

| Column | Type | Notes |
|---|---|---|
| id | uuid | PRIMARY KEY |
| mua_id | uuid | REFERENCES muas(id) |
| photo_url | text | NOT NULL, Supabase storage URL |
| tag | text | bridal/engagement/party/hd/airbrush/hair/other |
| display_order | integer | For drag reorder |
| is_cover | boolean | DEFAULT false |
| created_at | timestamp | Auto |

## Table: leads

| Column | Type | Notes |
|---|---|---|
| id | uuid | PRIMARY KEY |
| mua_id | uuid | REFERENCES muas(id) |
| bride_name | text | NOT NULL |
| bride_whatsapp | text | NOT NULL |
| occasion_type | text | NOT NULL |
| services_requested | text[] | NOT NULL |
| family_count | integer | DEFAULT 0 |
| event_date | date | NOT NULL |
| ready_by_time | time | |
| venue_location | text | |
| budget_range | text | |
| special_notes | text | |
| inspiration_photo | text | Supabase storage URL |
| ai_summary | text | Generated by Groq |
| ai_fit_label | text | good_fit / needs_review / not_a_fit / unreviewed |
| ai_fit_reason | text | Generated by Groq |
| ai_whatsapp_opener | text | Generated by Groq |
| status | text | DEFAULT 'new' |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |

## Table: unavailable_dates

| Column | Type | Notes |
|---|---|---|
| id | uuid | PRIMARY KEY |
| mua_id | uuid | REFERENCES muas(id) |
| date | date | NOT NULL |
| reason | text | Optional internal note |
| created_at | timestamp | Auto |

## Row Level Security (RLS) Rules

muas table:
- SELECT: Anyone can read a MUA profile (needed for public profile page)
- UPDATE/DELETE: Only the authenticated MUA who owns the row

services table:
- SELECT: Anyone can read services (needed for bride form)
- INSERT/UPDATE/DELETE: Only the MUA who owns them

portfolio_photos table:
- SELECT: Anyone can read (needed for public profile)
- INSERT/UPDATE/DELETE: Only the MUA who owns them

leads table:
- SELECT: Only the MUA who owns the lead
- INSERT: Anyone (bride submitting a form — no login required)
- UPDATE: Only the MUA who owns the lead
- DELETE: Only the MUA who owns the lead

unavailable_dates table:
- SELECT: Public (needed to show warning on bride form)
- INSERT/UPDATE/DELETE: Only the MUA who owns them

---

# 9. AI SYSTEM DESIGN

## Model Choice: Groq API — Llama 3.3 70B

Why Groq:
- Fastest LLM inference available in 2026 (200+ tokens/second)
- Free tier: 14,400 requests/day, 30 requests/minute
- At 10 concurrent users = max 10 RPM — well within free limits
- No credit card required to start
- JSON mode supported — reliable structured output

## Full AI System Prompt

You are an assistant for Indian makeup artists (MUAs).
Your job is to analyze a bride's booking request and
give the MUA a quick, useful summary.

You will receive:
- Bride's request details (occasion, services, date, location, budget, notes)
- MUA's profile data (services offered, cities covered, working days, price range)

You must return ONLY a JSON object with these exact fields:

{
  "summary": "2-3 sentence plain English summary of what the bride needs",
  "fit_label": "good_fit OR needs_review OR not_a_fit",
  "fit_reason": "1-2 sentences explaining exactly why this label was given",
  "missing_info": ["array of important missing details if any, else empty array"],
  "suggested_whatsapp_opener": "A warm, professional opening message in Hinglish or English that the MUA can send to the bride. Max 3 sentences. Should feel personal not robotic."
}

Fit Label Rules:
- good_fit: Location is in MUA's service area AND services match AND date is a working day for MUA
- needs_review: One thing is unclear — budget not shared, location slightly outside area, or only some services match
- not_a_fit: Date is marked unavailable AND location is way outside service area AND services don't match

Additional Rules:
- If budget is not shared by bride — do NOT use this to lower the fit score
- Be concise and practical — MUA is busy, make it scannable
- Use simple language — no jargon
- Suggested opener should feel warm and human, not like a template
- Only return the JSON object — no extra text before or after

## AI Fallback Logic (Critical)

Priority Rule: The lead MUST reach the MUA even if AI fails.

Step 1: Bride submits form
Step 2: Lead is saved to Supabase database IMMEDIATELY (before any AI call)
Step 3: AI processing starts in background queue
Step 4: If AI responds within 10 seconds → update lead with AI data
Step 5: If AI times out or errors → mark lead as ai_fit_label = "unreviewed"
Step 6: MUA sees full lead card regardless — AI section just shows "AI review pending"
Step 7: Background job retries AI processing after 5 minutes
Step 8: If retry succeeds → lead card updated silently

## Queue System to Prevent Rate Limit Errors

The problem: If 10 brides submit forms at the exact same moment,
that's 10 simultaneous Groq API calls. At 30 RPM this is fine,
but if 35 submit in one minute we hit a 429 error.

The solution: A simple queue that processes one AI job every 2 seconds.
This means max 30 AI calls per minute — exactly at the free tier limit.

```javascript
// Queue system — runs on your Next.js server
const aiQueue = [];
let isProcessing = false;

export async function addLeadToAIQueue(leadId, leadData, muaData) {
  aiQueue.push({ leadId, leadData, muaData });
  if (!isProcessing) {
    processAIQueue();
  }
}

async function processAIQueue() {
  isProcessing = true;
  
  while (aiQueue.length > 0) {
    const job = aiQueue.shift();
    
    try {
      const aiResult = await callGroqAPI(job.leadData, job.muaData);
      await updateLeadWithAIResult(job.leadId, aiResult);
    } catch (error) {
      await markLeadAsUnreviewed(job.leadId);
      console.error('AI processing failed for lead:', job.leadId, error);
    }
    
    // Wait 2 seconds between calls = safe at 30 RPM free limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  isProcessing = false;
}

async function callGroqAPI(leadData, muaData) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(leadData, muaData) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500
    }),
    signal: AbortSignal.timeout(10000) // 10 second timeout
  });
  
  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }
  
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
function buildUserPrompt(leadData, muaData) {
  return `
BRIDE REQUEST:
- Name: ${leadData.bride_name}
- Occasion: ${leadData.occasion_type}
- Services Needed: ${leadData.services_requested.join(', ')}
- Family Members for Makeup: ${leadData.family_count || 0}
- Event Date: ${leadData.event_date}
- Ready By: ${leadData.ready_by_time || 'Not specified'}
- Venue Location: ${leadData.venue_location}
- Budget: ${leadData.budget_range || 'Not shared'}
- Special Notes: ${leadData.special_notes || 'None'}

MUA PROFILE:
- Services Offered: ${muaData.services.map(s => s.name).join(', ')}
- Cities/Areas Served: ${muaData.service_cities.join(', ')}
- Working Days: ${muaData.working_days.join(', ')}
- Working Hours: ${muaData.working_from} to ${muaData.working_to}
- Starting Prices: ${muaData.services.map(s => `${s.name}: ${s.price_type === 'custom_quote' ? 'Custom Quote' : '₹' + s.price_amount}`).join(', ')}

Analyze this request and return the JSON response.
  `;
}
10. TECH STACK
Frontend
Tool	Purpose	Cost
Next.js 14 (App Router)	Full stack React framework	Free
Tailwind CSS	Utility-first styling	Free
shadcn/ui	Pre-built accessible UI components	Free
React Hook Form	Form state management	Free
Zod	Schema validation for all forms	Free
Zustand	Lightweight global state management	Free
Lucide React	Icon library	Free
date-fns	Date formatting and manipulation	Free
Backend
Tool	Purpose	Cost
Next.js API Routes	Serverless backend functions	Free
Supabase	PostgreSQL database + Auth + Storage	Free tier
Groq API	AI processing via Llama 3.3 70B	Free tier
Sharp	Server-side image compression	Free
Hosting & Infrastructure
Tool	Purpose	Cost
Vercel	Frontend + API hosting	Free (personal/hobby)
Supabase	Database + file storage hosting	Free tier
Supabase Storage	Portfolio images + inspiration photos	Free — 1GB included
Free Tier Limits vs Your Usage
Service	Free Limit	Your Expected Usage at MVP	Safe?
Supabase DB	500MB storage, 50K MAU	200 MUAs, light data	YES
Supabase Storage	1GB	200 MUAs x avg 20 photos x avg 200KB = 800MB	YES (close, monitor)
Groq API	14,400 req/day, 30 RPM	100 leads/day max at MVP	YES
Vercel	100GB bandwidth/month	Very low at MVP scale	YES
Total Monthly Infrastructure Cost at MVP = ₹0

11. SECURITY
Data Protection
Concern	Solution
MUA can only see their own leads	Row Level Security (RLS) enabled on Supabase for all tables
Bride form spam / bot submissions	Rate limit by IP — max 5 submissions per IP per hour via middleware
Malicious image uploads	File type whitelist (JPG/PNG/WEBP only) + 5MB size limit + Supabase handles storage
Username squatting on reserved words	Blocklist: admin, support, api, login, signup, dashboard, help, mualink, www
MUA WhatsApp number privacy	Number stored in DB but NEVER displayed on public profile page
API key security	All keys (Groq, Supabase service role) stored in server-only environment variables, never exposed to frontend
Supabase anon key exposure	Anon key is intentionally public — RLS rules protect all data at row level
Username enumeration	Profile page returns same 404 for non-existent and deactivated profiles
Environment Variables (Never Commit to Git)
text

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (server only)
GROQ_API_KEY=your_groq_key (server only)
12. ERROR HANDLING
All Possible Error Scenarios & Responses
Scenario	User Impact	What Happens
AI API fails completely	MUA gets lead without AI section	Lead saved first. ai_fit_label set to "unreviewed". Retry in 5 min. MUA still sees full lead.
AI takes longer than 10 seconds	Same as above	Timeout triggered. Fallback applied.
Image upload fails	Photo not added but profile saves	Error toast: "Photo upload failed — your other info was saved. Try uploading again."
Bride form submission fails (network)	Bride sees error but data is safe	Data saved in localStorage. Toast: "Submission failed — your answers are saved. Please try again."
Username already taken	MUA sees conflict instantly	Real-time availability check while typing. Show: "This username is taken" + suggest alternatives like name + city
Supabase is down	Both MUA and bride affected	Static error page shown with message and direct WhatsApp contact fallback for bride
Slow 2G/3G connection (common in India)	Slow experience	Skeleton loading screens everywhere. Form works with localStorage offline. Submits automatically when connection returns.
MUA uploads more than 20 photos	Upload blocked	Show counter "14/20 photos added". Upload button disabled at 20.
Bride picks a past date	Form blocked	Date picker disables all past dates. Cannot be selected.
Invalid WhatsApp number entered	Form blocked	Real-time validation. "Please enter a valid 10-digit Indian mobile number" shown inline.
Toast Notification System
Use these 4 toast types consistently:

SUCCESS (green): "Profile saved!", "Request submitted!", "Status updated"
ERROR (red): "Upload failed", "Submission failed — your data is saved"
WARNING (yellow): "This date may already be booked — MUA will confirm"
INFO (blue): "AI summary is being generated, check back in a moment"
13. BUILD TIMELINE
Week 1 — Foundation (Days 1–7)
Day 1–2:

Create Supabase project
Run full schema SQL (all 5 tables)
Enable RLS and write all policies
Create storage buckets (portfolio-photos, inspiration-photos)
Set up Next.js 14 project with Tailwind + shadcn/ui
Configure Supabase client (server + client side)
Set up environment variables
Day 3–4:

MUA signup page (email + password)
Email verification flow
Supabase Auth integration
Protected route middleware (dashboard requires login)
Onboarding wizard — Step 1: Basic Info + Step 2: Bio
Day 5–7:

Onboarding wizard — Step 3: Profile photo + logo upload
Onboarding wizard — Step 4: Services (add/edit/delete/reorder)
Onboarding wizard — Step 5: Portfolio upload (20 photos, tags, reorder)
Onboarding wizard — Step 6: Working info (cities, days, hours, travel)
Onboarding wizard — Step 7: Preview + publish + link shown
Public profile page — read-only, no form yet
Week 2 — Bride Flow (Days 8–14)
Day 8–9:

Bride form — Screen 1: Name + WhatsApp (with validation)
Bride form — Screen 2: Occasion type (radio cards)
Bride form — Screen 3: Services (checkboxes from MUA data + family count)
localStorage save on every screen change
Day 10–11:

Bride form — Screen 4: Date picker + time picker + venue text
Bride form — Screen 5: Budget range (radio)
Bride form — Screen 6: Notes + inspiration photo upload
Bride form — Screen 7: Full review screen + submit button
Form submission → save to leads table in Supabase
Confirmation screen shown to bride
Day 12–14:

Groq API integration
System prompt finalization
User prompt builder function
Queue system implementation
AI result saved back to lead in Supabase
Fallback and retry logic
Test AI with 10 sample lead submissions
Week 3 — Dashboard (Days 15–21)
Day 15–16:

MUA dashboard layout
Lead inbox with 4 tabs (New / Replied / Confirmed / Archived)
Unread count badges on tabs
Lead cards — collapsed view with all key info
Day 17–18:

Lead card — expanded view with all details
AI summary section display
Fit label with color coding (green/yellow/red)
Suggested WhatsApp opener with copy button
Inspiration photo thumbnail + full screen expand
Day 19–20:

WhatsApp click-to-chat URL generator
"Reply on WhatsApp" button functionality
"Mark Unavailable" action
"Archive" action
Status dropdown (New → Replied → Quote Sent → Confirmed → Lost)
Day 21:

MUA profile edit page (update bio, services, photos, working info)
Username change flow (with availability check)
Account settings page (change email, change password)
Week 4 — Polish & Testing (Days 22–28)
Day 22–23:

Full mobile responsiveness audit (test on Android Chrome + iPhone Safari)
Fix all layout issues on small screens
Sticky "Request a Booking" button on mobile profile page
Touch-friendly tap targets (minimum 44px)
Day 24–25:

All error states implemented (network fail, upload fail, AI fail)
All loading states implemented (skeleton screens)
Toast notification system
localStorage offline form behavior tested
Day 26–27:

Image compression via Sharp on upload
Lazy loading for portfolio images
Page speed audit (target: under 3 seconds on 4G)
Supabase query optimization (add indexes on mua_id, event_date, status)
Day 28:

End-to-end test with 5 real MUAs in Delhi NCR
Watch them create profiles (target: under 10 minutes)
Submit 5 test bride requests (target: under 3 minutes each)
Collect feedback on biggest friction points
Fix top 3 issues before soft launch
14. LAUNCH PLAN
Phase 1 — Pre-Launch Testing (Week 5)
Goals:

Validate that real MUAs can create profiles without getting stuck
Validate that real brides can submit requests on mobile without errors
Identify and fix top friction points before public launch
Actions:

DM 10 MUAs in Delhi NCR directly on Instagram
Offer to help them set up their profile in a 15-minute call
Watch the screen share — note every moment they pause or get confused
Ask 5 friends or contacts to act as brides and submit test requests
Fix the top 3 issues found before moving to Phase 2
Success Signal: At least 7 of 10 MUAs successfully publish their profile without help

Phase 2 — Soft Launch (Week 6)
Goals:

Get first 50 real MUA signups
Get first 100 bride requests submitted
Actions:

Post in Delhi NCR MUA Facebook groups Sample post: "I built a free tool for makeup artists — you get a professional link to share on Instagram. Brides fill in all their details and you get a clean request on WhatsApp. Takes 10 minutes to set up. Completely free. Link in comments."
Share in MUA WhatsApp communities
Create one short Instagram reel (30 seconds): Show: MUA opens app → profile looks beautiful → bride opens link → fills form → MUA gets WhatsApp ping
Ask those first 10 MUAs from Phase 1 to share their profile link on their Instagram story
Success Signal: 50 MUA signups + 100 bride requests within 2 weeks of soft launch

Phase 3 — Organic Growth (Month 2 Onwards)
Core Growth Loop:

MUA creates profile
MUA shares mualink.in/her-username in her Instagram bio
Bride visits her page, sees the tool
Bride submits request
Bride tells her friends about the professional experience
Friends look for MUAs → other MUAs with MUALink profiles come up
New MUAs hear about the tool from brides or other MUAs → sign up
Actions:

Build a simple landing page at mualink.in explaining what it is for MUAs who don't know about it yet
Track which MUAs are getting the most bride requests — share their success as case studies
Every bride who uses the form sees "Powered by MUALink" at the bottom → free brand awareness
Target: 200 MUA profiles live by end of Month 2

15. FUTURE ROADMAP
V2 Features (Month 3–6)
Feature	Why
MUA availability calendar (mark dates as blocked)	Prevents wrong-date requests, saves MUA time
AI-generated bridal proposal PDF	MUAs can send a professional quote PDF in one click
Google Calendar sync	Automatically block dates from Google Calendar
Review system for brides	Social proof builds MUA trust
MUA can reply to leads inside dashboard	Keep full conversation in one place
V3 Features (Month 6–12)
Feature	Why
MUA discovery page (search by city, style, price)	Organic traffic from brides searching for MUAs
Instagram portfolio auto-sync	Keep portfolio fresh without manual uploads
Analytics dashboard for MUAs	Show views, enquiries, conversion rate
Team accounts (MUA + assistant)	Studios with multiple artists
Monetization — Premium plan	Unlock advanced features for paying MUAs
Monetization Plan (V3 Only — Free Forever in V1 and V2)
Premium Plan ideas:

Custom domain: priyankamua.com instead of mualink.in/priyanka
Remove "Powered by MUALink" branding
Unlimited photo uploads (V1 cap: 20)
Advanced analytics (who viewed, which city, what services most requested)
Priority AI processing (no queue)
Multiple service packages (bundle offers)
Suggested price: ₹299–₹499/month per MUA

At 1,000 paying MUAs = ₹3–5 Lakh/month recurring revenue

16. DEFINITION OF DONE (V1)
A feature is only considered complete when ALL of these pass:

Functional Requirements
 Works correctly on mobile Chrome (Android) — primary device for Indian users
 Works correctly on mobile Safari (iPhone)
 Works correctly on desktop Chrome
 All form validations work and show clear error messages
 All success states show appropriate confirmation
 All data saves correctly to Supabase
Reliability Requirements
 AI failure does NOT block lead from appearing in MUA dashboard
 Bride form data is never lost on page refresh (localStorage)
 Image upload failure does not block profile creation
 All API errors are caught and handled gracefully — no white screen of death
 Network timeout handled with retry prompt
Performance Requirements
 Profile page loads in under 3 seconds on 4G connection
 Bride form screens transition instantly (no loading between screens)
 Portfolio images are compressed before upload
 Portfolio images load lazily (only when scrolled into view)
User Experience Requirements
 MUA can create a complete profile in under 10 minutes
 Bride can submit a full request in under 3 minutes
 WhatsApp click-to-chat opens correctly and pre-fills message on mobile
 All tap targets are at least 44px tall (mobile touch friendly)
 Loading states shown everywhere (no blank screens while waiting)
Testing Requirements
 Tested with at least 2 real MUAs creating real profiles
 Tested with at least 2 real brides submitting real requests
 Tested on at least 3 different Android devices
 Tested on at least 1 iPhone
 AI lead card tested with 10 different lead combinations
ONE PAGE SUMMARY
Field	Detail
PRODUCT	MUALink
FOR	Indian Makeup Artists — Starting Delhi NCR
PROBLEM	MUAs lose leads because enquiries are messy, slow, and scattered across Instagram and WhatsApp
SOLUTION	A shareable profile link where brides submit structured requests → AI qualifies the lead → MUA gets a clean lead card + WhatsApp ping
HOW IT WORKS	MUA creates profile in 10 min → Gets a link → Shares on Instagram bio → Bride opens link → Fills 7-screen form → AI generates lead card → MUA reviews and replies
COST TO BUILD	₹0 — Groq free tier + Supabase free tier + Vercel free tier
COST TO RUN	₹0 at MVP scale (under 200 MUAs, under 1000 leads/month)
TECH STACK	Next.js 14 + Supabase + Groq API (Llama 3.3 70B) + Tailwind CSS + shadcn/ui
BUILD TIME	4 weeks solo
LAUNCH TARGET	50 MUA signups in Month 1, 200 by Month 2
MONETIZE	Free forever in V1 and V2. Premium plan in V3 at ₹299–₹499/month
REVENUE TARGET	1,000 paying MUAs in V3 = ₹3–5 Lakh/month recurring
