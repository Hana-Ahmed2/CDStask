export type Request = {
  username: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

export type JwtToken = {
  token: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  user: User;
};

export function login(req: Request): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (req.username === "Hana" && req.password === "password") {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        resolve({
          token: "jwt-token",
          refreshToken: "refresh-token",
          expiresIn: currentTime + 120,        // Current time + 2 minutes,  kol 2 minutes hayetgaded
          refreshExpiresIn: currentTime + 86400, // el refresh token hayefdal yehsal up to 24hrs 
          user: {
            id: "1",
            username: req.username,
            email: "admin@cds.com",
            firstName: "Admin",
            lastName: "User",
          }
        });
      } else {
        reject(new Error("Invalid username or password"));
      }
    }, 1000);
  });
}

// function 3ashan n-refresh el token lama ye2rab yexpire
export function updateToken(token: JwtToken): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    // check law el token object sa7 w feeh el data el matloba
    if (!token || !token.token || !token.refreshToken) {
      return reject(new Error("Invalid token object"));
    }

    setTimeout(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      resolve({
        ...token,
        expiresIn: currentTime + 120,        // Current time + 2 minutes
        refreshExpiresIn: currentTime + 86400, // Current time + 24 hours
        user: token.user // Preserve user data
      });
    }, 1000);
  });
}
