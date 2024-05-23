import { URL } from "url";
import { AegisPayload } from "../aegis/aegis";

interface Fort {
  token: string;
  url: URL;
}

interface PutSecretResponse {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async store(payloads: AegisPayload[], _key: Uint8Array) {
    if (payloads.length !== this.forts.length) {
      throw new Error("Payloads and Fort do not match");
    }

    // const strKey = Buffer.from(key).toString("base64");

    const responses: Promise<PutSecretResponse | ErrorResponse>[] = [];
    for (let i = 0; i < payloads.length; i++) {
      // encode to base64
      const data = Buffer.from(payloads[i]).toString("base64");

      const res = this.putSecret(this.forts[i], data, true);
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
  public async retrieve(_key: Uint8Array): Promise<AegisPayload[]> {
    // const strKey = Buffer.from(key).toString("base64");

    const responses: Promise<GetSecretResponse | ErrorResponse>[] = [];
    this.forts.map(async fort => {
      const res = this.getSecret(fort);
      responses.push(res);
    });

    const res: AegisPayload[] = [];
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

  private async putSecret(
    fort: Fort,
    secret: string,
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
        Accept: "application/text",
        Authorization: `Bearer ${fort.token}`,
      },
      signal: AbortSignal.timeout(4000),
    });

    return response.json();
  }
}

export { Citadel };
