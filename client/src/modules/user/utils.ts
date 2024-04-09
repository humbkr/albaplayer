export function userHasRole(user?: User, role?: Role) {
  return role && user?.roles?.includes(role)
}
