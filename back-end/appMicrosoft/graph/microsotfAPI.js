const settings = require('./appSettings');
const graphHelper = require('./graphHelper');

async function Login() {
  console.log('Log user in...');
  initializeGraph(settings);
}
module.exports.Login = Login;

function isLogged() {
  return graphHelper.isLogged();
}
module.exports.isLogged = isLogged;

function initializeGraph(settings, callback) {
  graphHelper.initializeGraphForUserAuth(settings, (info) => {
    console.log(info.message);

    const urlRegex = /https:\/\/microsoft\.com\/devicelogin/;
    const codeRegex = /enter the code (\w+)/;

    const urlMatch = info.message.match(urlRegex);
    const codeMatch = info.message.match(codeRegex);

    if (urlMatch && codeMatch) {
      const url = urlMatch[0];
      const code = codeMatch[1];

      callback({ url, code });
    }
  });
}
module.exports.initializeGraph = initializeGraph;

async function greetUserAsync() {
  try {
    const user = await graphHelper.getUserAsync();
    console.log(`Hello, ${user?.displayName}!`);
    console.log(`Email: ${user?.mail ?? user?.userPrincipalName ?? ''}`);
  } catch (err) {
    console.log(`Error getting user: ${err}`);
  }
}
module.exports.greetUserAsync = greetUserAsync;

async function displayAccessTokenAsync(callback) {
  try {
    const userToken = await graphHelper.getUserTokenAsync();
    callback(userToken);
  } catch (err) {
    callback(null, err);
  }
}
module.exports.displayAccessTokenAsync = displayAccessTokenAsync;

async function getInboxAsync(callback) {
  try {
    const messagePage = await graphHelper.getInboxAsync();
    const messages = messagePage.value;

    const ListEmail = [];
    for (const message of messages) {
      // console.log(`Message: ${message.subject ?? 'NO SUBJECT'}`);
      // console.log(`  From: ${message.from?.emailAddress?.name ?? 'UNKNOWN'}`);
      // console.log(`  Status: ${message.isRead ? 'Read' : 'Unread'}`);
      // console.log(`  Received: ${message.receivedDateTime}`);
      ListEmail.push(message.from.emailAddress.name);
      //callback(message.from.emailAddress.name);
    }
    callback(ListEmail);
    const moreAvailable = messagePage['@odata.nextLink'] != undefined;
    //console.log(`\nMore messages available? ${moreAvailable}`);
  } catch (err) {
    console.log(`Error getting user's inbox: ${err}`);
  }
}
module.exports.getInboxAsync = getInboxAsync;

async function sendMailAsync(subject, body, email) {
  try {
    const user = await graphHelper.getUserAsync();
    const userEmail = user?.mail ?? user?.userPrincipalName;

    if (!userEmail) {
      return;
    }

    await graphHelper.sendMailAsync(subject, body, email);
  } catch (err) {
    console.log(false, `Error sending mail: ${err}`);
  }
}
module.exports.sendMailAsync = sendMailAsync;

async function listUsersAsync() {
  try {
    const userPage = await graphHelper.getUsersAsync();
    const users = userPage.value;

    for (const user of users) {
      console.log(`User: ${user.displayName ?? 'NO NAME'}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.mail ?? 'NO EMAIL'}`);
    }
    const moreAvailable = userPage['@odata.nextLink'] != undefined;
    console.log(`\nMore users available? ${moreAvailable}`);
  } catch (err) {
    console.log(`Error getting users: ${err}`);
  }
}

async function getTeamsMsg(callback) {
  try {
    let res = await graphHelper.getTeamsMsg();
    callback(res);
  } catch (err) {
    console.log(`Error making Graph call: ${err}`);
  }
}
module.exports.getTeamsMsg = getTeamsMsg;

async function sendTeamsMsg(channelID, messageContent) {
  try {
    console.log('channelID:', channelID, 'msg:', messageContent);
    await graphHelper.sendTeamsMsg(channelID, messageContent);
  } catch (err) {
    console.log(`Error making Graph call: ${err}`);
  }
}
module.exports.sendTeamsMsg = sendTeamsMsg;

async function getNotebooks(callback) {
  try {
    let res = await graphHelper.getNotebooks();
    callback(res);
  } catch (err) {
    console.log(`Error making Graph call: ${err}`);
  }
}
module.exports.getNotebooks = getNotebooks;

async function createNotebook(notebookName, callback) {
  try {
    let res = await graphHelper.createNotebook(notebookName);
    callback(res);
  } catch (err) {
    console.log(`Error making Graph call: ${err}`);
  }
}
module.exports.createNotebook = createNotebook;

async function getFiles(callback) {
  try {
    let res = await graphHelper.getFiles();
    callback(res);
  } catch (err) {
    console.log(`Error making Graph call: ${err}`);
  }
}
module.exports.getFiles = getFiles;

async function createFolder(folderName, callback) {
  try {
    let res = await graphHelper.createFolder(folderName);
    callback(res);
  } catch (err) {
    console.log(`Error making Graph call: ${err}`);
  }
}
module.exports.createFolder = createFolder;

async function createSection(notebookName, sectionName, callback) {
  try {
    let res = await graphHelper.createSection(notebookName, sectionName);
    callback(res);
  } catch (err) {
    console.log(`Error making Graph call: ${err}`);
  }
}
module.exports.createSection = createSection;

async function getEmailConnected() {
  try {
    const user = await graphHelper.getUserAsync();
    const userEmail = user?.mail ?? user?.userPrincipalName;
    return userEmail;
  } catch (err) {
    console.log(`Error getting user: ${err}`);
  }
}
module.exports.getEmailConnected = getEmailConnected;