import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "inverted";
  className?: string;
};

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-deep-green text-linen hover:opacity-90",
  secondary: "bg-deep-green text-linen hover:opacity-90",
  inverted: "bg-linen text-deep-green hover:bg-off-white",
};

export default function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-block rounded px-8 py-4 text-lg font-medium transition ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
