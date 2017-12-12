export default function xhrJsonGet(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.setRequestHeader('Accept', 'application/json');

    request.onload = () => {
      let response = request.responseText;
      let callError;

      try {
        response = JSON.parse(response);
      } catch (exception) {
        callError = exception;
      }

      if (request.status < 200 || request.status > 299) {
        callError = response;
        response = undefined;
      }

      if (callError) {
        callError.status = request.status;
        reject(callError);
      } else {
        resolve({status: request.status, body: response});
      }
    };

    request.onerror = reject;

    request.send();
  });
}
