# Atlas Landing Page — Mixpanel Tracking Setup

Mixpanel Projekt: **Atlas** (`4005759`)
Meta Ads Account: **Atlas** (`act_1677061273614166`)

## Ad Set Strategy

Zwei Ad Sets mit identischer Kampagne, aber unterschiedlichen Landing Pages:

| Ad Set    | utm_content | Landing URL                | funnel_variant |
|-----------|-------------|----------------------------|----------------|
| funnel    | `funnel`    | `/funnel?v=funnel&...`     | `funnel`       |
| funnel1   | `funnel1`   | `/funnel1?v=funnel1&...`   | `funnel1`      |

## URL Parameter Pattern (für beide Ad Sets)

Meta ersetzt `{{adset.name}}` automatisch. Alle Ads sollten diese Template URL nutzen:

```
https://atlas.xyz/{{adset.name}}?utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{adset.name}}&utm_term={{ad.name}}&fbclid={{fbclid}}
```

## Frontend Tracking (TypeScript/React)

### 1. Mixpanel Init + URL Param Capture

```ts
// lib/analytics.ts
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!;

export function initAnalytics() {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: false, // we fire manual events
    persistence: 'localStorage',
    api_host: 'https://api-eu.mixpanel.com', // EU region!
    autocapture: true,
  });

  // Capture URL params + funnel variant as super properties
  // (auto-attached to every event)
  const url = new URL(window.location.href);
  const path = url.pathname; // "/funnel" or "/funnel1"
  const funnel_variant = path.includes('funnel1') ? 'funnel1' : 'funnel';

  const superProps: Record<string, string> = { funnel_variant };
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'].forEach(k => {
    const v = url.searchParams.get(k);
    if (v) superProps[k] = v;
  });

  mixpanel.register(superProps);
}

export { mixpanel };
```

### 2. Landing Page Events

```ts
// On initial page load (fires once)
mixpanel.track('Funnel Step Viewed', {
  step: 1,
  step_name: 'Hook',
});

// On each section scroll
mixpanel.track('Section Scrolled', {
  section_name: 'how_it_works',
  scroll_depth_pct: 60,
});

// CTA click (intent)
mixpanel.track('Signup Intent', {
  cta_location: 'hero',
});
```

### 3. Funnel Step Tracking

```ts
// Every time user lands on a new step in the funnel
mixpanel.track('Funnel Step Viewed', {
  step: 2,
  step_name: 'How it Works',
});
// Steps: 1=Hook, 2=How it Works, 3=Example Markets, 4=Why Atlas, 5=Email Signup
```

### 4. Questionnaire Tracking

```ts
// When questionnaire starts
mixpanel.track('Questionnaire Started', {
  questionnaire_version: 'v1',
});

// For each answered question (optional but useful)
mixpanel.track('Question Answered', {
  question_id: 'q_age',
  question_number: 2,
  answer_value: '25-34',
});

// When all questions done
mixpanel.track('Questionnaire Completed', {
  questionnaire_version: 'v1',
  answers_count: 5,
  duration_seconds: 42,
});
```

### 5. Email Submit (primary conversion)

```ts
// After successful email submission
mixpanel.identify(email); // or use internal user id if available
mixpanel.people.set({
  $email: email,
  first_seen: new Date().toISOString(),
  funnel_variant, // from super props
});
mixpanel.track('Email Submitted', {
  source: 'landing_page_funnel',
});
```

## Meta Ads Campaign Structure

```
Campaign: Atlas LP — Cold Traffic (Lead Gen)
├── Ad Set: funnel
│   ├── Budget: 20€/day
│   ├── URL: https://atlas.xyz/funnel
│   └── Creatives: [Creative A, B, C]
└── Ad Set: funnel1
    ├── Budget: 20€/day
    ├── URL: https://atlas.xyz/funnel1
    └── Creatives: [Creative A, B, C]  (same creatives, only LP differs)
```

**Wichtig für clean A/B:** Beide Ad Sets sollten **identische Creatives** haben, damit der Unterschied _nur_ in der Landing Page liegt. Wenn du unterschiedliche Creatives testen willst, nimm Ad-Level Split innerhalb eines Ad Sets.

## Mixpanel Reports (bereits gebaut)

Query IDs für Dashboard:
- `978afac5` — Total Email Leads (KPI)
- `460e34fd` — Email Submits by Ad Set (utm_content × funnel_variant)
- `768cc99e` — Full Funnel Conversion (steps, breakdown funnel_variant)
- `dd3339db` — Daily Traffic per Variant
- `9754b1df` — Questionnaire Completion by variant
- `3b4cf541` — Drop-off per Step
- `67d8998d` — UTM Source × Campaign

Dashboard-Bau wartet auf Report-Limit Cleanup (siehe Slack).
