# 📱 KhidmatAI — AI Service Orchestrator

An intelligent, multi-agent conversational service booking platform tailored for the informal economy in Pakistan. Inspired by Careem's clean user experience, KhidmatAI automates the complete service lifecycle using an advanced Google ADK agentic pipeline, catering to bilingual requirements (Urdu & English) with high-fidelity tracking, automated dispute resolution, and dynamic pricing models.

---

## 📌 Problem Statement
The informal home service economy in Pakistan (plumbing, electrical work, AC repair, cleaning) is heavily fragmented and operates primarily through unstructured communication channels like WhatsApp voice notes and phone calls. This lack of structure causes significant inefficiencies:
- **Language Barriers:** Existing digital platforms require structured English input, isolating users who communicate in colloquial Roman Urdu, mixed/code-switched language, or native Urdu script.
- **Inconsistent Pricing:** Lack of transparent dynamic estimation leads to price disputes and haggling.
- **Trust & Reliability:** Inefficient matching, lack of background checks, and manual dispute settlement reduce customer trust.

KhidmatAI bridges this gap by offering a fully automated, bilingual, conversational service orchestrator that automates everything from booking request parsing to service tracking and dispute management.

---

## ✨ Solution Overview
KhidmatAI is a complete service orchestrator that acts as an intelligent intermediary. Users can request services in their own words (e.g., *"Mera AC thand nahi kar raha"* or *"پلمبر کی ضرورت ہے"*). The system:
1.  **Conversational Extraction:** Automatically parses the user request to identify intent and details.
2.  **Intelligent Matching & Scheduling:** Matches requests against geo-fenced providers in Pakistan using a multi-factor ranking algorithm.
3.  **Bilingual Native Interfaces:** Renders all mobile interfaces, forms, and message previews in dual-stacked English and Urdu text.
4.  **Real-Time Tracking & Simulation:** Provides real-time transit timelines and interactive simulation steps for hackathon judges.
5.  **Transparent Billing:** Explains exact cost breakdowns including peak-surcharges and travel adjustments.
6.  **Automated Dispute Management:** Features sliding dispute drawers offering instant dynamic compensation.

---

## 🏗️ Architecture
KhidmatAI is built on a highly modular, decoupled architecture consisting of a premium mobile frontend, an orchestrating FastAPI web server, a Google ADK-powered intelligent agent engine, and a scalable Firestore real-time database.

### System Architecture Diagram
```
           +-----------------------------------------------------+
           |                 Flutter Mobile App                  |
           |     (Bilingual UI: English & Roman/Urdu Script)     |
           +--------------------------+--------------------------+
                                      |
                               REST API Calls
                                      |
                                      v
           +--------------------------+--------------------------+
           |                  FastAPI Backend Server                  |
           |             (Web Server & API Orchestrator)         |
           +--------------------------+--------------------------+
                                      |
                       +--------------+--------------+
                       |                             |
                       v                             v
         +-------------+-------------+  +------------+------------+
         |   Google ADK Agent Engine |  |    Firebase Firestore   |
         | (Multi-Agent Pipeline 1-8)|  |   (Mock Providers Data, |
         +-------------+-------------+  |   Active Bookings, Logs)|
                       |                +-------------------------+
                LiteLLM Adapter
                       |
                       v
         +-------------+-------------+
         |   OpenRouter API Gateway  |
         |       (GPT-4o-mini)       |
         +---------------------------+
```

### Tech Stack Details:
-   **Flutter Mobile App:** Premium cross-platform mobile client featuring dynamic bilingual stack layouts, customized ETA map views, active timeline steppers, and dispute overlays.
-   **FastAPI Backend:** Lightweight Python web server hosting REST APIs for mobile communication, managing mock data seeding, and driving pipeline transactions.
-   **Google ADK Agent Pipeline:** A modular multi-agent framework orchestrating sequential business logic workflows.
-   **Firebase Firestore:** NoSQL database housing provider profiles, operational records, and session tracking traces.
-   **OpenRouter LLM:** Leverages `GPT-4o-mini` as the cognitive reasoning model via LiteLLM integrations.

