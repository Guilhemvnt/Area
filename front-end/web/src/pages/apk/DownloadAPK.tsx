import React from 'react';

const DownloadAPK = () => {
  const handleDownload = () => {
    const url = 'http://localhost:8081/client.apk';

    // Create an <a> element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'client.apk';

    // Check if the <a> element has been added to the DOM before triggering the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <h1>APK</h1>
      <button onClick={handleDownload}>Download APK</button>
    </div>
  );
};

export default DownloadAPK;
