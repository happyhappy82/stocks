export default function Header() {
  return (
    <header className="mb-14 flex flex-row place-content-between">
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="inline-block"
        >
          <h1 className="text-3xl font-black text-blue-600">주식리뷰Lab</h1>
        </a>
      </div>
    </header>
  );
}
