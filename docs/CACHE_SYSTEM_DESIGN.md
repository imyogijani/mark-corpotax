# Content Cache System Design

## Overview

This document outlines the cache invalidation system for the MARK GROUP website CMS.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ADMIN EDITOR                                   │
│  (SiteEditor / Site-Builder)                                            │
│                                                                          │
│  1. User edits content                                                  │
│  2. Save triggers:                                                      │
│     - PUT /api/admin/content (saves to Firestore)                       │
│     - POST /api/content/clear-cache (clears backend cache)              │
│     - contentService.clearCache() (clears frontend cache)               │
│     - localStorage.setItem('content_updated', timestamp)                │
│     - window.dispatchEvent('content-cache-invalidated')                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                        │
│                                                                          │
│  Routes (content.ts):                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ contentCache = {}  // Route-level cache, 5 min TTL              │   │
│  │                                                                  │   │
│  │ POST /clear-cache → clears contentCache + PageContentService    │   │
│  │ GET /:page → checks contentCache, else queries Firestore        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Services (firebaseService.ts):                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ pageContentCache = null  // Service-level cache, 5 min TTL      │   │
│  │                                                                  │   │
│  │ PageContentService.clearCache() → pageContentCache = null        │   │
│  │ findByFilter() → checks cache, else queries Firestore           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Firestore (pageContent collection):                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ { page, section, key, value, isActive }                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                       │
│                                                                          │
│  Content Service (content-service.ts):                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ cache = {}  // In-memory cache, 30s dev / 5 min prod            │   │
│  │ pendingRequests = {}  // Deduplication of in-flight requests     │   │
│  │ cacheVersion = 0  // Incremented on invalidation                 │   │
│  │                                                                  │   │
│  │ clearCache() → cache = {}, bump cacheVersion                     │   │
│  │ getPageContent() → check cache version, fetch if stale          │   │
│  │ onCacheInvalidated() → subscribe to invalidation events          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Dynamic Components (DynamicHeroSection, etc.):                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ useEffect:                                                       │   │
│  │   - fetchContent()                                               │   │
│  │   - subscribe to contentService.onCacheInvalidated()             │   │
│  │                                                                  │   │
│  │ No localStorage checks (handled by contentService)               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Cache Version Strategy

Instead of just clearing cache, we use a version number:

1. **On Save:**

   - Increment `cacheVersion` globally
   - All cached data has a `cachedAtVersion`
   - Any data with `cachedAtVersion < cacheVersion` is considered stale

2. **On Fetch:**

   - Check if cached data's version matches current version
   - If not, ignore cache and fetch fresh

3. **Benefits:**
   - No race conditions with pending requests
   - Clean invalidation across all components
   - Works with browser back/forward navigation

## localStorage Strategy

- `content_updated_version`: Stores the current cache version
- On page load, compare stored version with localStorage
- If different, clear cache and fetch fresh

## Event Flow

1. Admin saves content
2. Backend receives save, updates Firestore
3. Backend clears its caches
4. Frontend receives success response
5. Frontend:
   - Increments cacheVersion
   - Clears in-memory cache
   - Updates localStorage version
   - Dispatches invalidation event
6. All subscribed components:
   - Receive invalidation event
   - Re-fetch content with new version
   - Display updated content
