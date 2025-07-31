export type Request = {
  username: string;
  password: string;
};

export type JwtToken = {
  token: string;
};

export function login(req: Request): Promise<JwtToken> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (req.username === "admin" && req.password === "password") {
        resolve({ token: "jwt-token" });
      } else {
        reject(new Error("Invalid username or password"));
      }
    }, 1000);
  });
}
