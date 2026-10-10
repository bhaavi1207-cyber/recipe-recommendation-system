import React, {useMemo,useState} from 'react';
import {recipes} from './recipes.mjs'; import {parseIngredients,recommend,readFavorites,writeFavorites} from './recommend.mjs';
export default function RecipeApp({favorites,setFavorites,storageMessage=''}) {
 const [pantry,setPantry]=useState('tomato, chickpeas, cucumber'); const [excluded,setExcluded]=useState(''); const [diet,setDiet]=useState('all'); const [maxMinutes,setMaxMinutes]=useState(60); const [savedOnly,setSavedOnly]=useState(false);
 const results=useMemo(()=>recommend(recipes,{pantry:parseIngredients(pantry),excluded:parseIngredients(excluded),diet,maxMinutes,savedOnly,saved:favorites}),[pantry,excluded,diet,maxMinutes,savedOnly,favorites]);
 const reset=()=>{setPantry('');setExcluded('');setDiet('all');setMaxMinutes(60);setSavedOnly(false);};
 const toggle=id=>setFavorites(favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id]);
 return <>
 <section className="recipe-controls" aria-label="Recipe filters">
 <label>Your ingredients <span className="hint">Separate with commas. Try tomato, chickpeas, cucumber.</span><input value={pantry} onChange={e=>setPantry(e.target.value)} placeholder="Enter ingredients" /></label>
 <label>Exclude ingredients <span className="hint">Exact names only. Not an allergy safety check.</span><input value={excluded} onChange={e=>setExcluded(e.target.value)} placeholder="For example, peanut butter" /></label>
 <div className="controls-grid"><fieldset><legend>Diet</legend><div className="choices">{[['all','All'],['vegetarian','Vegetarian'],['vegan','Vegan']].map(([value,label])=><button key={value} aria-pressed={diet===value} onClick={()=>setDiet(value)}>{label}</button>)}</div></fieldset>
 <fieldset><legend>Maximum estimated time</legend><div className="choices">{[10,15,20,30,60].map(n=><button key={n} aria-pressed={maxMinutes===n} onClick={()=>setMaxMinutes(n)}>{n} min</button>)}</div></fieldset></div>
 <div className="filter-actions"><label className="checkbox"><input type="checkbox" checked={savedOnly} onChange={e=>setSavedOnly(e.target.checked)}/> Saved only ({favorites.length})</label><button className="secondary" onClick={reset}>Reset filters</button></div>
 <p className="hint" role="status">{storageMessage}</p>
 </section>
 <div className="result-heading"><h2>{results.length} {results.length===1?'recipe':'recipes'}</h2><p>{parseIngredients(pantry).length?'Sorted by ingredient coverage':'Browse recipes by estimated time'}</p></div>
 <p className="hint">Score = ingredients you have / listed ingredients. Pantry salt and water are not scored. All times are estimates.</p>
 {results.length===0?<div className="empty" role="status"><h3>No recipes match these filters</h3><p>Try fewer exclusions, a longer time limit or different ingredients. If Saved only is on, save a recipe first.</p><button onClick={reset}>Browse all recipes</button></div>:<div className="recipe-grid">{results.map(r=><article className="recipe-card" key={r.id}>
 <div className="card-top"><span>{r.diet} · about {r.minutes} min</span><button aria-label={`${favorites.includes(r.id)?'Unsave':'Save'} ${r.name}`} aria-pressed={favorites.includes(r.id)} className="save" onClick={()=>toggle(r.id)}>{favorites.includes(r.id)?'Saved':'Save'}</button></div>
 <h3>{r.name}</h3><p className="score">{r.score}% ingredient coverage ({r.matched.length}/{r.ingredients.length})</p>
 <p><strong>Have:</strong> {r.matched.join(', ')||'No ingredients entered'}</p><p><strong>Need:</strong> {r.missing.join(', ')||'All listed ingredients matched'}</p>
 <details><summary>Ingredients and steps</summary><ul>{r.amounts.map(a=><li key={a}>{a}</li>)}</ul><ol>{r.steps.map(s=><li key={s}>{s}</li>)}</ol></details>
 </article>)}</div>}
 <aside className="notice"><strong>Before cooking</strong><p>These are original demo recipes, not tested nutrition or medical advice. Read ingredient labels and check your own dietary needs. Exact-name exclusions cannot detect traces, substitutes or cross-contamination.</p></aside>
 <details className="how"><summary>How recommendations work</summary><p>The app normalizes ingredient names, removes duplicate entries, filters by diet, exclusions and time, then sorts by ingredient coverage. With cucumber alone, the five-ingredient chickpea salad scores 1 / 5 = 20%. It is a rule-based recommender, not a trained machine-learning model.</p></details>
 </>;
}
export function StandaloneApp(){ const [favorites,setFav]=useState(()=>{try{return readFavorites(window.localStorage);}catch{return [];}}); const [message,setMessage]=useState('Favorites stay on this browser.'); const save=ids=>{setFav(ids);try{setMessage(writeFavorites(window.localStorage,ids)?'Favorites saved on this browser.':'Storage is unavailable. Favorites last only while this page is open.');}catch{setMessage('Storage is unavailable. Favorites last only while this page is open.');}}; return <main><header><p className="eyebrow">A small ingredient-matching project</p><h1>Recipe Recommendation</h1><p>Find a meal using ingredients you already have.</p></header><RecipeApp favorites={favorites} setFavorites={save} storageMessage={message}/><footer>12 original demo recipes. No account, API key or external service needed.</footer></main>;}
