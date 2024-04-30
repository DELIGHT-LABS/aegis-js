import { URL } from "url";

interface Fort {
  url: URL;
}

class Citadel {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private forts: Fort[];

  constructor(urls: URL[]) {
    this.forts = urls.map(url => ({ url }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public store(shares: any[]): void {
    // Implementation goes here
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public retrieve(keys: string[]): any[][] {
    // Implementation goes here
    return [];
  }
}

export { Citadel };
