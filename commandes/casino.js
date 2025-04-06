/*const { zokou } = require('../framework/zokou');

zokou(
  {
    nomCom: 'casino',
    reaction: '🎰',
    categorie: 'ECONOMY'
  },
  async (origineMessage, zk, commandeOptions) => {
    const { repondre, auteurMessage, arg } = commandeOptions;

    const game = arg[0]; // Le type de jeu à lancer

    if (!game) {
      return repondre(`*🎰 Bienvenue au Mini-Casino SRPN !*\nVoici les jeux disponibles :\n\n1. \`casino pile\` - Pile ou Face\n2. \`casino de\` - Lance un dé\n3. \`casino slot\` - Machine à fruits`);
    }

    switch (game.toLowerCase()) {
      case 'pile':
        const pileOuFace = Math.random() < 0.5 ? 'PILE' : 'FACE';
        return repondre(`*🪙 Résultat :* ${pileOuFace}`);
      
      case 'de':
        const de = Math.floor(Math.random() * 6) + 1;
        return repondre(`*🎲 Tu as lancé...* **${de}** !`);
      
      case 'slot':
        const fruits = ['🍒', '🍋', '🍇', '🍊', '🔔'];
        const spin = () => fruits[Math.floor(Math.random() * fruits.length)];
        const r1 = spin(), r2 = spin(), r3 = spin();
        const result = `${r1} | ${r2} | ${r3}`;
        const win = r1 === r2 && r2 === r3;

        return repondre(`🎰 Résultat : ${result}\n${win ? '✨ JACKPOT ! Tu gagnes !' : 'Pas de chance cette fois...'}`);
      
      default:
        return repondre('Jeu non reconnu. Utilise `casino`, `casino pile`, `casino de` ou `casino slot`.');
    }
  }
);*/