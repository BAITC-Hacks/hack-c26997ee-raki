const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function postJson(path: string, body: unknown): Promise<unknown> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Не удалось связаться с сервером симуляции. Проверьте запуск backend и VITE_API_URL.')
  }

  if (!response.ok) {
    if (response.status === 422) {
      throw new ApiError('Сервер отклонил данные сценария (HTTP 422). Проверьте выбранные меры и районы.')
    }
    if (response.status >= 500) {
      throw new ApiError(`Ошибка сервера симуляции (HTTP ${response.status}). Повторите попытку позже.`)
    }
    throw new ApiError(`Не удалось выполнить симуляцию (HTTP ${response.status}).`)
  }

  try {
    return await response.json() as unknown
  } catch {
    throw new ApiError('Сервер симуляции вернул ответ не в формате JSON.')
  }
}
