export type Request = {
  username: string;
  password: string;
};

export type JwtToken = {
  token: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
};

export function login(req: Request): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (req.username === "admin" && req.password === "password") {
        resolve({
          token: "jwt-token",
          refreshToken: "refresh-token",
          expiresIn: 120,         
          refreshExpiresIn: 86400 // 24 hours
        });
      } else {
        reject(new Error("Invalid username or password"));
      }
    }, 1000);
  });
}

export function updateToken(token: JwtToken): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    if (!token || !token.token || !token.refreshToken) {
      return reject(new Error("Invalid token object"));
    }

    setTimeout(() => {
      resolve({
        ...token,
        expiresIn: token.expiresIn + 120,        
        refreshExpiresIn: token.refreshExpiresIn + 7200 
      });
    }, 1000);
  });
}
