import { useEffect } from "react";
import { verifyLoginCode, parseToken } from "@/utils";

export default function Verify({ status }: any) {
  useEffect(() => {
    // redirect
    window.location.href = "/";
  }, []);
  return (
    <div>
      {status === "success" ? (
        <div>
          <h1>Success</h1>
          <p>Redirecting...</p>
        </div>
      ) : (
        <div>
          <h1>Error</h1>
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  // get code from url query
  const { code } = context.query;

  const { isSuccess, responseData } = await verifyLoginCode(code);

  if (!isSuccess) return { props: { status: "error" } };
  if (responseData.includes("error")) return { props: { status: "error" } };

  const { access_token, expires_in, refresh_token, refresh_token_expires_in, scope, token_type } = parseToken(responseData);

  context.res.setHeader("Set-Cookie", [
    `access_token=${access_token}; expires=${expires_in}; path=/`,
    `refresh_token=${refresh_token}; expires=${refresh_token_expires_in}; path=/`,
    `scope=${scope}; expires=${expires_in}; path=/`,
    `token_type=${token_type}; expires=${expires_in}; path=/`,
  ]);

  return {
    props: {
      status: "success",
    },
  };
}