---

## 🤖 Agent Pipeline
The system orchestrates a sequential **8-Stage Agent Pipeline** where each agent executes a discrete phase of the transaction lifecycle:

1.  **Intent Agent:** 
    - *Purpose:* Parses user prompts (colloquial Urdu, Roman Urdu, English, or mixed code-switched inputs) to extract the primary service category (e.g., AC Technician, Plumber, Electrician) and user intent.
2.  **Discovery Agent:** 
    - *Purpose:* Translates colloquial user locations (e.g., F-8, Islamabad) into structured coordinates and queries the Firestore database to retrieve a geo-fenced set of matching local providers.
3.  **Ranking Agent:** 
    - *Purpose:* Ranks matching candidates using a 7-factor weighted algorithm to determine the top provider, optimizing customer convenience and service quality.
4.  **Pricing Agent:** 
    - *Purpose:* Dynamically estimates pricing, factoring in base-rates, travel distances, complexity metrics, and active slot demand, generating a granular dynamic price breakdown.
5.  **Booking Agent:** 
    - *Purpose:* Locks the selected time slot, generates a secure 6-digit confirmation security code (`526377`) to be shared with the provider upon arrival, and updates state in Firestore.
6.  **Notification Agent:** 
    - *Purpose:* Prepares high-fidelity, localized transactional templates in both English and Urdu for dispatch via simulated WhatsApp notification bubbles.
7.  **Followup Agent:** 
    - *Purpose:* Simulates active en-route transit updates, estimates vehicle arrival ETAs, and handles post-completion metrics (customer star ratings and textual reviews).
8.  **Dispute Agent:** 
    - *Purpose:* Processes cancellation and quality complaints via a Careem-style slide-up drawer. Evaluates complaint severity to issue instant automated wallet refunds.

---

## 🛸 Antigravity Usage
Google Antigravity served as the central IDE and orchestration powerhouse throughout the development lifecycle:
-   **Primary Orchestrator for Agent Development:** Antigravity managed workspace environments, driving the initial scaffolding and development of backend agent nodes.
-   **Agent Manager for Multi-Task Execution:** Parallelized execution loops utilizing Antigravity's file-handling and terminal-status pipelines to rapidly iterate on design and backend logic.
-   **Workplans and Task Traces:** Maintained high-fidelity tasks and walkthrough structures inside `task.md` and `walkthrough.md` to ensure trace documentation aligned with architectural designs.
-   **firebase-mcp-server Integration:** Streamlined Firestore database configuration, initialization, mock seeding, and deployment tracking directly within the environment.
-   **dart-mcp-server Integration:** Automated Flutter dependencies management (`pubspec.yaml` setups), file structural layouts, compilation validation, and testing loops.
-   **Integrated IDE Execution:** Completed all coding, styling, compile scripting, and JSON serialization within the Antigravity IDE workspace.

---

## 🛠️ APIs and Tools Used
-   **Google ADK (Agent Development Kit):** Core framework hosting intelligent conversational agents.
-   **Firebase Firestore (Database):** Scalable cloud database for real-time tracking, providers records, and booking persistence.
-   **OpenRouter API (LLM - GPT-4o-mini):** Primary cognitive driver parsing input prompts, explaining billing details, and deciding dispute refunds.
-   **LiteLLM:** Lightweight standard adapter integrating OpenRouter routes directly into the ADK pipeline.
-   **FastAPI:** High-performance, async-capable Python backend framework hosting service API endpoints.
-   **Flutter:** Mobile app development framework driving native visual layouts on Android and iOS.
-   **StitchMCP:** High-fidelity UI prototyping engine used to design and align visual tokens prior to development.
-   **firebase-mcp-server:** Antigravity extension powering rapid Firebase setups.
-   **dart-mcp-server:** Antigravity extension driving automated Dart and Flutter formatting, execution, and testing.

---

