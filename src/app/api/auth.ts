export const authenticateUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const dataToSend = { password: password, identifier: email };
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(dataToSend),
  });
  if (!res.ok) throw new Error("Failed to authenticate");
  return res.json();
};

export const logout = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users-permissions/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to logout");
  return res.json();
};
