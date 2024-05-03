import { URL } from "url";
import { Payload } from "../aegis/aegis";

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

  public async store(payloads: Payload[], key: Uint8Array) {
    if (payloads.length !== this.forts.length) {
      throw new Error("Payloads and Fort do not match");
    }

    const strKey = Buffer.from(key).toString("base64");

    const responses = [];
    for (let i = 0; i < payloads.length; i++) {
      // encode to base64
      const data = Buffer.from(payloads[i]).toString("base64");

      const res = this.postSecret(this.forts[i], strKey, data, true);
      responses.push(res);
    }

    await Promise.all(responses);
  }

  public async retrieve(key: Uint8Array): Promise<Payload[]> {
    const strKey = Buffer.from(key).toString("base64");

    const responses: Promise<string>[] = [];
    this.forts.map(async fort => {
      const res = this.getSecret(fort, strKey);
      responses.push(res);
    });

    const res: Payload[] = [];
    await Promise.allSettled(responses)
      .then(promisedRes => {
        for (let i = 0; i < promisedRes.length; i++) {
          if (promisedRes[i].status === "rejected") {
            continue;
          }

          const pr = promisedRes[i] as PromiseFulfilledResult<string>;
          res.push(Buffer.from(pr.value));
        }
      })
      .catch(err => {
        console.error(err);
      });

    return res;
  }

  private async postSecret(fort: Fort, id: string, secret: string, overwrite: boolean = true) {
    const response = await fetch(`${fort.url.href}api/v0/secret`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${fort.token}`,
      },
      body: JSON.stringify({
        overwrite,
        secret,
        id,
      }),
    });

    if (!response.ok || response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // return await response.json();
    return;
  }

  private async getSecret(fort: Fort, id: string) {
    const response = await fetch(`${fort.url.href}api/v0/secret/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/text",
        Authorization: `Bearer ${fort.token}`,
      },
    });

    if (!response.ok || response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  }
}

export { Citadel };
