const { google } = require('googleapis');

/**
 * Envoie un e-mail via l'API Gmail.
 * @param {google.auth.OAuth2} auth Un client OAuth2 autorisé.
 * @param {string} toAdresse L'adresse e-mail du destinataire.
 * @param {string} sujet Le sujet de l'e-mail.
 * @param {string} corps Le corps de l'e-mail.
 */
async function envoyerEmail(auth, toAdresse, sujet, corps) {
  const gmail = google.gmail({ version: 'v1', auth });

  try {
    const message = `
      From: Votre Adresse <votre_email@gmail.com>
      To: ${toAdresse}
      Subject: ${sujet}

      ${corps}
    `;

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: Buffer.from(message).toString('base64'),
      },
    });

    console.log('Message envoyé avec succès :', response.data);
  } catch (erreur) {
    console.error('Erreur lors de l\'envoi du message :', erreur);
  }
}

const destinataire = 'destinataire@example.com';
const sujetEmail = 'Sujet de l\'e-mail';
const corpsEmail = 'Contenu de l\'e-mail';

envoyerEmail(auth, destinataire, sujetEmail, corpsEmail);
