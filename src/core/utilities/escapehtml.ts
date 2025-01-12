export const escapeHTML = (input: string): string => {
  const map = {
    "&": "&amp;", // Escape &
    "<": "&lt;", // Escape <
    ">": "&gt;", // Escape >
    '"': "&quot;", // Escape "
    "'": "&#039;", // Escape '
    "`": "&#x60;", // Escape `
  }

  return input.replace(/[&<>"'`]/g, function (match) {
    return map[match]
  })
}
