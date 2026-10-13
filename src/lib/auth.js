import api, { clearAccessToken, responseData, setAccessToken } from "./api";

function saveToken(data) {
  if (!data?.token) throw new Error("Authentication succeeded without a token");
  setAccessToken(data.token);
  return data;
}

export async function signIn(credentials) {
  const response = await api.post("/auth/signin", credentials);
  return saveToken(responseData(response));
}

export async function signUp(credentials) {
  const response = await api.post("/auth/signup", credentials);
  return saveToken(responseData(response));
}

export async function signOut() {
  try {
    await api.post("/auth/signout", null, { skipRefresh: true });
  } finally {
    clearAccessToken();
  }
}
