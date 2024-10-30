const checkStatus = (response) => {
  if (response.ok) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

const parseJson = (res) => res.json()

const _fetch = ({path, method, data}) => {
  return fetch(path, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJson)
}

const Fetcher = {
  get: (path, params) => fetch(path, params).then(checkStatus).then(parseJson),
  post: (path, data) => _fetch({path, method: 'POST', data}),
  put: (path, data) => _fetch({path, method: 'PUT', data}),
}

export default Fetcher