## 📊 Mock Data
To demonstrate high-fidelity functionality in real-world scenarios, the system is pre-seeded with rich mock data:
-   **20 Service Providers** fully populated with profiles, ratings, past job counts, on-time statistics, base rates, and cancellation ratios.
-   **5 Core Categories:** AC Technician, Plumber, Electrician, Carpenter, and Painter.
-   **6 Major Areas in Pakistan:** F-8 (Islamabad), Clifton (Karachi), Gulberg (Lahore), Peshawar Cantt, Quetta Cantonment, and F-6 (Islamabad).
-   **Firestore Database Seeding:** Completely populated via automated backend seed runs.
-   **Active REST Endpoints:** Providers data is fully queryable via active live API controllers.

---

## 🌎 Multilingual Support
KhidmatAI recognizes the diverse linguistic nuances of Pakistani consumers:
-   **English Input:** Direct extraction (e.g., *"Need a plumber for a leaking faucet in F-8"*).
-   **Roman Urdu Input:** Phonetic translation mapping (e.g., *"Mera AC thand nahi kar raha hai"* maps successfully to AC Technician).
-   **Urdu Script Input:** Full Right-to-Left (RTL) Arabic unicode query processing (e.g., *"پلمبر کی ضرورت ہے"*).
-   **Mixed/Code-Switched Input:** Seamlessly handles conversational mixtures (e.g., *"Urgent AC service chahiye in F-8"*).
-   **Confidence Scoring:** If a query contains ambiguous search terms, the system registers a low confidence score and prompts clarifying options to the user.

---

## 🧮 Provider Matching Algorithm
The **Ranking Agent** ranks candidates based on a **7-Factor Weighted Algorithm** (total score = 100%):
-   **Distance (20%):** Proximity to user location.
-   **Availability (20%):** Match with requested time slot.
-   **Rating (15%):** Historic overall customer review stars.
-   **On-Time Score (15%):** Historic arrival and completion timeliness.
-   **Cancellation Rate (10%):** Probability of provider canceling on short notice (lower cancellation = higher score).
-   **Specialization (10%):** Deep domain experience matching the specific service type.
-   **Price vs. Budget (10%):** Alignment of provider base-rates with the user's estimated budget constraints.

---

## 💸 Dynamic Pricing
To balance supply, demand, and operations fairly, prices are computed dynamically:

$$\text{Dynamic Price} = (\text{Base Rate} + \text{Distance Surcharge}) \times \text{Urgency Multiplier} \times \text{Complexity Multiplier} - \text{Loyalty Discount}$$

-   **Base Rate:** Flat category service fee.
-   **Distance Surcharge:** Geodesic distance calculation from the provider's coordinates to the user's home location (e.g., + PKR 50/km).
-   **Urgency Multiplier:** High-demand or late-hour multipliers (ranges from `1.0` to `1.3`).
-   **Complexity Multiplier:** Scaled multiplier based on the parsed issue type (e.g., complete compressor replacement vs. general air filter cleaning).
-   **Loyalty Discount:** Automatic deductions applied to repeat customers.

---

## 💥 Stress Test Scenarios
The agent engine has been thoroughly stress-tested against standard operational failures:
1.  **No Provider Available:** Instantly suggests nearby categories or secondary adjacent slots instead of throwing a generic search error.
2.  **Late-Hour / Sham-Time Input:** Maps late colloquial Urdu queries (e.g., *"Shaam ke waqt"* or *"Raat ko"*) to structured time blocks (e.g., 6:00 PM), or adjusts to the nearest opening if slots are booked out.
3.  **Highly Misspelled Inputs:** Leverages fuzzy match scoring and low confidence prompts to clarify intent (e.g., *"Plmbr"* -> *"Did you mean Plumber?"*).
4.  **Provider Cancellation:** Automatically triggers the Dispute Agent, searching for replacement professionals and providing wallet credit offsets for the inconvenience.
5.  **Price Disagreement:** Allows users to access the dispute flow to appeal overcharging, triggering automated reviews and immediate resolution offers.

---

## ⚖️ Baseline Comparison
A side-by-side comparison illustrating why KhidmatAI outclasses traditional, static marketplace applications:

