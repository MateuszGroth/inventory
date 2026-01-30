import { API_URL } from '../constants'

export type FetchJsonOptions<ReqBody> = Partial<Omit<RequestInit, 'body'>> & {
  body?: ReqBody
}

export const fetchJson = async <Res, ReqBody = never>(
  url: string | URL,
  options: FetchJsonOptions<ReqBody> = {}
): Promise<Res | undefined> => {
  let urlPath = ''
  if (url instanceof URL) {
    urlPath = new URL(url, API_URL).toString()
  } else {
    urlPath = `${API_URL}${url}`
  }

  const body = options.body === undefined ? undefined : JSON.stringify(options.body)

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(urlPath, {
    ...options,
    body,
    headers,
  })

  if (response.status === 204) {
    return undefined as Res
  }

  const responseText = await response.text()
  const parsedResponse = responseText ? JSON.parse(responseText) : undefined
  if (!response.ok) {
    throw parsedResponse
  }

  return parsedResponse as Res
}
