// Dream Interpretation - Lazy Load Version
// Loads dictionary only when user clicks interpret button

let dictionaryLoaded = false;
let dictionaryLoading = false;

// Dynamically load the dream dictionary
function loadDreamDictionary() {
  return new Promise((resolve, reject) => {
    if (typeof DREAM_DICTIONARY !== 'undefined') {
      dictionaryLoaded = true;
      resolve();
      return;
    }
    
    if (dictionaryLoading) {
      // Already loading, wait for it
      const checkInterval = setInterval(() => {
        if (typeof DREAM_DICTIONARY !== 'undefined') {
          clearInterval(checkInterval);
          dictionaryLoaded = true;
          resolve();
        }
      }, 100);
      return;
    }
    
    dictionaryLoading = true;
    console.log('📖 Loading dream dictionary...');
    
    // Dynamically load the script
    const script = document.createElement('script');
    script.src = 'dream_dictionary.js';
    script.onload = () => {
      dictionaryLoaded = true;
      dictionaryLoading = false;
      console.log('📖 Dream dictionary loaded!');
      resolve();
    };
    script.onerror = () => {
      dictionaryLoading = false;
      console.error('Failed to load dream dictionary');
      reject(new Error('Failed to load dictionary'));
    };
    document.head.appendChild(script);
  });
}

function extractKeywords(text) {
  const words = text.toLowerCase().replace(/[^\w\sáéíóúñü]/g, '').split(/\s+/);
  const keywords = [];
  
  const stems = ['agua', 'casa', 'muerte', 'amor', 'dinero', 'trabajo', 'enfermedad', 'viaje', 
                 'madre', 'padre', 'hijo', 'amigo', 'enemigo', 'lluvia', 'fuego', 'tierra',
                 'mar', 'sol', 'luna', 'estrella', 'árbol', 'flor', 'animal', 'pájaro', 'perro',
                 'gato', 'serpiente', 'cobra', 'león', 'tigre', 'oso', 'lobo', 'caballo', 'vaca',
                 'casa', 'puerta', 'ventana', 'escalera', 'suelo', 'techo', 'pared', 'habitación',
                 'coche', 'tren', 'avión', 'barco', 'camino', 'calle', 'puente', 'río', 'lago',
                 'manzana', 'uva', 'pan', 'carne', 'vino', 'sangre', 'diente', 'ojo', 'cabeza',
                 'mano', 'pie', 'corazón', 'sueño', 'pesadilla', 'niño', 'viejo', 'hombre', 'mujer'];
  
  words.forEach(word => {
    if (word.length > 3) {
      keywords.push(word);
      stems.forEach(stem => {
        if (word.includes(stem) && !keywords.includes(stem)) {
          keywords.push(stem);
        }
      });
    }
  });
  
  return [...new Set(keywords)];
}

function lookupDream(keyword) {
  if (typeof DREAM_DICTIONARY === 'undefined') {
    return null;
  }
  
  if (DREAM_DICTIONARY[keyword]) {
    return { keyword: keyword, spanish: keyword, meaning: DREAM_DICTIONARY[keyword] };
  }
  
  for (const key in DREAM_DICTIONARY) {
    if (key.includes(keyword) || keyword.includes(key)) {
      return { keyword: key, spanish: key, meaning: DREAM_DICTIONARY[key] };
    }
  }
  
  return null;
}

// Main function - loads dictionary if needed, then analyzes
async function analyzeDream(dreamText) {
  // Show loading state if dictionary not ready
  if (!dictionaryLoaded) {
    await loadDreamDictionary();
  }
  
  if (typeof DREAM_DICTIONARY === 'undefined') {
    return "Dream dictionary not available. Please try again.";
  }
  
  const keywords = extractKeywords(dreamText);
  const results = [];
  
  for (const keyword of keywords) {
    const result = lookupDream(keyword);
    if (result) {
      results.push(result);
    }
  }
  
  if (results.length === 0) {
    return "No specific meanings found. Try noting more details about objects, people, or emotions in your dream.";
  }
  
  return results.slice(0, 5).map(r => `• ${r.keyword}: ${r.meaning}`).join('\n\n');
}

// Legacy sync wrapper (shows loading if not ready)
function analyzeDreamSync(dreamText) {
  if (typeof DREAM_DICTIONARY === 'undefined') {
    // Trigger lazy load and show message
    loadDreamDictionary();
    return "Loading dream dictionary... 🔮";
  }
  return analyzeDream(dreamText);
}

console.log('💫 Dream interpreter ready (lazy load)');
