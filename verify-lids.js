const zk = require('./index'); // Votre instance Baileys
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "myjid", categorie: "Debug" }, async (_, zk) => {
  console.log("JID du bot:", zk.user.id);
  console.log("LID du bot:", zk.user.lid);
});

// Remplacez ces exemples par vos VRAIS JIDs/LIDs
const testJids = [
  '120363416104095335@g.us',          // JID de groupe (à remplacer)
  '2250140718560.whatsapp.net', // JID utilisateur (à remplacer)
  '154966966710432@lid',            // LID existant (à remplacer)
  'invalid_jid'                // Test d'erreur (gardez-le)
];

// 1. Test de conversion basique
console.log("=== Test de conversion ===");
testJids.forEach(jid => {
  console.log(`Original: ${jid.padEnd(25)} -> Converti: ${zk.convertToLid(jid)}`);
});

// 2. Test avec des méthodes réelles (remplacez par vos IDs)
console.log("\n=== Test des méthodes ===");
const TEST_GROUP_JID = '120363318231484113@g.us'; // ⚠️ À remplacer par un vrai JID de groupe
const TEST_USER_JID = '2250554191184@s.whatsapp.net'; // ⚠️ À remplacer par un vrai JID user

(async () => {
  try {
    // Test groupMetadata
    console.log("\nTest groupMetadata:");
    const group = await zk.groupMetadata(convertToLid(TEST_GROUP_JID));
    console.log(`Succès: ${group.id} (${group.subject})`);

    // Test sendMessage (remplacez le contenu)
    console.log("\nTest sendMessage:");
    await zk.sendMessage(convertToLid(TEST_GROUP_JID), { text: "Test LID" });
    console.log("Message envoyé avec succès");

    // Test groupParticipantsUpdate (remplacez le participant)
    console.log("\nTest participants:");
    await zk.groupParticipantsUpdate(
      convertToLid(TEST_GROUP_JID),
      [convertToLid(TEST_USER_JID)],
      'promote'
    );
    console.log("Participant mis à jour");

  } catch (e) {
    console.error("Échec du test:", e.message);
  }
})();
