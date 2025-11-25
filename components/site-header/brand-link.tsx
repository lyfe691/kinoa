import Link from "next/link";

export function BrandLink() {
  return (
    <Link
      href="/"
      className="text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
    >
      kinoa
    </Link>
  );
}
