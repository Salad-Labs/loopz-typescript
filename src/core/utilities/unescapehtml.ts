export const unescapeHTML = (input: string): string => {
  const map = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&#x60;": "`",
  }

  return input.replace(
    /&amp;|&lt;|&gt;|&quot;|&#039;|&#x60;/g,
    function (match) {
      return map[match]
    }
  )
}
