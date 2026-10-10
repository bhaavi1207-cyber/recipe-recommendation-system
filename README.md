# Recipe Recommendation System

A React app that recommends recipes by matching ingredients you already have. This is a rule-based, content-based recommender, not a trained machine-learning model.

## Features

- 12 original demonstration recipes with quantities and cooking steps.
- Comma-separated ingredient input with a small explicit alias dictionary.
- Explainable ingredient coverage, matched ingredients and missing ingredients.
- Vegan/vegetarian, estimated preparation-time and exact-name exclusion filters.
- Saved recipes in browser local storage, with a visible storage-failure notice.
- Responsive cards, labeled controls, keyboard focus and a useful no-results state.

No backend, account, API key or paid service is needed. Recipe times are estimates. These recipes have not been cooking-tested. The app gives no nutrition or allergy safety guarantee. Read food labels and check dietary needs independently.

## Run locally

Requires Node.js 18 or newer and npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Open the local URL printed by Vite. `npm run build` creates `dist/` for a static host. The package lock records dependency versions.

## Recommendation method

1. Normalize ingredient names to lower case, trim whitespace and apply explicit aliases such as chickpeas -> chickpea.
2. Remove duplicate pantry entries.
3. Filter recipes by diet, time, excluded ingredients and saved-only choice.
4. Score each recipe: `round(100 * matched ingredient count / recipe ingredient count)`.
5. With a nonempty pantry, omit recipes with no matching ingredients. With an empty pantry, show all eligible recipes.
6. Sort by score descending, missing count ascending, estimated time ascending, then stable recipe ID. An empty pantry sorts by estimated time, then recipe ID.

Vegetarian includes vegan recipes. Vegan excludes the sample recipes containing dairy or eggs. Exact-name exclusions do not infer allergens or related ingredients. Matching uses recipe ingredient names, not fuzzy matching or nutrition data.

## Structure

- `src/recipes.mjs`: original sample data.
- `src/recommend.mjs`: pure matching functions and safe storage helpers.
- `src/RecipeApp.jsx`: React controls, result cards and saved state.
- `src/main.jsx`: browser entrypoint.
- `src/style.css`: responsive layout and focus treatment.
- `tests/recommend.test.mjs`: Node tests for matching, filters, storage and data integrity.
- `WALKTHROUGH.md`: plain-language code guide and interview practice.

## Tests and limits

Tests cover aliases, duplicate input, full/partial coverage, ingredient exclusions, vegan/time filters, no-match/empty states, saved-only filtering, storage round trips/failure, vegetarian inclusion and dataset integrity. A production build is also checked.

This is a small deterministic portfolio project, not a personalized nutrition service. There is no collaborative persistence, meal planning, login, server or learned preference model. An unknown ingredient can yield no results. The dataset is intentionally small; use it to demonstrate the pipeline honestly rather than claim measured recommendation accuracy.

## Data and assets

Recipe descriptions were written for this demonstration. No third-party recipe text or photographs are included. The source project has no external data calls.
