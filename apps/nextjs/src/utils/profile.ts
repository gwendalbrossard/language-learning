/**
 * Extracts and returns the initials from the provided full name.
 * If the name doesn't have spacing, return the first 2 letters instead.
 */
export const getInitials = (name: string): string => {
  const parts = name.split(" ")
  if (parts.length === 1) {
    // If there's no space, return the first two characters
    return name.substring(0, 2)
  }
  // Ensuring that there's a second part before accessing it
  return `${parts[0]?.charAt(0)}${parts[1]?.charAt(0) ?? ""}`
}
