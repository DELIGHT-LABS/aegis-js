import { Checksum } from "../crypt/cipher/hash";
import { URL } from "url";

interface Fort {
  token: string;
  url: URL;
}

interface PutSecretResponse {
  id: string;
}

interface GetSecretResponse {
  secret: string;
  checksum: string;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async store(payloads: string[], _key: Uint8Array) {
    if (payloads.length !== this.forts.length) {
      throw new Error("Payloads and Fort do not match");
    }

    // const strKey = Buffer.from(key).toString("base64");

    const responses: Promise<PutSecretResponse | ErrorResponse>[] = [];
    for (let i = 0; i < payloads.length; i++) {
      const checksum = Checksum(payloads[i]);
      const res = this.putSecret(this.forts[i], payloads[i], checksum, true);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async retrieve(_key: Uint8Array): Promise<string[]> {
    // const strKey = Buffer.from(key).toString("base64");

    const responses: Promise<GetSecretResponse | ErrorResponse>[] = [];
    this.forts.map(async fort => {
      const res = this.getSecret(fort);
      responses.push(res);
    });

    const res: string[] = [];
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

        // checksum
        const checksum = Checksum(p.value.secret);
        if (p.value.checksum !== checksum) {
          if (p.value.checksum) {
            throw new Error("Checksum does not match");
          }
        }

        res.push(p.value.secret);
      }
    });

    return res;
  }

  private async putSecret(
    fort: Fort,
    secret: string,
    checksum: string,
    overwrite: boolean = true,
  ): Promise<PutSecretResponse | ErrorResponse> {
    const response = await fetch(`${fort.url.href}api/v0/secret`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${fort.token}`,
      },
      body: JSON.stringify({
        overwrite,
        secret,
        checksum,
      }),
    });

    if (!response.ok || !(response.status === 200 || response.status === 201)) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async getSecret(fort: Fort): Promise<GetSecretResponse | ErrorResponse> {
    const response = await fetch(`${fort.url.href}api/v0/secret`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${fort.token}`,
      },
      signal: AbortSignal.timeout(4000),
    });

    return response.json();
  }
}

export { Citadel };
