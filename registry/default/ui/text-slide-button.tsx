"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TextSlideButtonProps = {
  text?: string;
  hoverText?: string;
  href?: string;
  className?: string;
  variant?: "default" | "outlined";
};

export default function TextSlideButton({
  text = "HOVER OVER ME",
  hoverText,
  href = "/",
  variant = "default",
  className,
}: TextSlideButtonProps) {
  const hoveredText = hoverText ?? text;

  const variantSytle =
    variant === "default"
      ? "bg-black dark:bg-white dark:text-black text-white"
      : "border-black dark:border-white text-dark dark:text-white";

  return (
    <div className="relative overflow-hidden">
      <Link
        href={href}
        className={cn(
          "border  min-w-48 flex items-center justify-center h-10 group",
          variantSytle,
          className
        )}
      >
        <span className="text-md tracking-tighter group-hover:-translate-y-10 transition-transform duration-300 absolute">
          <span className="font-medium group-hover:opacity-0 transition-opacity duration-300">
            {text}
          </span>
        </span>
        <span className="text-md tracking-tighter translate-y-10 group-hover:translate-y-0 transition-transform duration-300 absolute">
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {hoveredText}
          </span>
        </span>
      </Link>
    </div>
  );
}
