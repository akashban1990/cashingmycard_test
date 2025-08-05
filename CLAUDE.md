# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "CashingMyCard" - a personal credit card reward guide. The project uses:
- Next.js 15.4.5 with App Router
- React 19.1.0 
- TypeScript 5
- Tailwind CSS 4
- ESLint with Next.js configuration

## Architecture

The application follows Next.js App Router structure:
- `src/app/` - Main application directory with App Router
- `src/app/layout.tsx` - Root layout with Geist font configuration
- `src/app/page.tsx` - Home page component
- `src/app/globals.css` - Global styles
- `public/` - Static assets

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack (recommended)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Development Server
The development server runs on http://localhost:3000 and uses Turbopack for faster builds.

## Key Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration  
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind
- `package.json` - Project dependencies and scripts

## Code Style

The project uses:
- TypeScript with strict configuration
- ESLint with Next.js recommended rules
- Tailwind CSS for styling
- Geist font family (Sans and Mono variants)