const fs = require('fs');
const path = require('path');

// Fonction de conversion universelle
const convertToLid = (jid) => {
  if (!jid || typeof jid !== 'string') return jid;
  return jid.replace(/@g\.us$/, '@lid').replace(/@s\.whatsapp\.net$/, '@lid');
};

// Patch automatique pour tous les appels d'API
const patchFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Patterns à remplacer
  const patterns = {
    // Groupes
    'groupMetadata\(([^)]+)\)': 'groupMetadata(convertToLid($1))',
    'groupFetchAllParticipating\(\)': 'groupFetchAllParticipating().then(groups => Object.fromEntries(Object.entries(groups).map(([id, data]) => [convertToLid(id), data])))',
    'groupParticipantsUpdate\(([^,]+),': 'groupParticipantsUpdate(convertToLid($1),',
    
    // Messages
    'sendMessage\(([^,]+),': 'sendMessage(convertToLid($1),',
    'downloadAndSaveMediaMessage\(([^)]+)\)': 'downloadAndSaveMediaMessage(convertToLid($1))',
    
    // Générique
    'jidDecode\(([^)]+)\)': 'jidDecode(convertToLid($1))'
  };

  // Application des patches
  Object.entries(patterns).forEach(([pattern, replacement]) => {
    content = content.replace(new RegExp(pattern, 'g'), replacement);
  });

  // Injection de la fonction en haut du fichier
  if (!content.includes('function convertToLid')) {
    content = `// Auto-injected LID converter\n${convertToLid.toString()}\n\n${content}`;
  }

  fs.writeFileSync(filePath, content);
};

// Exécution sur index.js
patchFile(path.join(__dirname, 'index.js'));
console.log('LID conversion applied successfully!');
