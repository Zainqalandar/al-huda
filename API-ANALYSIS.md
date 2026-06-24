# Al-Huda Project - API Analysis

## 🔤 External Quran APIs

### 1. **Quran.com API** (Primary Quran data source)
- **Base URL:** `https://api.quran.com/api/v4`
- **Endpoints Used:**
  - `GET /chapters?language=en` - List of Surahs
  - `GET /chapters/{surahId}?language=en` - Surah metadata
  - `GET /verses/by_chapter/{surahId}?language=en&translations=20,234` - Ayah translations in English and Urdu
  - `GET /quran/verses/uthmani?chapter_number={surahId}` - Arabic Quran text
  - `GET /verses/by_verse/ar-default/{surahId}:{ayahNumber}` - Arabic audio metadata for a single ayah
  - `GET /chapter_recitations/{recitationId}/{surahId}?segments=true` - Surah recitation audio options
  - `GET /tafsirs/{tafsirId}/by_ayah/{surahId}:{ayahNumber}` - Urdu Tafsir
- **Used in:**
  - `src/lib/quran-api.ts`
  - `src/lib/quran-server.ts`
  - `src/app/api/tafsir/ur/route.ts`
  - `src/hooks/useSurahList.ts`
- **Data Returned:** Surah metadata, Arabic text, translations, recitations, and Urdu Tafsir
- **Cache Strategy:** Server-side cache / revalidation around 24 hours

### 2. **Archive.org Urdu audio index**
- **Base URL:** `https://ia801503.us.archive.org/28/items/quran_urdu_audio_only/{surahId}.json`
- **Used in:**
  - `src/lib/quran-server.ts`
  - UI audio helpers in `src/components` and providers
- **Data Returned:** Urdu audio index mapping ayah numbers to audio URLs

### 3. **Google public certs**
- **URL:** `https://www.googleapis.com/oauth2/v3/certs`
- **Used in:**
  - `src/lib/auth/google.ts`
  - `src/app/api/auth/google/route.ts`
- **Purpose:** Verify Google ID tokens for sign-in

### 4. **OpenAI API**
- **Library:** `openai` SDK
- **Used in:**
  - `src/lib/embeddings.ts` - Embedding generation
  - `src/lib/quran-qa.ts` - Question answering
- **Models Used:**
  - `text-embedding-3-small` for semantic embeddings
  - `gpt-4o` for AI Q&A
- **Environment Variable:** `OPENAI_API_KEY`

---

## 🔎 Internal API Routes (Next.js)

### Voice search
- `POST /api/voice/search` - Voice/FAQ search over local `VOICE_SEARCH_QUESTIONS`
- `GET /api/voice/search` - Return voice FAQ list

### Semantic and related search
- `POST /api/vector/semantic-search` - Semantic surah/ayah search using OpenAI embeddings + MongoDB vector search
- `GET /api/vector/related` - Related ayahs based on stored ayah embeddings
- `POST /api/vector/qa` - RAG-style Quran Q&A using OpenAI and MongoDB

### Tafsir proxy
- `GET /api/tafsir/ur` - Proxy Urdu Tafsir lookups from Quran.com

### Quran likes and state
- `GET /api/quran/likes` - Surah like counts from internal data store

### Authentication and user state
- `POST /api/auth/google` - Google sign-in via verified ID token
- `POST /api/auth/signin` - Email/password sign-in
- `POST /api/auth/signup` - Email/password signup
- `POST /api/auth/signout` - Sign out and clear session cookie
- `GET /api/auth/session` - Get current session user
- `GET /api/auth/quran-state` - Load authenticated user Quran state
- `PUT /api/auth/quran-state` - Save authenticated user Quran state
- `POST /api/auth/track` - User activity / tracking event capture

### Admin
- `GET /api/admin/users` - Return user list and administrative summary

---

## 🗄️ Database and storage

### MongoDB
- Connected via `src/lib/db/mongodb.ts`
- Collections in use:
  - `quran_surahs` - Surah embeddings and metadata
  - `quran_ayahs` - Ayah embeddings, text, and translations
  - `quran_qa_cache` - Cached QA answers
  - `users` - User accounts, bookmarks, favorites, last-read state
- Vector search is implemented with MongoDB aggregation using Cosmos vector search operators
- Default local URI fallback: `mongodb://127.0.0.1:27017/al-huda`

---

## 🔐 Authentication and session

- Google ID tokens are verified using Google public certs and `GOOGLE_CLIENT_ID`
- Session cookies are attached and validated in `src/lib/auth/session.ts`
- Email/password auth uses `src/lib/auth/password.ts` and `src/lib/auth/users-store.ts`
- User state and bookmarks are stored in the `users` collection

---

## 📊 API Usage Summary

| API / Service | Purpose | Type |
|---|---|---|
| `https://api.quran.com/api/v4` | Quran metadata, Arabic text, translations, recitations, Urdu Tafsir | External Quran API |
| `https://ia801503.us.archive.org` | Urdu audio index data | External audio metadata |
| OpenAI | Embeddings and AI-generated answers | AI/ML |
| Google OAuth certs | Google ID token verification | Auth |
| MongoDB | Data storage, vector search, cache | Database |
| Local Next.js routes | Internal app APIs | Backend |

---

## 📈 Data Flow

User request → internal Next.js route → external API(s) / MongoDB → response

Examples:
- `/api/vector/semantic-search` → OpenAI embedding + MongoDB vector query
- `/api/vector/qa` → OpenAI QA + MongoDB cache + ayah source retrieval
- `/api/tafsir/ur` → Quran.com tafsir proxy
- `/api/voice/search` → local FAQ search
- `/api/auth/google` → Google certs + user session handling

---

## 🔄 Caching Strategy
- Next.js revalidation / force-cache for Quran.com requests
- MongoDB cache for QA and stored embeddings
- Local browser/session caching handled by app routes and cookies

---

## ⚙️ Environment Variables Required

```env
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
MONGODB_URI=mongodb+srv://...
```

---

## 📝 Notes

- Outdated `QuranAPI.pages.dev` and `api.alquran.cloud` references were removed.
- The app now relies primarily on `api.quran.com` plus Archive.org Urdu audio metadata.
- OpenAI is used for semantic search embeddings and RAG-based Q&A.
- Google sign-in is implemented with server-side token verification and session cookies.
- Voice search is implemented locally with a static FAQ dataset.
