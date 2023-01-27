import MarkdownViewer from "@/features/MarkdownViewer";

export default function Home() {
  const handleLogin = () => {
    window.location.href = "/login";
  };
  return (
    <>
      <button onClick={handleLogin}>login</button>
      <MarkdownViewer markdownString="# Hello *world*!" />
    </>
  );
}
