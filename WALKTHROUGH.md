# Understand the project

## The one-minute explanation

"This app recommends a recipe from the ingredients entered by the user. It compares the pantry with each recipe's ingredient list, filters unsuitable recipes, and sorts by ingredient coverage. React updates the results when a filter changes. Favorites are stored in the same browser. The method is explainable and rule-based, not a trained AI model."

Only present this explanation after you can demonstrate the code and describe your own contribution accurately.

## Follow one example

Enter `cucumber` in the pantry field. The chickpea salad requires chickpea, cucumber, tomato, lemon and olive oil. One of its five ingredients matches, so it scores 20%. "Have" shows cucumber and "Need" shows the other four ingredients. Enter all five and it scores 100%. This percentage measures ingredient coverage only, not taste, health or model accuracy.

## Read the files in this order

1. `recipes.mjs`: each object has an ID, name, estimated minutes, diet, ingredients, quantities and steps. IDs stay stable when recipes are reordered.
2. `recommend.mjs`: `normalize` cleans one name; `parseIngredients` splits input and removes duplicates. `recommend` filters, calculates matched/missing arrays and sorts. It receives data and returns new result objects rather than changing the original recipes.
3. `RecipeApp.jsx`: `useState` stores input fields and filters. `useMemo` recalculates results when these values change. A result card displays the same fields returned by the matching function. The Save button adds/removes an ID.
4. `StandaloneApp`: owns favorites and the storage message. `readFavorites` safely handles missing or corrupt browser data; `writeFavorites` reports storage failure. Favorites are browser-local, not synchronized.
5. `style.css`: the grid uses two columns on wide screens and one on phones. Focus outlines help keyboard users. Details/summary reveals ingredients and steps without a custom modal.
6. `tests/recommend.test.mjs`: isolated tests check known input/output pairs. Run `npm test` and read each name.

## Why this design

Pure matching functions can be tested without opening a browser. Local recipe data makes the project run without paid APIs or credentials. The overlap score is easy to explain but limited: common ingredients may dominate, and it does not understand preference or nutrition. Separating the dataset, algorithm and UI makes future changes easier.

## Interview questions to practice

- Why is this content-based? It compares the recipe's ingredient content to the pantry.
- Is it machine learning? No. No model was trained and there is no accuracy metric.
- What does 60% mean? Three of five listed ingredients are present.
- Why deduplicate? Repeating tomato should not improve a score.
- Why stable IDs? Saved favorites should survive sorting and dataset rearrangement.
- What does useMemo do here? It avoids recalculating derived results unless an input dependency changes. This small dataset does not require it for performance.
- What happens if local storage fails? The app retains current-page favorites and shows that persistence is unavailable.
- Is it safe for allergies? No. Exact string matching cannot detect all allergens, substitutions, traces or cross-contamination.
- How would you improve it? Add a verified licensed dataset, stronger ingredient normalization and user-tested ranking. Evaluate recommendations against a defined test set before claiming better quality.

## A feature to build yourself

Add a "Maximum missing ingredients" filter. Start with state in `RecipeApp.jsx`, add a labeled control, pass the value to `recommend`, filter on `missing.length`, then write tests for zero missing ingredients and a relaxed limit. Explain your decisions in a short commit message. Do not claim the feature until it exists and passes tests.

## Honest project description

"Ingredient-based recipe recommender built with React, deterministic ranking, dietary/time filters and browser-local favorites." Avoid claims about nutrition prediction, trained AI, measured accuracy, external APIs or personally writing every line unless those claims become true.
