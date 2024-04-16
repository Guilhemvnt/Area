
const express = require('express');
const moment = require('moment');

const aboutRouter = express.Router();

aboutRouter.get('/about.json', (req, res) => {
  const clientHost = req.ip.split(':').pop();

  const response = {
    client: {
      host: clientHost
    },
    server: {
      current_time: moment().unix(),
      services: [
        {
          name: "Discord",
          actions: [
            {
              name: "SendMsgDiscord",
              description: "'!draft' is sent in a discord channel"
            }
          ],
          reactions: []
        },
        {
          name: "Binance",
          actions: [
            {
              name: "GetCrypto€",
              description: "get the value of bitcoin in euro"
            },
            {
              name: "GetCrypto$",
              description: "get the value of bitcoin in dollar"
            }
          ],
          reactions: []
        },
        {
          name: "Gmail",
          actions: [],
          reactions: [
            {
              name: "GetEmailGmail",
              description: "send the first draft of your gmail"
            }
          ]
        },
        {
          name: "Notebooks",
          actions: [
            {
              name: "GetNotebooks",
              description: "Get a list of notebooks"
            }
          ],
          reactions: [
            {
              name: "CreateNotebook",
              description: "Create a new notebook"
            }
          ]
        },
        {
          name: "Teams",
          actions: [
            {
              name: "GetMsgTeams",
              description: "Get a list of msg from a channel"
            }
          ],
          reactions: [
            {
              name: "SendMsgTeams",
              description: "Create a new message in a channel"
            }
          ]
        },
        {
          name: "OneDrive",
          actions: [
            {
              name: "GetFiles",
              description: "List files in OneDrive"
            }
          ],
          reactions: [
            {
              name: "CreateFolder",
              description: "create a folder in OneDrive"
            }
          ]
        },
        {
          name: "Outlook",
          actions: [
            {
              name: "GetMailOutlook",
              description: "get mails content from outlook"
            }
          ],
          reactions: [
            {
              name: "SendMailOutlook",
              description: "send mail from outlook"
            }
          ]
        }
      ]
    }
  };

  const formattedResponse = JSON.stringify(response, null, 4);

  res.setHeader('Content-Type', 'application/json');
  res.send(formattedResponse);
});

module.exports = aboutRouter;
