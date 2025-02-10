interface RouteData {
  path: string
  params?: Record<string, any>
}

export function isRouteData(data: any): data is RouteData {
  return typeof data === "object" && data !== null && "path" in data
}
