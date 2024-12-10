/* tslint:disable */
/* eslint-disable */
/**
 * Run entry point for the main thread.
 */
export function startup(): void;
export class Posts {
  private constructor();
  free(): void;
  static new(): Posts;
  static init_sqlite(): Promise<void>;
  create_post(title: string, body: string, published: boolean): number;
  delete_post(id: number): number;
  clear(): number;
  list_posts(): any[];
}
export class Version {
  private constructor();
  free(): void;
}
