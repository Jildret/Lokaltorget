export function getErrorMessage(err: any): string {
  const detail = err.response?.data?.detail

  if (!detail) return 'Något gick fel. Försök igen.'

  // Pydantic-valideringsfel kommer som en lista
  if (Array.isArray(detail)) {
    return detail.map((d: any) => d.msg).join(', ')
  }

  // Vanliga fel (från våra egna HTTPException) är en enkel textsträng
  return detail
}