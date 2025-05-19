# Shady Stock Satirist

**Shady Stock Satirist is a web app that generates satirical, AI-powered explanations for stock market moves. It mocks financial analysis with a blend of logic and humor, using real stock and news data, and Google Gemini AI to create witty, post-hoc reasons for why stocks rise or fall.**

<!-- IMAGE PLACEHOLDER 1 -->

![Screenshot or Demo 1](./images/demo1.png)

<!-- IMAGE PLACEHOLDER 2 -->

![Screenshot or Demo 2](./images/demo2.png)

## Project info

**URL**: https://lovable.dev/projects/d8db343f-009a-44a4-a36b-55bf312719cc

## Features

- Generates satirical explanations for stock movements using Google Gemini AI
- Mocks post-hoc financial analysis with a blend of logic and humor
- Uses real stock and news data (Alpha Vantage & Finnhub)
- Modern UI with Vite, React, shadcn-ui, and Tailwind CSS

## How Satire Generation Works

This project uses the [Google Gemini API](https://ai.google.dev/) to generate satirical, post-hoc explanations for stock price movements. The prompt is carefully crafted so that:

- If a company profit goes up by 4% but the stock goes down, the satire might say "Analysts expected 8% growth, so 4% is a disappointment."
- The explanation always mocks the tendency to explain market moves after the fact.
- The response is a single sentence, logical but funny, and under 100 characters.

## Setup & Environment Variables

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` if present, or create a `.env` file.
   - Add your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your-gemini-api-key-here
     ```
   - (Optional) Add your Alpha Vantage and Finnhub API keys for stock/news data:
     ```env
     VITE_ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
     VITE_FINNHUB_API_KEY=your-finnhub-key
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d8db343f-009a-44a4-a36b-55bf312719cc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d8db343f-009a-44a4-a36b-55bf312719cc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
