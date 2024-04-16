// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// <UserAuthConfigSnippet>
require('isomorphic-fetch');
require('dotenv').config();

const azure = require('@azure/identity');
const graph = require('@microsoft/microsoft-graph-client');
const authProviders = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

let _settings = undefined;
let _deviceCodeCredential = undefined;
let _userClient = undefined;

function isLogged() {
  if (_userClient == undefined) {
    return false;
  }
  return true;
}
module.exports.isLogged = isLogged;

function initializeGraphForUserAuth(settings, deviceCodePrompt) {
  // Ensure settings isn't null
  if (!settings) {
    throw new Error('Settings cannot be undefined');
  }

  _settings = settings;

  _deviceCodeCredential = new azure.DeviceCodeCredential({
    clientId: settings.clientId,
    tenantId: settings.authTenant,
    userPromptCallback: deviceCodePrompt
  });

  const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
    _deviceCodeCredential, {
      scopes: settings.graphUserScopes
    });

  _userClient = graph.Client.initWithMiddleware({
    authProvider: authProvider
  });
}
module.exports.initializeGraphForUserAuth = initializeGraphForUserAuth;
// </UserAuthConfigSnippet>

// <GetUserTokenSnippet>
async function getUserTokenAsync() {
  // Ensure credential isn't undefined
  if (!_deviceCodeCredential) {
    throw new Error('Graph has not been initialized for user auth');
  }

  // Ensure scopes isn't undefined
  if (!_settings?.graphUserScopes) {
    throw new Error('Setting "scopes" cannot be undefined');
  }

  // Request token with given scopes
  const response = await _deviceCodeCredential.getToken(_settings?.graphUserScopes);
  console.log('display ad ', response.address, response.DeviceCodeCredential);
  return response;
}
module.exports.getUserTokenAsync = getUserTokenAsync;
// </GetUserTokenSnippet>

// <GetUserSnippet>
async function getUserAsync() {
  // Ensure client isn't undefined
  if (!_userClient) {
    throw new Error('Graph has not been initialized for user auth');
  }

  return _userClient.api('/me')
    // Only request specific properties
    .select(['displayName', 'mail', 'userPrincipalName'])
    .get();
}
module.exports.getUserAsync = getUserAsync;
// </GetUserSnippet>

// <GetInboxSnippet>
async function getInboxAsync() {
  // Ensure client isn't undefined
  if (!_userClient) {
    throw new Error('Graph has not been initialized for user auth');
  }

  return _userClient.api('/me/mailFolders/inbox/messages')
    .select(['from', 'isRead', 'receivedDateTime', 'subject'])
    .top(25)
    .orderby('receivedDateTime DESC')
    .get();
}
module.exports.getInboxAsync = getInboxAsync;
// </GetInboxSnippet>

// <SendMailSnippet>
async function sendMailAsync(subject, body, email) {
  // Ensure client isn't undefined
  if (!_userClient) {
    throw new Error('Graph has not been initialized for user auth');
  }

  // Create a new message
  const message = {
    subject: subject,
    body: {
      content: body.toString(),
      contentType: 'text'
    },
    toRecipients: [
      {
        emailAddress: {
          address: email
        }
      }
    ]
  };

  // Send the message
  return _userClient.api('me/sendMail')
    .post({
      message: message
    });
}
module.exports.sendMailAsync = sendMailAsync;
// </SendMailSnippet>

// <AppOnyAuthConfigSnippet>
let _clientSecretCredential = undefined;
let _appClient = undefined;

function ensureGraphForAppOnlyAuth() {
  // Ensure settings isn't null
  if (!_settings) {
    throw new Error('Settings cannot be undefined');
  }

  if (!_clientSecretCredential) {
    _clientSecretCredential = new azure.ClientSecretCredential(
      _settings.tenantId,
      _settings.clientId,
      _settings.clientSecret
    );
  }

  if (!_appClient) {
    const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
      _clientSecretCredential, {
        scopes: [ 'https://graph.microsoft.com/.default' ]
      });

    _appClient = graph.Client.initWithMiddleware({
      authProvider: authProvider
    });
  }
}
// </AppOnyAuthConfigSnippet>

