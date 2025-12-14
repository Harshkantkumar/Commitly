const express = require('express');
const router = express.Router();
const githubService = require('../services/github');

// POST /api/analyze
router.post('/', async (req, res) => {
    try {
        const { repoUrl } = req.body;

        if (!repoUrl) {
            return res.status(400).json({ error: 'repoUrl is required' });
        }

        // 1. Validate and Parse URL
        const repoDetails = githubService.parseGitHubUrl(repoUrl);
        if (!repoDetails) {
            return res.status(400).json({ error: 'Invalid GitHub URL. Format: https://github.com/owner/repo' });
        }

        const { owner, repo } = repoDetails;

        const metricsService = require('../services/metrics');

        // 2. Fetch Data using GitHub API
        const rawData = await githubService.fetchRepoData(owner, repo);

        // 3. Calculate Metrics
        const metrics = metricsService.calculateMetrics(rawData);

        // 4. Calculate Score (Step 5)
        const scorerService = require('../services/scorer');
        const scoreResult = scorerService.calculateScore(metrics);

        // 5. Generate Summary & Roadmap (Steps 6 & 7)
        const summaryService = require('../services/summary');
        const roadmapService = require('../services/roadmap');

        const summary = summaryService.generateSummary(metrics, scoreResult);
        const roadmap = roadmapService.generateRoadmap(metrics, scoreResult);

        // Final Response (Step 8)
        res.json({
            message: 'Repository analyzed successfully',
            score: scoreResult.score,
            level: scoreResult.level,
            breakdown: scoreResult.breakdown,
            summary,
            roadmap,
            metrics
        });
    } catch (error) {
        console.error('Analysis Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
