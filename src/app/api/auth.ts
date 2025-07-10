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
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};
