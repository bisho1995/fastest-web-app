export default class BaseClient {
  protected get(url: string, options?: Record<string, any>) {
    return fetch(url, options);
  }
}
