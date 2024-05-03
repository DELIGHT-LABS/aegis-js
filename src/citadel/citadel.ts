import { URL } from "url";
import { Payload } from "../aegis/aegis";

interface Fort {
  token: string;
  url: URL;
}

interface PostSecretResponse {
  id: string;
}

interface GetSecretResponse {
  secret: string;
}

interface ErrorResponse {
  error: string;
  message: string;
}

class Citadel {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public forts: Fort[] = [];

  constructor(token: string, urls: URL[]) {
    this.forts = urls.map(url => ({ token, url }));
  }

  public async store(payloads: Payload[], key: Uint8Array) {
    if (payloads.length !== this.forts.length) {
      throw new Error("Payloads and Fort do not match");
    }

    const strKey = Buffer.from(key).toString("base64");

    const responses: Promise<PostSecretResponse | ErrorResponse>[] = [];
    for (let i = 0; i < payloads.length; i++) {
      // encode to base64
      const data = Buffer.from(payloads[i]).toString("base64");

      const res = this.postSecret(this.forts[i], strKey, data, true);
      responses.push(res);
    }

    await Promise.all(responses).then(res => {
      for (let i = 0; i < res.length; i++) {
        const r = res[i] as ErrorResponse;
        if (r.error) {
          throw new Error(`${r.error}: ${r.message}`);
        }
      }
    });
  }

  public async retrieve(key: Uint8Array): Promise<Payload[]> {
    const strKey = Buffer.from(key).toString("base64");

    const responses: Promise<GetSecretResponse | ErrorResponse>[] = [];
    this.forts.map(async fort => {
      const res = this.getSecret(fort, strKey);
      responses.push(res);
    });

    const res: Payload[] = [];
    await Promise.allSettled(responses).then(promisedRes => {
      for (let i = 0; i < promisedRes.length; i++) {
        if (promisedRes[i].status === "rejected") {
          continue;
        }

        const pr = promisedRes[i] as PromiseFulfilledResult<GetSecretResponse | ErrorResponse>;
        // eslint-disable-next-line no-prototype-builtins
        if (pr.value.hasOwnProperty("error")) {
          const p = pr as PromiseFulfilledResult<ErrorResponse>;
          console.error(`${p.value.error}: ${p.value.message}`);
          continue;
        }
        const p = pr as PromiseFulfilledResult<GetSecretResponse>;
        res.push(Buffer.from(p.value.secret, "base64"));
      }
    });

    return res;
  }

  private async postSecret(
    fort: Fort,
    id: string,
    secret: string,
    overwrite: boolean = true,
  ): Promise<PostSecretResponse | ErrorResponse> {
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

    return response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async getSecret(fort: Fort, id: string): Promise<GetSecretResponse | ErrorResponse> {
    const response = await fetch(`${fort.url.href}api/v0/secret`, {
      method: "GET",
      headers: {
        Accept: "application/text",
        Authorization: `Bearer ${fort.token}`,
      },
      signal: AbortSignal.timeout(4000),
    });

    return response.json();
  }
}

export { Citadel };
