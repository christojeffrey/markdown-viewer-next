import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    // setting prefers-color-scheme to dark
    document.documentElement.setAttribute("data-theme", "dark");
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_PATH}/verify`;
  }, []);
  return (
    <div>
      <h1>Login</h1>
      <p>Redirecting...</p>
    </div>
  );
}
