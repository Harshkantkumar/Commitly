const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Extracts owner and repo name from a GitHub URL
 * @param {string} url - The full GitHub repository URL
 * @returns {object|null} - { owner, repo } or null if invalid
 */
const parseGitHubUrl = (url) => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname !== 'github.com') return null;

        // Pathname usually starts with / (e.g., /facebook/react)
        const parts = urlObj.pathname.split('/').filter(Boolean);
        if (parts.length < 2) return null;

        return { owner: parts[0], repo: parts[1] };
    } catch (error) {
        return null;
    }
};

/**
 * Creates an Axios instance with authorization headers
 */
const getClient = () => {
    const token = process.env.GITHUB_TOKEN;
    return axios.create({
        baseURL: GITHUB_API_BASE,
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            ...(token && { 'Authorization': `token ${token}` })
        }
    });
};

/**
 * Fetches all necessary data for a repository
 */
const fetchRepoData = async (owner, repo) => {
    const client = getClient();

    try {
        // 1. Repo Metadata (stars, forks, open issues, default branch)
        const metadataPromise = client.get(`/repos/${owner}/${repo}`);

        // 2. Languages (byte count per language)
        const languagesPromise = client.get(`/repos/${owner}/${repo}/languages`);

        // 3. Commit History (last 100 commits for frequency analysis)
        const commitsPromise = client.get(`/repos/${owner}/${repo}/commits?per_page=100`);

        // 4. File Tree (Recursive to analyze structure depth and file counts)
        // Note: This requires the default branch name, which we get from metadata.
        // We'll chaining this after metadata if needed, but for parallel perf we can optimistically try 'main' or 'master' 
        // OR just wait for metadata. Let's wait for metadata to be safe and accurate.

        const [metadataRes, languagesRes, commitsRes] = await Promise.all([
            metadataPromise,
            languagesPromise,
            commitsPromise
        ]);

        const defaultBranch = metadataRes.data.default_branch;

        // Fetch file tree recursively
        const treeRes = await client.get(`/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);

        // Fetch README content (often at root)
        // Using simple content API, or raw. Let's use the README endpoint which auto-finds it.
        let readmeContent = '';
        try {
            const readmeRes = await client.get(`/repos/${owner}/${repo}/readme`);
            // Content is base64 encoded
            readmeContent = Buffer.from(readmeRes.data.content, 'base64').toString('utf-8');
        } catch (e) {
            console.warn('No README found');
        }

        return {
            metadata: metadataRes.data,
            languages: languagesRes.data,
            commits: commitsRes.data,
            fileTree: treeRes.data.tree,
            readme: readmeContent,
        };

    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 404) throw new Error('Repository not found (404)');
            if (status === 403) throw new Error('API Rate Limit exceeded (403)');
        }
        throw error;
    }
};

module.exports = {
    parseGitHubUrl,
    fetchRepoData
};
