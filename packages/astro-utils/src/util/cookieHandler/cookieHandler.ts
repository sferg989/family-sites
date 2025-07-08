export type AccessToken = {
  userId: string;
  jti: string;
  iss: string;
  iat: number;
  exp: number;
};

export enum CookieKeys {
  AccessToken = 'access',
  EncodedUserLocation = 'geo',
  LeadFields = 'lead_fields',
  SessionToken = 'session',
  AjsUserId = 'ajs_user_id'
}

export interface ICookieHandler {
  setAccessToken(token: string): void;
  /**
   * Will return value stored for specified cookie
   * @cookie if no value is passed this param will default to 'access'
   */
  getCookie(cookie?: CookieKeys | string): string;
  getArrayCookie(cookieKey: CookieKeys | string): string[],
  setArrayCookie(cookieKey: CookieKeys | string, value: string): void;
  deleteAccessToken(): void;
  deleteSessionToken(): void;
  decodeToken(token: string): object | null;
}

export class CookieHandler implements ICookieHandler {
  private static instance: ICookieHandler | null = null;

  private getDomain(): string {
    if (typeof location === 'undefined') {
      return '';
    }
    return `my${location.host.split('my')[1]}`;
  }

  private setCookie(name: string, value: string, options: {
    expires: Date
    domain: string
  }) {
    if (typeof document === 'undefined') {
      return;
    }

    let cookie = `${name}=${value}`;
    cookie += `; domain=${options.domain}`;
    cookie += `; expires=${options.expires.toUTCString()}`;

    document.cookie = cookie;
  }

  public static Instance(): ICookieHandler {
    return this.instance || (this.instance = new CookieHandler());
  }

  public static Destroy() {
    this.instance = null;
  }

  public setAccessToken = (token: string): void => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    const domain = this.getDomain();

    this.setCookie(CookieKeys.AccessToken, token, {
      domain,
      expires
    });
  };

  public getCookie = (cookie: CookieKeys | string = CookieKeys.AccessToken): string => {
    if (typeof document === 'undefined') {
      return '';
    }

    const value = document.cookie.split('; ')
      .find(c => c.startsWith(cookie))
      ?.split('=')[1];

    return value || '';
  };

  public setArrayCookie(cookieKey: CookieKeys | string, value: string): void {
    const existingSurveys = this.getArrayCookie(cookieKey);
    const cookieValue = btoa([...existingSurveys, value].join());
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    this.setCookie(cookieKey, cookieValue, {
      expires,
      domain: this.getDomain()
    });
  }

  public getArrayCookie(cookieKey: CookieKeys | string): string[] {
    const cookieValue = this.getCookie(cookieKey);

    if (!cookieValue) {
      return [];
    }

    const values = atob(cookieValue).split(',');
    return values;
  }

  public deleteAccessToken = (): void => {
    const accessToken = this.getCookie(CookieKeys.AccessToken);

    this.setCookie(CookieKeys.AccessToken, accessToken, {
      domain: this.getDomain(),
      expires: new Date()
    });
  };

  public deleteSessionToken = (): void => {
    const sessionToken = this.getCookie(CookieKeys.SessionToken);

    this.setCookie(CookieKeys.SessionToken, sessionToken, {
      domain: this.getDomain(),
      expires: new Date()
    });
  };

  public decodeToken = (token: string): object | null => {
    try {
      const encodedValue = token.split('.')[1];
      return JSON.parse(window.atob(encodedValue));
    } catch {
      return null;
    }
  };
}
