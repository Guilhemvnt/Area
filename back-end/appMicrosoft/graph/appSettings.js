// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

const settings = {
  'clientId': '1caa2e94-1b47-428b-ab26-0f87eb8f9546',
  'clientSecret': 'YOUR_CLIENT_SECRET_HERE_IF_USING_APP_ONLY',
  'tenantId': 'YOUR_TENANT_ID_HERE_IF_USING_APP_ONLY',
  'authTenant': 'common',
  'graphUserScopes': [
    'user.read',
    'mail.read',
    'mail.send',
    'calendars.readwrite',
    'Chat.ReadWrite',
    'Notes.ReadWrite',
    'Notes.Create',
    'Files.ReadWrite',
  ]
};
module.exports = settings;
