export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 px-6 py-10 md:px-[120px]">
      <p className="mono text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} Trần Thanh Hải — All rights reserved.
      </p>
    </footer>
  );
}
