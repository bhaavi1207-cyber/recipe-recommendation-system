const aliases = {'chickpeas':'chickpea','chana':'chickpea','chick peas':'chickpea','tomatoes':'tomato','eggs':'egg','onions':'onion','peas':'pea','lentils':'lentil','oats':'oat','noodles':'noodle','beans':'bean','potatoes':'potato','mushrooms':'mushroom','yoghurt':'yogurt','garbanzo beans':'chickpea'};
export function normalize(value) { const text = String(value).trim().toLowerCase().replace(/\s+/g,' '); return aliases[text] || text; }
export function parseIngredients(text) { return [...new Set(text.split(/[,\n]/).map(normalize).filter(Boolean))]; }
export function recommend(recipes, {pantry=[],excluded=[],diet='all',maxMinutes=60,savedOnly=false,saved=[]}={}) {
 const have = new Set(pantry.map(normalize)); const avoid = new Set(excluded.map(normalize));
 return recipes.filter(r => r.minutes <= maxMinutes && (diet==='all' || (diet==='vegetarian' ? ['vegetarian','vegan'].includes(r.diet) : r.diet===diet)) && (!savedOnly || saved.includes(r.id)) && !r.ingredients.some(i=>avoid.has(normalize(i))))
 .map(r=>{const matched=r.ingredients.filter(i=>have.has(normalize(i))); const missing=r.ingredients.filter(i=>!have.has(normalize(i))); return {...r,matched,missing,score:Math.round(100*matched.length/r.ingredients.length)};})
 .filter(r=>have.size===0 || r.matched.length>0)
 .sort((a,b)=>have.size===0 ? a.minutes-b.minutes || a.id.localeCompare(b.id) : b.score-a.score || a.missing.length-b.missing.length || a.minutes-b.minutes || a.id.localeCompare(b.id));
}
export function readFavorites(storage) { try { const data=JSON.parse(storage.getItem('recipe-favorites.v1') || '[]'); return Array.isArray(data)?data.filter(x=>typeof x==='string'):[]; } catch {return [];} }
export function writeFavorites(storage, ids) {try {storage.setItem('recipe-favorites.v1',JSON.stringify(ids)); return true;} catch {return false;} }
