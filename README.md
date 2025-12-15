# Falcon University Admission Pre-Assessment System

> An intelligent, LLM-powered chatbot system for automated university admission eligibility screening

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://falcon-admission.vercel.app)
[![Backend](https://img.shields.io/badge/backend-deployed-blue)](https://falcon-backend-ypgb.onrender.com/health)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [Product Thinking Questions](#product-thinking-questions)
- [Demo](#demo)

---

## 🎯 Overview

The Falcon University Admission Pre-Assessment System is a lightweight web application that simulates an admission officer using AI to guide prospective students through a chat-based eligibility check. The system:

1. **Uploads admission requirements** from PDF documents
2. **Conducts automated interviews** via LLM-powered chat interface
3. **Evaluates applicants** against requirements using RAG and rule-based logic
4. **Provides instant feedback** on admission eligibility
5. **Maintains comprehensive records** of all interviews

**Live Demo:** [https://falcon-admission.vercel.app](https://falcon-admission.vercel.app)

---

## ✨ Features

### Admin Dashboard
- 📤 **PDF Upload** - Upload admission requirements with drag-and-drop
- 📊 **Statistics Dashboard** - Real-time applicant analytics
- 📋 **Results Management** - View, filter, and manage all applicants
- 👁️ **Transcript Viewer** - Full conversation history with details
- 🔗 **Interview Session Creation** - Generate shareable interview links

### Student Interview Interface
- 💬 **AI-Powered Chat** - Natural conversation with LLM
- 📝 **Guided Questions** - Context-aware question generation
- ✅ **Real-time Evaluation** - Automated eligibility checking
- 📄 **Comprehensive Assessment** - Covers all 10 requirements from KB
- 🎯 **Instant Results** - Immediate feedback on eligibility

### Technical Features
- 🤖 **RAG Implementation** - Retrieval-Augmented Generation for context
- 🧠 **Multiple LLM Support** - OpenAI GPT-4o, Groq Llama, or Gemini
- 📚 **Dynamic KB Parsing** - Adapts to any uploaded requirements PDF
- 🔒 **Secure** - Input validation, error handling, CORS protection
- ⚡ **Fast** - Optimized database queries and caching
- 📱 **Responsive** - Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API
- **UI Components:** Custom components with Lucide icons
- **Notifications:** react-hot-toast
- **Date Handling:** date-fns

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **LLM:** OpenAI GPT-4o / Groq Llama 3.1 / Google Gemini
- **PDF Processing:** pdf-parse
- **Embeddings:** Google Gemini text-embedding-004
- **Validation:** Joi
- **Logging:** Winston

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** MongoDB Atlas
- **Version Control:** Git/GitHub

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js/Vercel)       │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │Admin Dashboard│  │Interview Chat UI│ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
                    │
              REST API (HTTPS)
                    │
┌─────────────────────────────────────────┐
│      Backend (Express.js/Render)        │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │PDF Parser│  │LLM Service│  │RAG    │ │
│  └──────────┘  └──────────┘  └───────┘ │
└─────────────────────────────────────────┘
          │                    │
    ┌─────────────┐   ┌───────────────┐
    │MongoDB Atlas│   │OpenAI/Gemini  │
    │(Database)   │   │(LLM + Vectors)│
    └─────────────┘   └───────────────┘
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- OpenAI API key OR Groq API key (free)
- Git

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/rmyzm/falcon-admission.git
cd falcon-admission
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-user:password@cluster.mongodb.net/falcon-admission
OPENAI_API_KEY=sk-proj-your-key-here
GEMINI_API_KEY=AIza-your-key-here
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
LOG_LEVEL=info
EOF

# Create required directories
mkdir -p uploads logs

# Start backend
npm run dev
```

**Expected output:**
```
✅ MongoDB Atlas connected successfully
Server running on port 5000
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start frontend
npm run dev
```

**Expected output:**
```
✓ Ready in 2.1s
- Local: http://localhost:3000
```

#### 4. Access Application

- **Admin Dashboard:** http://localhost:3000/admin
- **Backend API:** http://localhost:5000

---

## 🚢 Deployment

### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory:** `frontend`
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
     ```
   - Deploy

### Backend (Render)

1. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - New Web Service → Connect GitHub repo
   - Set **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

2. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_atlas_connection_string
   OPENAI_API_KEY=your_api_key
   GEMINI_API_KEY=your_api_key
   FRONTEND_URL=https://your-app.vercel.app
   ```

3. **Update Backend CORS**
   ```typescript
   // backend/src/server.ts
   cors({
     origin: [
       'http://localhost:3000',
       'https://your-app.vercel.app'
     ],
     credentials: true
   })
   ```

4. **Commit and push** - Render auto-redeploys

---

## 📚 Product Thinking Questions

### 1. How would you scale this system to handle 10,000+ concurrent interviews?

**Current Architecture Limitations:**
- Single Express.js server with in-memory session handling
- Sequential LLM API calls causing bottlenecks
- MongoDB connection pool limits
- No caching layer

**Scaling Solutions:**

**a) Horizontal Scaling**
- Deploy multiple backend instances behind a load balancer (AWS ALB/ELB)
- Use Redis for distributed session management
- Implement sticky sessions for maintaining conversation context
- Auto-scaling based on CPU/memory metrics

**b) Optimize LLM Calls**
- Implement request queuing with Bull/Redis
- Batch similar requests when possible
- Cache common greeting/closing messages
- Use faster models (GPT-4o-mini) for non-critical tasks
- Implement rate limiting per user to prevent abuse

**c) Database Optimization**
- MongoDB sharding for horizontal scalability
- Read replicas for analytics/reporting queries
- Implement database connection pooling (current: default, scale to 100+)
- Add Redis caching layer for frequently accessed data (knowledge base, statistics)
- Index optimization for fast queries

**d) Infrastructure**
- Move to Kubernetes for container orchestration
- Use CDN (CloudFront) for static assets
- Implement message queues (RabbitMQ/AWS SQS) for async processing
- Separate services: Chat Service, Evaluation Service, Admin Service

**Estimated Cost at Scale:**
- 10,000 concurrent users
- AWS EKS: ~$200-300/month
- MongoDB Atlas M30: ~$150/month
- OpenAI API: ~$500/month (assuming 100k interviews)
- Total: ~$1,000/month

---

### 2. What metrics would you track to measure success?

**User Engagement Metrics:**
- Interview completion rate (target: >80%)
- Average time per interview (current: ~3-5 minutes)
- Drop-off rate at each question (identify friction points)
- Retry rate (students starting multiple sessions)
- User satisfaction score (post-interview survey)

**System Performance Metrics:**
- Response time per API call (target: <2 seconds)
- LLM latency (target: <1 second for questions, <3 for evaluation)
- Database query performance (target: <200ms)
- Uptime (target: 99.9%)
- Error rate (target: <0.1%)

**Business Metrics:**
- Number of qualified applicants (meets criteria %)
- Conversion rate (chat → full application)
- Cost per interview (LLM + infrastructure)
- Support ticket reduction (vs manual screening)
- Time saved vs manual review (hrs/week)

**Quality Metrics:**
- Evaluation accuracy (compare with human review)
- False positive rate (<5%)
- False negative rate (<2%)
- Question relevance score (user feedback)
- Transcript completeness (all required data collected)

**Implementation:**
```typescript
// Track in MongoDB
interface Analytics {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  questionsAsked: number;
  dropOffPoint?: string;
  outcome: string;
  llmCalls: number;
  llmLatency: number[];
  errors: Error[];
}
```

---

### 3. How would you handle edge cases (unclear answers, incomplete data)?

**Current Implementation:**
- Rule-based extraction with regex patterns
- Falls back to LLM for ambiguous cases
- Requires specific formats (e.g., "SAT 1450")

**Enhanced Edge Case Handling:**

**a) Unclear Answers**
```typescript
// Example: "I think it was around 1400"
Bot: I want to make sure I have the correct information. 
     Was your SAT score exactly 1400, or a different number?
Student: 1420
Bot: ✅ Thank you for clarifying!

// Implementation:
if (confidence < 0.7) {
  askClarifyingQuestion();
}
```

**b) Multiple Valid Formats**
```typescript
// Handle variations:
"3.9" → GPA ✅
"My GPA is 3.9" → GPA ✅
"I have a 3.9 GPA" → GPA ✅
"3.9 out of 4.0" → GPA ✅

// Use LLM for extraction when regex fails:
const extracted = await extractWithLLM(userMessage, expectedField);
```

**c) Incomplete Data Recovery**
```typescript
// Save partial sessions
if (userDisconnects) {
  saveProgress();
  sendResumeLink();
}

// Resume capability
Bot: Welcome back! I see we were discussing your test scores. 
     Would you like to continue where we left off?
```

**d) Validation and Confirmation**
```typescript
// Confirm critical data
Bot: Just to confirm - your GPA is 3.9 and SAT score is 1450. Is that correct?
Student: Yes
Bot: ✅ Perfect!

// Detect inconsistencies
if (gpa === 3.9 && sat === 800) { // Too low for high GPA
  Bot: I notice your SAT score seems unusually low for your GPA. 
       Could you double-check that score?
}
```

**e) Fallback Mechanisms**
```typescript
// If extraction fails 3 times
if (attempts >= 3) {
  Bot: I'm having trouble understanding the format. 
       Could you provide just the number? For example, type: 1450
}

// Provide examples
Bot: Please provide your SAT score (e.g., 1450, 1200, or 1380)
```

**f) Partial Eligibility**
```typescript
// Handle students close to requirements
if (gpa === 3.29 && required === 3.3) {
  outcome = "Criteria Not Met";
  message += "\nNote: You're very close! Consider retaking courses to raise your GPA by 0.01 points.";
}
```

---

### 4. What privacy/security considerations are important?

**Current Implementation:**
- Basic input validation
- MongoDB secure connection
- No authentication (mock project)

**Production-Level Security Requirements:**

**a) Data Privacy (FERPA Compliance)**
```typescript
// PII Encryption
- Encrypt student names, contact info at rest
- Use AES-256 encryption for sensitive fields
- Tokenize identifiers for analytics

// Data Retention
- Auto-delete incomplete sessions after 30 days
- Allow students to request data deletion (GDPR)
- Anonymize data for analytics after 90 days

// Access Control
- Admin authentication with role-based permissions
- Audit logs for all data access
- IP whitelisting for admin dashboard
```

**b) Authentication & Authorization**
```typescript
// Admin Dashboard
- JWT-based authentication
- Session management with secure httpOnly cookies
- Multi-factor authentication for admin access
- Role-based permissions (super admin, reviewer, analyst)

// Student Sessions
- Secure session tokens
- Rate limiting per IP (prevent abuse)
- CAPTCHA for bot protection
```

**c) Data Transmission Security**
```typescript
// HTTPS Only
- Force SSL/TLS encryption
- HSTS headers
- Secure WebSocket connections for real-time chat

// API Security
- API key rotation every 90 days
- Request signing for critical operations
- Input sanitization for XSS/SQL injection prevention
```

**d) LLM Security**
```typescript
// Prompt Injection Prevention
- Sanitize user inputs before sending to LLM
- System prompts with injection safeguards
- Output validation and filtering

// Data Leakage Prevention
- Don't include other students' data in context
- Clear conversation context between sessions
- Avoid logging sensitive PII
```

**e) Compliance & Legal**
```typescript
// Implement:
- FERPA compliance for educational records
- GDPR compliance for EU applicants
- CCPA compliance for California residents
- Terms of service and privacy policy
- Cookie consent management
- Data processing agreements with vendors (OpenAI, MongoDB)
```

**f) Monitoring & Incident Response**
```typescript
// Security Monitoring
- Real-time anomaly detection
- Failed authentication attempts tracking
- Unusual data access patterns
- Automated alerts for security events

// Incident Response Plan
- Data breach notification procedures
- Backup and disaster recovery (RPO: 1 hour, RTO: 4 hours)
- Penetration testing (quarterly)
- Security audit logs (retained 1 year)
```

---

### 5. How would you improve the user experience?

**Current UX:**
- Basic chat interface
- Sequential question flow
- Text-only interaction

**Enhanced UX Improvements:**

**a) Conversational Flow**
```typescript
// More natural conversation
Instead of: "What is your GPA?"
Use: "Great! And how has your academic performance been? 
      Could you share your current GPA?"

// Contextual responses
Student: "My SAT was pretty good"
Bot: "That's great to hear! What was your exact score?"

// Empathetic messaging
If low score: "Thank you for sharing. While this score doesn't 
               meet our current threshold, there are many ways 
               to strengthen your application..."
```

**b) Progress Indicators**
```typescript
// Show progress
┌─────────────────────────────────┐
│ Interview Progress: 6/9 ✅      │
│ ████████████░░░░░ 67%           │
└─────────────────────────────────┘

// Estimated time
"We're about halfway through! Just 3 more questions (about 2 minutes)."
```

**c) Rich Media Support**
```typescript
// Visual elements
- Upload transcript PDF instead of typing GPA
- Photo upload for test score reports
- Auto-extract data from documents using OCR

// Interactive elements
- Slider for GPA (0.0 - 4.0)
- Calendar picker for dates
- Autocomplete for school names
```

**d) Multi-channel Support**
```typescript
// Voice input
- Speech-to-text for answering questions
- Voice output for bot responses (accessibility)

// Mobile app
- Native iOS/Android apps
- Push notifications for application status
- Offline capability with sync
```

**e) Personalization**
```typescript
// Adaptive difficulty
- Detect user's language proficiency
- Simplify questions if needed
- Provide more guidance for younger applicants

// Save and resume
- Email magic link to resume later
- SMS notifications
- Multiple device support
```

**f) Feedback & Transparency**
```typescript
// Explain decisions
Bot: "You don't meet criteria because:
      - GPA: 3.2 < 3.3 (0.1 points short)
      - SAT: 1450 ≥ 1300 ✅
      
      Suggestion: Consider retaking courses to raise GPA, 
      or explore our summer bridge program."

// Allow appeals
"If you believe this decision is incorrect, click here 
 to request human review."

// Show what happens next
"Next steps:
 1. Submit official transcripts
 2. Write personal statement
 3. Request recommendation letters
 Expected timeline: 2-4 weeks"
```

**g) Gamification** (Optional)
```typescript
// Make it engaging
- Progress badges
- Achievement unlocks
- Friendly animations
- Celebration effects on success
```

---

### 6. What additional features would make this more valuable?

**Immediate Value-Adds:**

**a) Application Tracking Dashboard**
```typescript
// Student portal
- Check application status
- Upload additional documents
- Schedule interviews
- Track deadlines
- Receive notifications
```

**b) Analytics & Insights**
```typescript
// For administrators
- Applicant demographics
- Success rate by school/region
- Common drop-off points
- Qualification trends over time
- Predictive modeling (likelihood to enroll)
```

**c) Document Management**
```typescript
// Secure document uploads
- Transcript upload with verification
- Test score report upload
- Recommendation letter portal for teachers
- Auto-extraction of data from PDFs
- Document authenticity verification
```

**d) Communication Suite**
```typescript
// Email integration
- Automated email confirmations
- Application status updates
- Interview reminders
- Decision notifications

// SMS integration
- Interview link via text
- Quick status checks
- Deadline reminders
```

**e) Multi-Language Support**
```typescript
// International students
- Translate interface to 10+ languages
- Multilingual chatbot
- Detect language preference
- Localized date/number formats
```

**f) Advanced Evaluation**
```typescript
// Holistic review
- Extracurricular activities scoring
- Leadership experience weighting
- Diversity factors consideration
- Legacy/athlete status
- Financial need assessment

// Waitlist management
- Borderline candidates flagged for review
- Auto-notify when spots open
- Track yield rates
```

**g) Integration Capabilities**
```typescript
// External systems
- CRM integration (Salesforce)
- Student Information System (SIS)
- Payment gateway for application fees
- Background check services
- Calendar integration for interview scheduling
```

**h) AI-Powered Features**
```typescript
// Essay review
- Grammar checking
- Plagiarism detection
- Content quality scoring
- Suggestions for improvement

// Recommendation analysis
- Sentiment analysis of letters
- Strength scoring
- Red flag detection
```

---

### 7. How does the LLM/Copilot enhance this application?

**Where LLM Was Used:**

**a) Development Phase (GitHub Copilot)**
```
1. Boilerplate Generation (30% time saved)
   - Express route handlers
   - React component scaffolding
   - TypeScript interfaces
   - MongoDB schemas

2. Error Handling (40% time saved)
   - Try-catch blocks
   - Validation logic
   - Edge case handling
   
3. Documentation (50% time saved)
   - JSDoc comments
   - API documentation
   - README sections
```

**b) Runtime Phase (OpenAI GPT-4o)**
```
1. Question Generation
   - Context-aware questions based on conversation history
   - Natural language phrasing
   - Adaptive follow-ups

2. Data Extraction (Fallback)
   - Parsing ambiguous student responses
   - Handling varied input formats
   - Extracting structured data from unstructured text

3. Evaluation Assistance
   - Understanding complex requirements
   - Generating human-readable summaries
   - Creating empathetic closing messages

4. Greeting Generation
   - Personalized welcomes based on KB
   - Program-specific messaging
   - Warm, professional tone
```

**c) RAG Implementation**
```
1. Knowledge Base Processing
   - PDF text extraction
   - Chunk creation for embeddings
   - Vector similarity search
   
2. Context Retrieval
   - Finding relevant KB sections during chat
   - Answering policy questions
   - Providing accurate requirement information
```

**Why LLM Adds Value:**
- **Flexibility:** Adapts to any KB without code changes
- **Natural Interaction:** Students prefer conversation over forms
- **Intelligent Parsing:** Understands varied student responses
- **Scalability:** Same code works for any program/university
- **Consistency:** Rule-based evaluation ensures fairness

**Hybrid Approach Benefits:**
- LLM for conversation (natural, engaging)
- Rule-based for evaluation (accurate, transparent)
- Best of both worlds!

---

### 8. What are the limitations of the current system?

**Technical Limitations:**

1. **No Document Verification**
   - Claims self-reported, not verified
   - Could integrate with Parchment/National Student Clearinghouse
   - Need official transcript upload in production

2. **Limited Error Recovery**
   - Can't resume interrupted sessions easily
   - No email/SMS fallback
   - Session expires if browser closes

3. **Single Language**
   - English only
   - Should support Spanish, Chinese, etc.

4. **No Mobile App**
   - Web-only (though responsive)
   - Native app would be better UX

5. **Synchronous Processing**
   - Evaluation happens in real-time
   - Could queue for async processing at scale

**Functional Limitations:**

1. **Binary Decisions Only**
   - "Meets Criteria" or "Doesn't Meet"
   - No waitlist, conditional acceptance, or "almost there" status

2. **Can't Handle Exceptions**
   - No human override capability
   - Can't account for special circumstances
   - Needs admin review interface

3. **Limited Context Window**
   - Can't reference entire application package
   - Doesn't consider essays, extracurriculars holistically

**User Experience Limitations:**

1. **No Visual Rich Content**
   - Text-only chat
   - Could benefit from images, videos, campus tours

2. **No Guidance**
   - Doesn't suggest improvement paths
   - Could recommend prep courses, gap year programs

3. **No Peer Comparison**
   - Students don't know how they compare
   - Could show anonymized statistics

**Data & Analytics Limitations:**

1. **Basic Reporting**
   - Simple statistics only
   - Needs deeper analytics dashboard
   - No predictive modeling

2. **No A/B Testing**
   - Can't test different question phrasings
   - Can't optimize conversion rates

---

## 🎥 Demo Video

[Loom Demo Link](https://loom.com/your-video)

**Demo includes:**
1. System architecture overview
2. Admin dashboard features
3. PDF upload and processing
4. Live interview demonstration
5. Evaluation and results
6. Tech stack explanation
7. LLM usage highlights

---

## 👤 Author

**Talif Pathan**
- 🎓 MS Computer Science, Northeastern University (GPA: 3.889)
- 💼 Former Associate Consultant @ Capgemini (4 years experience)
- ☁️ AWS Certified Solutions Architect Associate
- 🔗 [GitHub](https://github.com/Talif787) | [LinkedIn](linkedin.com/in/talif-pathan)
- 📧 pathan.t@northeastern.edu

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- Google for Gemini API  
- MongoDB Atlas for database hosting
- Vercel for frontend deployment
- Render for backend hosting

---

**Built with ❤️ for Falcon University**

*Last Updated: December 15, 2025*