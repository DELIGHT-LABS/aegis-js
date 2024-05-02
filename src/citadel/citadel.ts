import { URL } from "url";
import { Payload } from "../protocol/protocol";

interface Fort {
  token: string;
  url: URL;
}

class Citadel {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private forts: Fort[] = [];

  constructor(token: string, urls: URL[]) {
    this.forts = urls.map(url => ({ token, url }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public store(payload: Payload[], keys: string[]): void {
    // Implementation goes here
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public retrieve(keys: string[]): any[][] {
    // Implementation goes here
    return [];
  }
}

export { Citadel };
