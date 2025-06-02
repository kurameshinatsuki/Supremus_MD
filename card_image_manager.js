const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'card_images.json');

function chargerCartes() {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function enregistrerCartes(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function ajouterLienCarte(nom, lien) {
  const cartes = chargerCartes();
  cartes[nom] = lien;
  enregistrerCartes(cartes);
}

function getLienCarte(nom) {
  const cartes = chargerCartes();
  return cartes[nom] || null;
}

module.exports = {
  ajouterLienCarte,
  getLienCarte,
  chargerCartes
};