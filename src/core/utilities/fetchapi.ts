const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  const response = await fetch(`${endpoint}`, {
    ...options,
    headers,
  })

  return {
    data: await response.json(),
    response,
  }
}

export default fetchApi
