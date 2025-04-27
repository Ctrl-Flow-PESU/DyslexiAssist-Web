This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## DyslexiAssist Components

### UI Components

The project includes several reusable UI components for accessibility:

- **Input (`/components/ui/input.jsx`)**: A customized input component with proper accessibility attributes and styling.
- **Reading (`/components/Reading.tsx`)**: A reading test component that measures reading speed and comprehension.
- **FormExample (`/components/FormExample.tsx`)**: A form component example with validation and proper error handling.

### Pages

- **Input Test (`/app/input-test/page.tsx`)**: Demonstrates various input field types and the form component.
- **Timed Reading (`/app/timed-reading/page.tsx`)**: A reading test that measures reading speed.
- **Dictation Test (`/app/dictation-test/page.tsx`)**: Tests users' ability to type what they hear.
- **Proofreading (`/app/proofreading/page.tsx`)**: Provides feedback on text accuracy.
- **Contrast Test (`/app/contrast-test/page.tsx`)**: Helps users find comfortable text/background combinations.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
