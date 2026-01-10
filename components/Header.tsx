import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-14 flex flex-row place-content-between">
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="inline-block"
        >
          <Image
            src="/logo.png"
            alt="주식팁가이드"
            width={180}
            height={40}
            priority
          />
        </a>
      </div>
    </header>
  );
}
