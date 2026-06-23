# Al-Huda Project - API Analysis

## 🔤 QURAN TEXT APIs

### 1. **QuranAPI.pages.dev** (Primary Text Source)
- **Base URL:** `https://quranapi.pages.dev`
- **Endpoints Used:**
  - `GET /api/{surahId}.json` - Get complete Surah metadata (Arabic text, English translation, Urdu translation)
  - `GET /api/surah.json` - Get list of all Surahs with basic info
- **Used in:**
  - `src/lib/quran-api.ts` → `fetchSurahMeta()`
  - `src/lib/quran-server.ts` → `getSurahMetaById()`
  - `src/hooks/useSurahList.ts` → Fetch all Surahs list
- **Data Returned:** Arabic text, English translation, Urdu translation, Surah metadata
- **Cache Strategy:** Force cache with 24-hour revalidation

### 2. **Al-Quran Cloud API**
- **Base URL:** `https://api.alquran.cloud`
- **Endpoints Used:**
  - `GET /v1/surah/{surahId}` - Get Surah details (ayahs with translations)
  - `GET /v1/ayah/{surahId}:{ayahNumber}/ar.alafasy` - Get Arabic audio (Al-Afasy recitation)
  - `GET /v1/ayah/{surahId}:{ayahNumber}/ur.khan` - Get Urdu audio (Khan recitation)
- **Used in:**
  - `src/lib/quran-api.ts` → `fetchSurahDetail()`
  - `src/lib/quran-server.ts` → `getAyahAudioUrls()`
- **Data Returned:** Ayah text, translations, audio URLs
- **Cache Strategy:** Force cache with 24-hour revalidation

### 3. **Quran.com API**
- **Base URL:** `https://api.quran.com`
- **Endpoints Used:**
  - `GET /api/v4/tafsirs/{tafsirId}/by_ayah/{surahId}:{ayahNumber}` - Get Tafsir (Quranic commentary)
- **Tafsir IDs Used:**
  - `160` - Urdu Tafsir
  - `159` - Urdu Tafsir
  - `818` - Urdu Tafsir
  - `157` - Urdu Tafsir
- **Used in:**
  - `src/lib/quran-server.ts` → `getUrduTafsirByAyah()`
  - `src/app/api/tafsir/ur/route.ts` → `fetchUrduTafsirFromQuranCom()`
  - `src/lib/quran-api.ts` → `fetchUrduTafsirByAyah()`
- **Data Returned:** Tafsir text (HTML), resource name, source information
- **Cache Strategy:** Force cache with 24-hour revalidation

---

## 🔊 AUDIO APIs

### 1. **Al-Quran Cloud API - Audio Endpoints**
- **Base URL:** `https://api.alquran.cloud`

#### Arabic Audio (Al-Afasy Recitation)
- **Endpoint:** `GET /v1/ayah/{surahId}:{ayahNumber}/ar.alafasy`
- **Used in:** `src/lib/quran-server.ts` → `getAyahAudioUrls()`
- **Returns:** Audio URL for Arabic Quran recitation (Al-Afasy)
- **Format:** MP3 URL string

#### Urdu Audio (Khan Recitation)
- **Endpoint:** `GET /v1/ayah/{surahId}:{ayahNumber}/ur.khan`
- **Used in:** `src/lib/quran-server.ts` → `getAyahAudioUrls()`
- **Returns:** Audio URL for Urdu Quran recitation (Khan)
- **Format:** MP3 URL string

---

## 🤖 AI/ML APIs

### 1. **OpenAI API**
- **Service:** Text embeddings and chat completions
- **API Key:** `process.env.OPENAI_API_KEY`
- **Used in:**
  - `src/lib/embeddings.ts` - Generate embeddings for semantic search
  - `src/lib/quran-qa.ts` - Answer Quran questions using RAG pattern

#### Models Used:
1. **text-embedding-3-small**
   - **Used for:** Vector search, semantic similarity
   - **Dimensions:** 1536
   - **Functions:**
     - `generateEmbedding(text)` - Single embedding
     - `generateEmbeddingsBatch(texts)` - Batch embeddings

2. **gpt-4o**
   - **Used for:** AI Q&A about Quran
   - **Max Tokens:** 500
   - **Temperature:** 0.7
   - **Function:** `answerQuranQuestion(question, useCache)`

---

## 🔎 SEARCH APIs

### Internal Vector Search APIs
- **Base:** MongoDB with vector search via Cosmos
- **Endpoints:**
  - `POST /api/vector/semantic-search` - Search Surahs and Ayahs by semantic meaning
  - `POST /api/vector/qa` - Ask questions about Quran using RAG

### Voice Search API
- **Endpoint:** `POST /api/voice/search` - Voice-based FAQ search
- **Data Source:** Local knowledge base (`VOICE_SEARCH_QUESTIONS`)

---

## 🗄️ DATABASE APIs

### MongoDB Atlas
- **Collections Used:**
  - `quran_surahs` - Surah embeddings and metadata
  - `quran_ayahs` - Ayah embeddings and translations
  - `quran_qa_cache` - Cached Q&A responses
  - `users` - User authentication and data
- **Vector Search:** Cosmos vector search for semantic queries

---

## 🔐 AUTHENTICATION APIs

### Google OAuth
- **Endpoint:** `POST /api/auth/google`
- **Used for:** Google sign-in authentication
- **Library:** Google ID token verification
- **Environment Variable:** `GOOGLE_CLIENT_ID`

---

## 📊 API Usage Summary

| API | Purpose | Type | Count |
|-----|---------|------|-------|
| quranapi.pages.dev | Quran text (Arabic, English, Urdu) | Text | 2 endpoints |
| api.alquran.cloud | Surah details + Audio | Text + Audio | 3 endpoints |
| api.quran.com | Tafsir (Commentary) | Text | 1 endpoint (4 versions) |
| OpenAI | Embeddings + Q&A | AI/ML | 2 models |
| Google OAuth | Authentication | Auth | 1 endpoint |
| MongoDB | Data storage + search | Database | 4+ collections |

---

## 📈 Data Flow

```
User Query
    ↓
┌─────────────────────────────────────┐
│ Internal APIs (Next.js Routes)      │
└─────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────┐
│ External APIs                                │
├──────────────────────────────────────────────┤
│ • QuranAPI.pages.dev (Text)                  │
│ • Al-Quran Cloud (Text + Audio)              │
│ • Quran.com (Tafsir)                         │
│ • OpenAI (Embeddings + AI)                   │
│ • MongoDB (Caching + Vector Search)          │
│ • Google OAuth (Authentication)              │
└──────────────────────────────────────────────┘
    ↓
Response to Client
```

---

## 🔄 Caching Strategy
- **QuranAPI.pages.dev:** Force cache with 24-hour revalidation
- **Al-Quran Cloud:** Force cache with 24-hour revalidation
- **Quran.com:** Force cache with 24-hour revalidation
- **Q&A Results:** MongoDB cache with 95% confidence for repeated questions
- **Embeddings:** Generated on-demand, cached in MongoDB

---

## ⚙️ Environment Variables Required

```env
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
MONGODB_URI=mongodb+srv://...
```

---

## 📝 Notes

- All external Quran APIs support **force-cache** strategy for performance
- Audio files are served as direct URLs from Al-Quran Cloud
- Semantic search requires OpenAI embeddings (1536 dimensions)
- Tafsir retrieval tries 4 different sources (fallback mechanism)
- Voice search uses local FAQ database (no external API calls)
