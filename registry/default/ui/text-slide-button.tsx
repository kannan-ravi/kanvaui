"use client";

import * as React from "react";
import { motion, type Transition, type Variants, type Easing } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// Types & Interfaces
// ============================================

export interface AnimationConfig {
  duration?: number;
  ease?: Easing | Easing[];
  stiffness?: number;
  damping?: number;
  type?: "spring" | "tween";
}

export interface TextSlideButtonProps {
  text?: React.ReactNode;
  hoverText?: React.ReactNode;
  icon?: React.ReactNode;
  hoverIcon?: React.ReactNode;

  href?: string;
  onClick?: () => void;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;

  className?: string;
  textClassName?: string;
  hoverTextClassName?: string;
  iconClassName?: string;

  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";

  animation?: AnimationConfig;
  disableAnimation?: boolean;

  disabled?: boolean;

  "aria-label"?: string;
}

// ============================================
// Default Values
// ============================================

const DEFAULT_ANIMATION: Required<AnimationConfig> = {
  duration: 0.3,
  ease: [0.4, 0.0, 0.2, 1],
  stiffness: 300,
  damping: 30,
  type: "tween",
};

const SIZE_CONFIG = {
  sm: {
    height: "h-8",
    minWidth: "min-w-36",
    padding: "px-3",
    fontSize: "text-sm",
    gap: "gap-1.5",
  },
  md: {
    height: "h-10",
    minWidth: "min-w-48",
    padding: "px-4",
    fontSize: "text-base",
    gap: "gap-2",
  },
  lg: {
    height: "h-12",
    minWidth: "min-w-56",
    padding: "px-6",
    fontSize: "text-lg",
    gap: "gap-2.5",
  },
} as const;

const VARIANT_CONFIG = {
  default: {
    base: "bg-primary text-primary-foreground border-primary",
  },
  outline: {
    base: "bg-transparent border-primary text-primary",
  },
  ghost: {
    base: "bg-transparent border-transparent text-foreground",
  },
  secondary: {
    base: "bg-secondary text-secondary-foreground border-secondary",
  },
} as const;

// ============================================
// Sub-components
// ============================================

interface TextContentProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  gap: string;
}

function TextContent({
  children,
  icon,
  className,
  iconClassName,
  gap,
}: TextContentProps) {
  return (
    <span className={cn("font-medium flex items-center justify-center", gap, className)}>
      {icon && (
        <span className={cn("flex-shrink-0", iconClassName)} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

// ============================================
// Main Component
// ============================================

export function TextSlideButton({
  text = "Hover me",
  hoverText,
  icon,
  hoverIcon,
  href,
  onClick,
  target,
  rel,
  className,
  textClassName,
  hoverTextClassName,
  iconClassName,
  variant = "default",
  size = "md",
  animation: customAnimation,
  disableAnimation = false,
  disabled = false,
  "aria-label": ariaLabel,
}: TextSlideButtonProps) {
  const animation: Required<AnimationConfig> = {
    ...DEFAULT_ANIMATION,
    ...customAnimation,
  };

  const sizeConfig = SIZE_CONFIG[size];
  const variantConfig = VARIANT_CONFIG[variant];

  const resolvedHoverText = hoverText ?? text;
  const resolvedHoverIcon = hoverIcon ?? icon;

  const transitionConfig: Transition =
    animation.type === "spring"
      ? {
        type: "spring",
        stiffness: animation.stiffness,
        damping: animation.damping,
      }
      : {
        type: "tween",
        duration: animation.duration,
        ease: animation.ease,
      };

  const baseClasses = cn(
    "relative overflow-hidden border rounded-md",
    "flex items-center justify-center",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    sizeConfig.height,
    sizeConfig.minWidth,
    sizeConfig.padding,
    sizeConfig.fontSize,
    variantConfig.base,
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    !disabled && "cursor-pointer",
    className
  );

  const defaultTextVariants: Variants = {
    initial: { y: 0, opacity: 1 },
    hover: { y: "-100%", opacity: 0 },
  };

  const hoverTextVariants: Variants = {
    initial: { y: "100%", opacity: 0 },
    hover: { y: 0, opacity: 1 },
  };

  const accessibilityLabel =
    ariaLabel ?? (typeof text === "string" ? text : undefined);

  const content = (
    <>
      <motion.span
        className="absolute"
        variants={disableAnimation ? {} : defaultTextVariants}
        transition={transitionConfig}
      >
        <TextContent
          icon={icon}
          className={textClassName}
          iconClassName={iconClassName}
          gap={sizeConfig.gap}
        >
          {text}
        </TextContent>
      </motion.span>

      <motion.span
        className="absolute"
        variants={disableAnimation ? {} : hoverTextVariants}
        transition={transitionConfig}
      >
        <TextContent
          icon={resolvedHoverIcon}
          className={cn(textClassName, hoverTextClassName)}
          iconClassName={iconClassName}
          gap={sizeConfig.gap}
        >
          {resolvedHoverText}
        </TextContent>
      </motion.span>
    </>
  );

  if (href && !disabled) {
    return (
      <motion.div
        initial="initial"
        whileHover={!disableAnimation ? "hover" : undefined}
        className="inline-block"
      >
        <Link
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          className={baseClasses}
          aria-label={accessibilityLabel}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={accessibilityLabel}
      initial="initial"
      whileHover={!disableAnimation && !disabled ? "hover" : undefined}
    >
      {content}
    </motion.button>
  );
}

TextSlideButton.displayName = "TextSlideButton";

export default TextSlideButton;