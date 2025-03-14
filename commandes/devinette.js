const { zokou } = require('../framework/zokou');

// Liste des devinettes avec questions et réponses
const devinettes = [
  {
    question: "Je peux voler sans ailes, qui suis-je ?",
    reponse: "Le vent",
  },
  {
    question: "Je suis toujours affamé, plus je mange, plus je grossis. Qui suis-je ?",
    reponse: "Un trou noir",
  },
  {
    question: "Je suis fort quand je suis à terre, mais faible quand je suis debout. Qui suis-je ?",
    reponse: "Le chiffre 6",
  },
  {
    question: "Je peux être court ou long, dur ou doux, je peux être utilisé par n'importe qui, des enfants aux musiciens expérimentés. Qui suis-je ?",
    reponse: "Un crayon",
  },
  {
    question: "Je suis le début de la fin, la fin de chaque lieu. Je suis le début de l'éternité, la fin du temps et de l'espace. Qui suis-je ?",
    reponse: "La lettre 'e'",
  },
  {
    question: "Je suis blanc quand je suis sale et noir quand je suis propre. Qui suis-je ?",
    reponse: "Une ardoise",
  },
  {
    question: "Je suis liquide, mais si tu enlèves l'eau de moi, je deviens solide. Qui suis-je ?",
    reponse: "Le thé",
  },
  {
    question: "Je vole sans ailes, je pleure sans yeux. Où que je sois, la mort m'accompagne toujours. Qui suis-je ?",
    reponse: "Le vent",
  },
  {
    question: "J'ai des villes, mais pas de maisons. J'ai des montagnes, mais pas d'arbres. J'ai de l'eau, mais pas de poissons. Qui suis-je ?",
    reponse: "Une carte",
  },
  {
    question: "Je peux être lu, mais tu ne peux pas écrire sur moi. Tu me donnes toujours, mais tu me gardes rarement. Qui suis-je ?",
    reponse: "Un livre emprunté",
  },
  {
    question: "Je viens deux fois par semaine, une fois par an, mais jamais en un jour. Qui suis-je ?",
    reponse: "La lettre 'E'",
  },
  {
    question: "Je suis difficile à saisir, mais tu me tiendras dans ta main quand tu me trouveras. Qui suis-je ?",
    reponse: "Ton souffle",
  },
  {
    question: "Plus je suis chaud, plus je deviens froid. Qui suis-je ?",
    reponse: "Le café",
  },
  {
    question: "Je suis fait de rêves. Je recouvre les idées brisées. Je transforme les âmes en ailes. Qui suis-je ?",
    reponse: "Un livre",
  },
  {
    question: "Je suis blanc quand je suis sale et noir quand je suis propre. Qui suis-je ?",
    reponse: "Une ardoise",
  },
  {
    question: "Je peux voler sans avoir des ailes. Je peux pleurer sans avoir des yeux. Qui suis-je ?",
    reponse: "Un nuage",
  },
  {
    question: "Je commence la nuit et je termine le matin. Qui suis-je ?",
    reponse: "La lettre 'N'",
  },
  {
    question: "Je peux être lu, mais tu ne peux pas écrire sur moi. Tu me donnes toujours, mais tu me gardes rarement. Qui suis-je ?",
    reponse: "Un livre emprunté",
  },
  {
    question: "Je me nourris de tout ce qui m'entoure, l'air, la terre et même les arbres. Qui suis-je ?",
    reponse: "Un feu",
  },
  {
    question: "Je suis blanc quand je suis sale et noir quand je suis propre. Qui suis-je ?",
    reponse: "Une ardoise",
  },
  {
    question: "Je suis liquide, mais si tu enlèves l'eau de moi, je deviens solide. Qui suis-je ?",
    reponse: "Le thé",
  },
  {
    question: "Je suis le début de la fin et la fin de chaque lieu. Je suis le début de l'éternité, la fin du temps et de l'espace. Qui suis-je ?",
    reponse: "La lettre 'E'",
  },
  {
    question: "Je suis difficile à saisir, mais tu me tiendras dans ta main quand tu me trouveras. Qui suis-je ?",
    reponse: "Ton souffle",
  },
];

zokou({ nomCom: "devinette", categorie: "ECONOMY" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;

  // Choisir une devinette au hasard
  const devinette = devinettes[Math.floor(Math.random() * devinettes.length)];
  
  // Envoyer la question de la devinette
  await zk.sendMessage(
    dest,
    {
      text: `Devinette : ${devinette.question}.\n Tu as 30 secondes pour réfléchir.`,
    },
    { quoted: ms }
  );

  // Attendre 30 secondes avant d'envoyer la réponse
  await delay(30000);

  // Réponse
  await zk.sendMessage(
    dest,
    {
      text: `La réponse était : ${devinette.reponse}`,
    },
    { quoted: ms }
  );
});

// Fonction pour créer une pause/délai en millisecondes
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}