-- RECLAIM Supabase Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ═══════════════════════════════════════════════════
-- Chat Messages
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    emotion TEXT NOT NULL DEFAULT 'neutral',
    analysis JSONB DEFAULT '{}',
    strategies JSONB DEFAULT '[]',
    crisis_resources JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);

-- RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own chat messages"
    ON chat_messages FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own chat messages"
    ON chat_messages FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own chat messages"
    ON chat_messages FOR DELETE USING (auth.uid()::text = user_id);
-- Allow service role full access
CREATE POLICY "Service role full access on chat_messages"
    ON chat_messages FOR ALL USING (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════
-- Mood Entries
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS mood_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    mood TEXT NOT NULL CHECK (mood IN ('amazing','happy','calm','neutral','anxious','sad','angry','distressed')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mood_entries_user ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_created ON mood_entries(created_at DESC);

-- RLS
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own mood entries"
    ON mood_entries FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own mood entries"
    ON mood_entries FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Service role full access on mood_entries"
    ON mood_entries FOR ALL USING (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════
-- Community Posts
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS community_posts (
    id BIGSERIAL PRIMARY KEY,
    author_uid TEXT NOT NULL,
    author_alias TEXT NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) <= 2000),
    category TEXT DEFAULT 'general',
    support_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);

-- RLS (posts are public to read, but only author can create)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read community posts"
    ON community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts"
    ON community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Service role full access on community_posts"
    ON community_posts FOR ALL USING (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════
-- Community Replies
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS community_replies (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_alias TEXT NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) <= 2000),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_community_replies_post ON community_replies(post_id);

-- RLS
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read community replies"
    ON community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies"
    ON community_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Service role full access on community_replies"
    ON community_replies FOR ALL USING (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════
-- Post Supports (prevents duplicate likes)
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS post_supports (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_supports_post ON post_supports(post_id);

-- RLS
ALTER TABLE post_supports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read supports"
    ON post_supports FOR SELECT USING (true);
CREATE POLICY "Users can insert own supports"
    ON post_supports FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Service role full access on post_supports"
    ON post_supports FOR ALL USING (auth.role() = 'service_role');
