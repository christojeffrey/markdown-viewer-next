import { useEffect } from "react";

import MarkdownViewer from "@/features/MarkdownViewer";
import verifyRefreshToken from "@/utils/verifyRefreshToken";
import { parseToken } from "@/utils";

import styles from "./[repo].module.css";
export default function Home({ markdownString, isLoggedIn, isError }: { markdownString: string; isLoggedIn: boolean; isError: boolean }) {
  useEffect(() => {
    // setting prefers-color-scheme to dark
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);
  return (
    <>
      {isError ? (
        <div className={styles.errorContainer}>
          <div className={styles.notLoggedInContainer}>
            <MarkdownViewer markdownString={markdownString} />
            <div className={styles.buttonContainer}>
              {isLoggedIn ? (
                <button className={styles.notErrorButton} onClick={() => (window.location.href = "/logout")}>
                  logout
                </button>
              ) : (
                <button className={styles.notErrorButton} onClick={() => (window.location.href = "/login")}>
                  login
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.buttonContainer}>
            {isLoggedIn ? (
              <button className={styles.errorButton} onClick={() => (window.location.href = "/logout")}>
                logout
              </button>
            ) : (
              <button className={styles.errorButton} onClick={() => (window.location.href = "/login")}>
                login
              </button>
            )}
          </div>
          <MarkdownViewer markdownString={markdownString} />
        </div>
      )}
    </>
  );
}

// This gets called on every request
export async function getServerSideProps(context: any) {
  // setup variable
  const { username, repo } = context.query;
  const cookie = context.req.headers.cookie;
  console.log("cookie", cookie);
  // read access_token from cookie

  let access_token;
  try {
    access_token = cookie?.split("access_token=")[1].split(";")[0];
  } catch {
    access_token = null;
  }
  let refresh_token;
  try {
    refresh_token = cookie?.split("refresh_token=")[1].split(";")[0];
  } catch {
    refresh_token = null;
  }
  let isAccessTokenValid = access_token ? true : false;
  let isRefreshTokenValid = refresh_token ? true : false;

  const url = `https://api.github.com/repos/${username}/${repo}/readme`;

  // code

  if (!isAccessTokenValid && isRefreshTokenValid) {
    // refresh access_token
    const { isSuccess, responseData } = await verifyRefreshToken(refresh_token);

    if (!isSuccess) return { props: { markdownString: "### Bad credentials", isLoggedIn: true, isError: true } };
    if (responseData.includes("error")) return { props: { markdownString: "### Bad credentials", isLoggedIn: true, isError: true } };

    const { access_token: new_access_token, expires_in, refresh_token: new_refresh_token, refresh_token_expires_in, scope, token_type } = parseToken(responseData);

    context.res.setHeader("Set-Cookie", [
      `access_token=${new_access_token}; expires=${expires_in}; path=/`,
      `refresh_token=${new_refresh_token}; expires=${refresh_token_expires_in}; path=/`,
      `scope=${scope}; expires=${expires_in}; path=/`,
      `token_type=${token_type}; expires=${expires_in}; path=/`,
    ]);

    // update token
    access_token = new_access_token;
    refresh_token = new_refresh_token;
    isAccessTokenValid = true;
    isRefreshTokenValid = true;
  }

  // get markdown
  if (!isAccessTokenValid) {
    // for public repository
    const urlData = await fetch(url, {
      method: "GET",
    });
    const json = await urlData.json();

    if (json.message === "Not Found") {
      return { props: { markdownString: "### Not Found, or probably you need to log in", isLoggedIn: false, isError: true } };
    }
    // get markdown with catch
    const markdownData = await fetch(json.download_url);
    const markdownString = await markdownData.text();
    return { props: { markdownString, isLoggedIn: false, isError: false } };
  } else {
    // for private repository
    // Fetch data from external API
    // get URL
    const urlData = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const json = await urlData.json();
    console.log("json", json);
    if (json.message === "Not Found") {
      return { props: { markdownString: "### Not Found. typo?", isLoggedIn: true, isError: true } };
    }

    if (json.message === "Bad credentials") {
      return { props: { markdownString: "### Bad credentials", isLoggedIn: true, isError: true } };
    }

    // get markdown with catch
    const markdownData = await fetch(json.download_url);
    const markdownString = await markdownData.text();
    return { props: { markdownString, isLoggedIn: true, isError: false } };
  }
}