async function getCalendarAsync() {
  // Ensure client isn't undefined
  if (!_userClient) {
    throw new Error('Graph has not been initialized for user auth');
  }

  const calendar = await _userClient.api('/me/calendar').get();
  return calendar;
}

module.exports.getCalendarAsync = getCalendarAsync;

// <GetUsersSnippet>
async function getUsersAsync() {
  ensureGraphForAppOnlyAuth();

  return _appClient?.api('/users')
    .select(['displayName', 'id', 'mail'])
    .top(25)
    .orderby('displayName')
    .get();
}
module.exports.getUsersAsync = getUsersAsync;
// </GetUsersSnippet>

async function getTeamsMsg() {
  if (!_userClient) {
    throw new Error('Graph has not been initialized for user auth');
  }

  try {
    let response = await _userClient.api('/chats/48:notes/messages')
      .top(1)
      .get();


    const messages = response.value; // Assuming 'response' contains the JSON response
    let listMsg = [];
    messages.forEach(message => {
      const body = message.body;
      if (body) {
        const messageText = body.content;
        listMsg.push(messageText.replace(/<[^>]*>?/gm, ''));
      }
    });
    return listMsg;
  } catch (error) {
    throw new Error(`Error searching for chat messages: ${error.message}`);
  }
}
module.exports.getTeamsMsg = getTeamsMsg;

async function sendTeamsMsg(channelID, messageContent) {
  try {
    const message = {
      body: {
        content: messageContent.toString(),
      }
    };
    await _userClient.api(`/chats/${channelID}/messages`)
      .post(message);
  } catch (err) {
    console.log(`Error getting user: ${err}`);
  }
}
module.exports.sendTeamsMsg = sendTeamsMsg;

async function getNotebooks() {
  try {
    let response = await _userClient.api('me/onenote/notebooks')
      .get();

    const notebooks = response.value;

    notebooks.sort((a, b) => new Date(b.lastModifiedDateTime) - new Date(a.lastModifiedDateTime));

    let notebookTitles = [];
    notebooks.forEach(notebook => {
      const title = notebook.displayName;
      if (title) {
        notebookTitles.push(title);
      }
    });
    return notebookTitles;
  } catch (error) {
    throw new Error(`Error searching for notebooks: ${error.message}`);
  }
}
module.exports.getNotebooks = getNotebooks;

async function createNotebook(notebookName) {
  try {
    const notebook = {
      displayName: notebookName,
    };
    await _userClient.api('/me/onenote/notebooks')
      .post(notebook);
  } catch (err) {
    console.log(`Error getting user: ${err}`);
  }
}
module.exports.createNotebook = createNotebook;

async function getFiles() {
  try {
    let response = await _userClient.api('/me/drive/root/children')
      .get();

    const files = response.value;

    // Sort the files by lastModifiedDateTime in descending order
    files.sort((a, b) => new Date(b.lastModifiedDateTime) - new Date(a.lastModifiedDateTime));

    let fileTitles = [];
    files.forEach(file => {
      const title = file.name;
      if (title) {
        fileTitles.push(title);
      }
    });
    return fileTitles;
  } catch (error) {
    throw new Error(`Error searching for files: ${error.message}`);
  }
}

module.exports.getFiles = getFiles;

async function createFolder(folderName) {
  try {
    const folder = {
      name: folderName.toString(),
      folder: {},
      '@microsoft.graph.conflictBehavior': 'rename'
    };
    await _userClient.api('/me/drive/root/children')
      .post(folder);
  } catch (err) {
    console.log(`Error getting user: ${err}`);
  }
}
module.exports.createFolder = createFolder;

async function createSection (notebookId, sectionName) {
  try {
    const section = {
      displayName: sectionName,
    };
    await _userClient.api(`/me/onenote/notebooks/${notebookId}/sections`)
      .post(section);
  } catch (err) {
    console.log(`Error getting user: ${err}`);
  }
}
module.exports.createSection = createSection;