| Feature | Simple Marketplace App | KhidmatAI |
| :--- | :--- | :--- |
| **Urdu Input** | ❌ None (Requires strict English) | ✔️ Complete (English, Roman Urdu, Urdu script, mixed) |
| **Matching Factors** | ❌ 1 (Basic distance or list sorting) | ✔️ 7 (Distance, slots, ratings, timeline score, cancels, etc.) |
| **Slot Suggestions** | ❌ None (Rigid slot pickers) | ✔️ Dynamic (Suggests nearest slots on constraints) |
| **Price Breakdown** | ❌ Basic (Flat estimation tags) | ✔️ Comprehensive (Itemized base, travel, urgency breakdowns) |
| **Agent Reasoning** | ❌ None | ✔️ Yes (AI explains pricing and matching reasoning) |
| **Dispute Handling** | ❌ Manual (Requires support ticket waits) | ✔️ Instant (Automated slide-up sheets with wallet credits) |
| **Confidence Scoring** | ❌ None (Errors out on bad input) | ✔️ Yes (Prompts clarifying options to refine queries) |

---

## 🚀 Setup Instructions

### Backend Setup
1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```
2.  Create a python virtual environment:
    ```bash
    python -m venv seekho
    ```
3.  Activate the virtual environment:
    *Windows PowerShell:*
    ```powershell
    seekho\Scripts\activate
    ```
    *macOS/Linux:*
    ```bash
    source seekho/bin/activate
    ```
4.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Add your Firebase Service Account JSON file as `serviceAccountKey.json` under the backend root directory.
6.  Configure your environment variables inside a `.env` file (containing OpenRouter keys and Firestore project configurations).
7.  Launch the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```

### Mobile App Setup
1.  Navigate to the mobile app directory:
    ```bash
    cd mobile/khidmat_app
    ```
2.  Install Flutter dependencies:
    ```bash
    flutter pub get
    ```
3.  Run the application locally on your simulator or connected device:
    ```bash
    flutter run
    ```

---

## 🔌 API Endpoints
-   `POST /api/request` — Receives conversational queries (English/Urdu) and triggers the multi-stage parsing pipeline.
-   `POST /api/book` — Confirms service booking reservations and updates the active Firestore state.
-   `POST /api/followup` — Triggers updates for current active bookings transit phases.
-   `POST /api/dispute` — Initiates the dispute resolution drawer pipeline.
-   `GET /api/trace/{booking_id}` — Retrieves raw AI execution logs for developer auditing.
-   `GET /api/providers` — Returns the complete database list of registered service providers.
-   `GET /api/health` — API health check validation.

---

## 📈 Cost Analysis & Scalability
-   **Transaction Cost:** Approximately `~$0.002 to $0.005` per pipeline run due to optimized token sizing and caching routines on GPT-4o-mini.
-   **Database Overhead:** Firebase Firestore free tier is highly optimized to handle up to 50,000 daily read operations.
-   **Scalability:** Stateless execution layers enable backend processes to be easily containerized and scaled horizontally.
-   **1000 Requests/Day Projections:** Calculated operating cost amounts to just `~$2 to $5/day`.

---

## 🔒 Privacy Note
-   All provider profiles, addresses, contact details, and locations represent fully simulated, **mock data**. No real personal data is saved, processed, or exposed.
-   Active customer accounts are mapped directly to anonymized IDs to guarantee maximum backend security.

---

## ⚠️ Limitations
-   **Microphone Input:** Device microphone authorization is required to utilize conversational voice query processing.
-   **Local Running Backend:** The backend service must be running locally to handle queries.
-   **LLM Latency:** High-fidelity conversational outputs and complex multi-stage agent reasoning require a processing latency of `5 to 10 seconds` per request.
-   **Mock Limits:** Geo-fenced listings represent simulated Pakistani neighborhoods; real-time GPS locations represent simulated points.

---

## 🏆 Team
Built with dedication for the **AI Seekho Hackathon 2026**
*Challenge 2: AI Service Orchestrator for the Informal Economy*
