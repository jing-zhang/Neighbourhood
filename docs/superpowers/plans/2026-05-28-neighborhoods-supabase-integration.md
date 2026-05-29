# Neighborhoods - Supabase Integration Plan

**Phase 2: Backend & Real-time Data Layer**

> **Note:** This is a future implementation plan. The current prototype uses local state.

---

## Overview

Replace the local state management with a real Supabase backend for:
- User authentication
- Real-time post updates
- Location-based queries
- User profiles and reactions

---

## Database Schema

### Tables

```sql
-- 1. Users (Supabase Auth extension)
-- Auto-created by Supabase Auth

-- 2. Neighborhoods
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  center_lat DECIMAL(10, 8) NOT NULL,
  center_lng DECIMAL(11, 8) NOT NULL,
  radius_km DECIMAL(5, 2) DEFAULT 2.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('event', 'safety', 'sale', 'general')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  distance_km DECIMAL(5, 2) DEFAULT 0.1,
  reactions_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Reactions (likes)
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 5. Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Locations (for geolocation history)
CREATE TABLE user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  label TEXT,
  source TEXT CHECK (source IN ('geolocation', 'manual', 'reverse_geocode')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes
```sql
-- Spatial queries
CREATE INDEX idx_posts_location ON posts(lat, lng);
CREATE INDEX idx_posts_neighborhood ON posts(neighborhood_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- User data
CREATE INDEX idx_reactions_post_user ON reactions(post_id, user_id);
CREATE INDEX idx_comments_post ON comments(post_id);
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Policies
-- Posts: Anyone can read, authenticated users can create
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Reactions: Authenticated users only
CREATE POLICY "Reactions are viewable by everyone" ON reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage their reactions" ON reactions FOR ALL USING (auth.uid() = user_id);

-- Comments: Similar to posts
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);
```

---

## API Endpoints

### REST API (via Supabase Edge Functions)

#### 1. Posts API
```
GET    /api/v1/posts           - List posts with filters
GET    /api/v1/posts/:id       - Get single post
POST   /api/v1/posts           - Create new post
PUT    /api/v1/posts/:id       - Update post (owner only)
DELETE /api/v1/posts/:id       - Delete post (owner only)
```

**Query Parameters:**
- `neighborhood_id` - Filter by neighborhood
- `category` - Filter by category
- `lat, lng, radius_km` - Location-based filtering
- `limit, offset` - Pagination
- `sort` - `newest`, `popular`, `nearby`

#### 2. Location API
```
GET    /api/v1/location/suggest - Suggest neighborhoods based on coordinates
POST   /api/v1/location/save    - Save user location preference
GET    /api/v1/location/nearby  - Get posts within radius
```

#### 3. Reactions API
```
POST   /api/v1/posts/:id/reactions - Add/remove reaction
GET    /api/v1/posts/:id/reactions - Get reaction count
```

#### 4. Comments API
```
GET    /api/v1/posts/:id/comments - Get comments for post
POST   /api/v1/posts/:id/comments - Add comment
PUT    /api/v1/comments/:id       - Update comment
DELETE /api/v1/comments/:id       - Delete comment
```

---

## Supabase Client Setup

### Environment Variables
```env
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only
```

### Client Configuration
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

---

## Implementation Tasks

### Phase 1: Database Setup
- [ ] Create Supabase project
- [ ] Run schema migrations
- [ ] Set up RLS policies
- [ ] Seed initial neighborhoods data

### Phase 2: Authentication
- [ ] Integrate Supabase Auth
- [ ] Add login/signup UI
- [ ] Handle auth state in app
- [ ] Protect API endpoints

### Phase 3: Posts Migration
- [ ] Replace local state with Supabase queries
- [ ] Implement real-time subscriptions for new posts
- [ ] Add location-based queries
- [ ] Handle offline-first caching

### Phase 4: Social Features
- [ ] Implement reactions (likes)
- [ ] Add comments system
- [ ] User profiles
- [ ] Notifications for replies

### Phase 5: Advanced Features
- [ ] Image uploads (Supabase Storage)
- [ ] Push notifications
- [ ] Analytics
- [ ] Admin dashboard

---

## Data Migration Strategy

### Step 1: Dual-write
- Write to both local state AND Supabase
- Sync on connectivity restore

### Step 2: Supabase-first
- Primary data source is Supabase
- Local state for offline support

### Step 3: Real-time
- Enable real-time subscriptions
- Remove local state management

---

## Performance Considerations

### 1. Query Optimization
- Use PostGIS for spatial queries
- Implement pagination
- Cache frequently accessed data

### 2. Real-time Updates
- Use Supabase Realtime for live updates
- Debounce frequent updates
- Batch operations where possible

### 3. Offline Support
- Local-first architecture
- Sync queue for offline actions
- Conflict resolution strategy

---

## Security

### 1. Authentication
- JWT-based auth
- Session management
- Email verification

### 2. Authorization
- Row Level Security (RLS)
- Role-based access control
- Rate limiting

### 3. Data Protection
- Encrypted connections
- Input validation
- SQL injection prevention

---

## Monitoring & Analytics

### 1. Supabase Dashboard
- Query performance
- Storage usage
- Auth analytics

### 2. Custom Metrics
- Active neighborhoods
- Post engagement rates
- User retention

### 3. Error Tracking
- Client-side errors
- API failures
- Database errors

---

## Future Extensions

### 1. Machine Learning
- Post recommendations
- Spam detection
- Trend analysis

### 2. Mobile Apps
- React Native integration
- Push notifications
- Offline maps

### 3. Monetization
- Premium neighborhoods
- Business listings
- Sponsored posts

---

*This plan can be executed after the static prototype is complete and tested.*