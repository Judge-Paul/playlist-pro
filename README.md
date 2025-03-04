<h1 align="center" id="title">YTPlaylistPro</h1>

<p align="center"><img src="https://socialify.git.ci/Judge-Paul/playlist-pro/image?description=1&descriptionEditable=Easily%20download%20any%20YouTube%20%0APlaylist%20no%20ads%20or%20signup%20needed.&font=Source%20Code%20Pro&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&stargazers=1&theme=Dark" alt="project-image"></p>

<p align="center"><img src="https://img.shields.io/github/v/release/Judge-Paul/playlist-pro" alt="shields"><img src="https://img.shields.io/github/contributors/Judge-Paul/playlist-pro" alt="shields"></p>

<h2>⚙️ Installation</h2>

### Client Setup

1. **Navigate to the `client` folder and install dependencies:**

```bash
cd client
npm install
```

2. **Set environment variables:**
   Create a `.env.local` file in the root of the `client` folder and add:

```dotenv
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
```

**PS:** If the issue you were asked to work on requires you testing the /api/playlistItems endpoint, you'll need to get an API key from [cloud console](https://console.cloud.google.com) or you can reach out to me on [X (Twitter)](https://x.com/jadge_dev) for a temporary one.

3. **Start the development server:**

```bash
npm run dev
```

### Server Setup

1. **Navigate to the `bun-server` folder and install dependencies:**

```bash
cd server
npm install
```

2. **Set environment variables:**
   Create a `.env` file in the root of the `bun-server` folder and add the following:

```dotenv
GOOGLE_API_KEY=*******
REDIS_URL=*******
REDIS_TOKEN=*******
NEXT_PUBLIC_MIXPANEL_TEST_TOKEN=**********
NEXT_PUBLIC_MIXPANEL_LIVE_TOKEN=**********
```

3. **Start the development server:**

```bash
bun dev
```

<h2>💻 Built with</h2>

<img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" /> <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /> <img src="https://img.shields.io/badge/shadcn/ui-000000.svg?style=for-the-badge&logo=shadcn/ui&logoColor=white" /> <img src="https://img.shields.io/badge/Radix%20UI-161618.svg?style=for-the-badge&logo=Radix-UI&logoColor=white" /> <img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=for-the-badge&logo=Zod&logoColor=white" /> <img src="https://img.shields.io/badge/SWR-000000.svg?style=for-the-badge&logo=SWR&logoColor=white" /> <img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=for-the-badge&logo=Axios&logoColor=white" /> <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" /> <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" /> <img src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white" /> <img src="https://img.shields.io/badge/Vercel-000000.svg?style=for-the-badge&logo=Vercel&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" /> <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-web-services&logoColor=white" />

<h2>🤝 Contributing</h2>

Contributions are welcome! To contribute to this project, follow these steps:

1. **Create an Issue**: Before starting work on a new feature, enhancement, or bug fix, it's recommended to create a new issue or make a request on an existing issue. This allows for discussions and feedback on the proposed changes. Issues help ensure that your contribution aligns with the project's goals and avoids duplication of effort.

2. **Fork this repository**.

3. **Create a new branch**: `git checkout -b feature/my-feature`.

4. **Make your changes and commit them**: `git commit -am 'Add some feature'`.

5. **Push the changes to your fork**: `git push origin feature/my-feature`.

6. **Create a pull request**, explaining your changes.

Please ensure that your pull request follows the project's coding guidelines and standards.

### Creating an Issue

When creating an issue, provide the following details:

- A clear and descriptive title.
- A detailed description of the problem or enhancement you are addressing.
- Steps to reproduce (for bugs).
- Any relevant code snippets or screenshots.

By following these steps and creating an issue, you help maintain a structured development process and ensure that your contributions are aligned with the project's objectives.

Thank you for your contributions!

<h2> 👬 Contributors </h2>

<img src="https://contrib.rocks/image?repo=Judge-Paul/playlist-pro" />

<h2> License </h2>

[Apache](./.github/LICENSE)
