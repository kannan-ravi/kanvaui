"use client";

import React from "react";
import { motion, type Transition, type Variants } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// Types & Interfaces
// ============================================

export interface SocialShareItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  disabled?: boolean;
  className?: string;
}

export interface AnimationConfig {
  duration?: number;
  staggerDelay?: number;
  stiffness?: number;
  damping?: number;
  hoverScale?: number;
}

export interface SocialShareButtonProps {
  items: SocialShareItem[];

  label?: React.ReactNode;
  labelIcon?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  iconsContainerClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;

  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";

  animation?: AnimationConfig;
  disableAnimation?: boolean;

  disabled?: boolean;
  trigger?: "hover" | "click" | "focus";

  "aria-label"?: string;

  gridColumns?: number;
}

// ============================================
// Default Values
// ============================================

const DEFAULT_ANIMATION: Required<AnimationConfig> = {
  duration: 0.25,
  staggerDelay: 0.08,
  stiffness: 120,
  damping: 15,
  hoverScale: 1.2,
};

const SIZE_CONFIG = {
  sm: {
    height: "h-8",
    minWidth: "min-w-32",
    padding: "px-3",
    fontSize: "text-sm",
    gap: "gap-1.5",
  },
  md: {
    height: "h-10",
    minWidth: "min-w-40",
    padding: "px-4",
    fontSize: "text-base",
    gap: "gap-2",
  },
  lg: {
    height: "h-12",
    minWidth: "min-w-48",
    padding: "px-5",
    fontSize: "text-lg",
    gap: "gap-2.5",
  },
} as const;

const VARIANT_CONFIG = {
  default: {
    container: "bg-primary text-primary-foreground hover:bg-primary/90",
    icon: "text-primary-foreground",
  },
  outline: {
    container:
      "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
    icon: "text-primary",
  },
  ghost: {
    container:
      "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
    icon: "text-foreground",
  },
  secondary: {
    container: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    icon: "text-secondary-foreground",
  },
} as const;

// ============================================
// Sub-components
// ============================================

interface SocialIconProps {
  item: SocialShareItem;
  animation: Required<AnimationConfig>;
  index: number;
  disabled?: boolean;
  wrapperClassName?: string;
  iconClassName?: string;
}

function SocialIcon({
  item,
  animation,
  index,
  disabled,
  wrapperClassName,
  iconClassName,
}: SocialIconProps) {
  const isDisabled = disabled || item.disabled;

  const iconVariants: Variants = {
    initial: { opacity: 0, scale: 0.5, y: 10 },
    whileHover: { opacity: 1, scale: 1, y: 0 },
  };

  const iconTransition: Transition = {
    duration: animation.duration + 0.05,
    delay: index * animation.staggerDelay,
    type: "spring",
    stiffness: animation.stiffness,
  };

  const hoverTransition: Transition = {
    type: "spring",
    stiffness: 300,
    damping: animation.damping,
    duration: 0.2,
  };

  const iconContent = (
    <motion.div
      className={cn("flex items-center justify-center", iconClassName)}
      whileHover={!isDisabled ? { scale: animation.hoverScale } : undefined}
      transition={hoverTransition}
    >
      {item.icon}
    </motion.div>
  );

  const baseWrapperClassName = cn(
    "cursor-pointer transition-opacity inline-flex items-center justify-center",
    isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
    wrapperClassName,
    item.className
  );

  if (item.href && !isDisabled) {
    return (
      <motion.span
        className={baseWrapperClassName}
        variants={iconVariants}
        transition={iconTransition}
      >
        <Link
          href={item.href}
          target={item.target}
          rel={
            item.rel ??
            (item.target === "_blank" ? "noopener noreferrer" : undefined)
          }
          aria-label={item.label}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          {iconContent}
        </Link>
      </motion.span>
    );
  }

  if (item.onClick && !isDisabled) {
    return (
      <motion.span
        className={baseWrapperClassName}
        variants={iconVariants}
        transition={iconTransition}
      >
        <button
          type="button"
          onClick={item.onClick}
          aria-label={item.label}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          {iconContent}
        </button>
      </motion.span>
    );
  }

  return (
    <motion.span
      className={baseWrapperClassName}
      variants={iconVariants}
      transition={iconTransition}
      role="img"
      aria-label={item.label}
    >
      {iconContent}
    </motion.span>
  );
}

// ============================================
// Main Component
// ============================================

export function SocialShareButton({
  items,
  label = "Share",
  labelIcon,
  className,
  labelClassName,
  iconsContainerClassName,
  iconWrapperClassName,
  iconClassName,
  variant = "default",
  size = "md",
  animation: customAnimation,
  disableAnimation = false,
  disabled = false,
  trigger = "hover",
  "aria-label": ariaLabel,
  gridColumns,
}: SocialShareButtonProps) {
  const [isActive, setIsActive] = React.useState(false);

  const animation: Required<AnimationConfig> = {
    ...DEFAULT_ANIMATION,
    ...customAnimation,
  };

  const sizeConfig = SIZE_CONFIG[size];
  const variantConfig = VARIANT_CONFIG[variant];

  const triggerProps = React.useMemo(() => {
    if (disableAnimation) return {};

    switch (trigger) {
      case "click":
        return {
          onClick: () => !disabled && setIsActive((prev) => !prev),
          animate: isActive ? "whileHover" : "initial",
        };
      case "focus":
        return {
          onFocus: () => !disabled && setIsActive(true),
          onBlur: () => setIsActive(false),
          animate: isActive ? "whileHover" : "initial",
        };
      case "hover":
      default:
        return {
          whileHover: !disabled ? "whileHover" : undefined,
        };
    }
  }, [trigger, isActive, disabled, disableAnimation]);

  const labelVariants: Variants = disableAnimation
    ? {}
    : {
        initial: { y: 0, opacity: 1 },
        whileHover: { y: -20, opacity: 0 },
      };

  const iconsVariants: Variants = disableAnimation
    ? {}
    : {
        initial: { y: 20, opacity: 0 },
        whileHover: { y: 0, opacity: 1 },
      };

  const transitionConfig: Transition = {
    duration: animation.duration,
  };

  const columns = gridColumns ?? items.length;

  return (
    <motion.button
      type="button"
      className={cn(
        "overflow-hidden rounded-md relative flex items-center justify-center",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "transition-colors",
        sizeConfig.height,
        sizeConfig.minWidth,
        variantConfig.container,
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
      initial="initial"
      disabled={disabled}
      aria-label={ariaLabel ?? (typeof label === "string" ? label : "Share")}
      aria-expanded={trigger !== "hover" ? isActive : undefined}
      {...triggerProps}
    >
      <motion.span
        className={cn(
          "font-medium flex items-center justify-center absolute",
          sizeConfig.fontSize,
          sizeConfig.gap,
          labelClassName
        )}
        variants={labelVariants}
        transition={transitionConfig}
      >
        {labelIcon}
        {label}
      </motion.span>

      <motion.div
        className={cn(
          "grid w-full h-full absolute place-items-center",
          sizeConfig.padding,
          iconsContainerClassName
        )}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
        variants={iconsVariants}
        transition={transitionConfig}
      >
        {items.map((item, index) => (
          <SocialIcon
            key={item.id}
            item={item}
            animation={animation}
            index={index}
            disabled={disabled}
            wrapperClassName={iconWrapperClassName}
            iconClassName={cn(variantConfig.icon, iconClassName)}
          />
        ))}
      </motion.div>
    </motion.button>
  );
}

SocialShareButton.displayName = "SocialShareButton";

export default SocialShareButton;
