import MarkdownViewer from "@/features/MarkdownViewer";
import styles from "./index.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  useEffect(() => {
    // check access_token from cookie
    // if access_token is valid, setIsLoggedIn(true)
    const accessToken = document.cookie.split("=")[1];
    console.log("accessToken");
    console.log(accessToken);

    if (accessToken) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, []);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  return (
    <div className={styles.indexContainer}>
      <MarkdownViewer markdownString="### Hello *world*!" />
      {isLoggedIn ? (
        <button className={styles.button} onClick={handleLogout}>
          logout
        </button>
      ) : (
        <button className={styles.button} onClick={handleLogin}>
          login
        </button>
      )}
    </div>
  );
}
