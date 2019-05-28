const handleResponse = (response) => {
  let contentType = response.headers.get('content-type')
  if (contentType.includes('text/html')) {
    return handleTextResponse(response)
  } else {
    return handleJSONResponse(response)
    // Other response types as necessary. I haven't found a need for them yet though.
    // throw new Error(`Sorry, content-type ${contentType} not supported`)
  }
}
const handleJSONResponse = (response) =>
  response.json()
    .then(json => {
      if (response.ok) {
        return json
      } else {
        return Promise.reject(Object.assign({}, json, {
          status: response.status,
          statusText: response.statusText
        }))
      }
    })

const handleTextResponse = (response) => response.text()
  .then(text => {
    if (response.ok) {
      return text;
    } else {
      return Promise.reject(Object.assign({
        status: response.status,
        statusText: response.statusText,
        err: text
      }))
    }
  })

// export default (url, )
const dataFetch = (url, options = {}) =>
  fetch(url, {
    ...{
      credentials: 'include'
    },
    ...options
  })
    .then(handleResponse);

export const postFetch = (url, data, options = {}) => {
  const { headers = {}, ...rest } = options;
  return fetch(url, {
    ...{
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
      body: JSON.stringify(data)
    },

  })
    .then(handleResponse)
};

dataFetch.post = postFetch;

export default dataFetch;
