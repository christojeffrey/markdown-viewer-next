import { useEffect } from "react";

export default function Logout(props: any) {
  useEffect(() => {
    window.location.href = "/";
  }, []);
  return (
    <div>
      <h1>Logout</h1>
      <p>Redirecting...</p>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  // clear cookies
  context.res.setHeader("Set-Cookie", [`access_token=; expires=0; path=/; max-age=0`, `refresh_token=; expires=0; path=/; max-age=0`, `scope=; expires=0; path=/; max-age=0`, `token_type=; expires=0; path=/; max-age=0`]);

  return {
    props: {},
  };
}
