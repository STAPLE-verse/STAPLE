// Function to anymize user data
export function getAnonymizedUser(user: any) {
  return {
    ...user,
    firstName: "Anonymous",
    lastName: "Anonymous",
    username: "Anonymous",
  }
}
