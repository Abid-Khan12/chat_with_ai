<h1 align="center">Chat_With_AI</h1>

<p align="center">
AI-powered chat application built with Next.js (App Router), MongoDB, and Google Gemini.
</p>

<p align="center">
<strong>Live:</strong> https://chat-with-ai-blush.vercel.app <br/>
<strong>Deployment:</strong> Vercel
</p>

<hr/>

<h2>Tech Stack</h2>

<ul>
  <li>Next.js (App Router)</li>
  <li>TypeScript</li>
  <li>Tailwind CSS</li>
  <li>NextAuth (Google OAuth)</li>
  <li>MongoDB + Mongoose</li>
  <li>Vercel AI SDK</li>
  <li>Google Gemini API</li>
</ul>

<hr/>

<h2>Package Manager</h2>

<p>
This project is configured using <strong>pnpm</strong>.
It includes a <code>pnpm-lock.yaml</code> file.
</p>

<p>
⚠️ It is strongly recommended to use <strong>pnpm</strong> to avoid dependency resolution issues.
</p>

<h3>Install pnpm (if not installed)</h3>

<pre><code>npm install -g pnpm
</code></pre>

<hr/>

<h2>Getting Started (Recommended - pnpm)</h2>

<h3>1. Clone the repository</h3>

<pre><code>git clone https://github.com/yourusername/chat_with_ai.git
cd chat_with_ai
</code></pre>

<h3>2. Install dependencies</h3>

<pre><code>pnpm install
</code></pre>

<h3>3. Create environment variables</h3>

<p>Create a <code>.env.local</code> file in the root directory:</p>

<pre><code>MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GEMINI_API_KEY=your_gemini_api_key
</code></pre>

<h3>4. Run development server</h3>

<pre><code>pnpm dev
</code></pre>

<p>Open:</p>

<pre><code>http://localhost:3000
</code></pre>

<hr/>

<h2>Using npm Instead of pnpm</h2>

<p>
If you prefer using <strong>npm</strong>, follow these steps carefully:
</p>

<ol>
  <li>Delete <code>pnpm-lock.yaml</code></li>
  <li>Delete <code>node_modules</code> (if generated)</li>
  <li>Run:</li>
</ol>

<pre><code>npm install
npm run dev
</code></pre>

<p>
Note: Since this project was developed using pnpm, dependency resolution may differ slightly when using npm.
</p>

<hr/>

<h2>Required Setup</h2>

<h3>MongoDB</h3>
<ul>
  <li>Create a MongoDB database (Atlas recommended)</li>
  <li>Add your connection string to <code>MONGODB_URI</code></li>
</ul>

<h3>Google OAuth</h3>
<ul>
  <li>Create OAuth credentials in Google Cloud Console</li>
  <li>Add these authorized URLs:</li>
</ul>

<p><strong>Authorized JavaScript origins</strong></p>

<pre><code>http://localhost:3000
</code></pre>

<p><strong>Authorized redirect URI</strong></p>

<pre><code>http://localhost:3000/api/auth/callback/google
</code></pre>

<h3>Gemini API</h3>
<ul>
  <li>Generate an API key from Google AI Studio</li>
  <li>Add it as <code>GEMINI_API_KEY</code></li>
</ul>
