// app/blog/[id]/page.js
export default function BlogDetail({ params }) {
  return <h1>블로그 글 ID: {params.id}</h1>;
}
