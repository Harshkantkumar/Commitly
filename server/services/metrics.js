/**
 * Metrics Calculation Service
 * Transforms raw GitHub data into structured metrics for analysis.
 */

const calculateMetrics = (rawData) => {
    const { metadata, languages, commits, fileTree, readme } = rawData;

    // 1. File & Folder Counts
    // fileTree is an array of objects { path, mode, type, size, sha, url }
    // type can be 'blob' (file) or 'tree' (directory)
    const files = fileTree.filter(node => node.type === 'blob');
    const folders = fileTree.filter(node => node.type === 'tree');

    const numFiles = files.length;
    const numFolders = folders.length;

    // 2. Language Usage %
    // rawData.languages is { "JavaScript": 12345, "CSS": 500 } (bytes)
    const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
    const languageUsage = Object.entries(languages).reduce((acc, [lang, bytes]) => {
        acc[lang] = totalBytes > 0 ? parseFloat(((bytes / totalBytes) * 100).toFixed(2)) : 0;
        return acc;
    }, {});

    // 3. Commit Frequency & Consistency
    // We have last 100 commits. Check timestamps.
    const commitDates = commits.map(c => new Date(c.commit.author.date));
    let commitFrequencyScore = 0; // Simple heuristic

    if (commitDates.length > 0) {
        const firstCommit = commitDates[commitDates.length - 1];
        const lastCommit = commitDates[0];
        const daysDiff = (lastCommit - firstCommit) / (1000 * 60 * 60 * 24);

        // Avg commits per week
        const weeks = Math.max(daysDiff / 7, 1);
        const commitsPerWeek = commits.length / weeks;

        // Heuristic: >1 commit/week is 'consistent' for side projects
        commitFrequencyScore = commitsPerWeek;
    }

    // 4. README Quality
    const readmeLength = readme ? readme.length : 0;
    const readmeSections = readme ? (readme.match(/^#+ /gm) || []).length : 0;
    // Look for key sections
    const hasSetup = /install|setup|build/i.test(readme || '');
    const hasUsage = /usage|run|execute/i.test(readme || '');

    // 5. Test Presence
    // Scan file tree for explicit test configurations or folders
    const testFiles = files.filter(f =>
        f.path.includes('.test.') ||
        f.path.includes('.spec.') ||
        f.path.includes('test_') ||
        f.path.includes('/tests/') ||
        f.path.includes('/__tests__/')
    );
    const hasTests = testFiles.length > 0;

    // 6. Project Structure Depth
    // depth is number of slashes in path
    let maxDepth = 0;
    fileTree.forEach(node => {
        const depth = node.path.split('/').length;
        if (depth > maxDepth) maxDepth = depth;
    });

    return {
        repoInfo: {
            name: metadata.name,
            owner: metadata.owner.login,
            description: metadata.description,
            size: metadata.size, // in KB
            stars: metadata.stargazers_count,
            forks: metadata.forks_count,
            openIssues: metadata.open_issues_count,
        },
        counts: {
            files: numFiles,
            folders: numFolders,
        },
        languages: languageUsage,
        commits: {
            totalFetched: commits.length,
            frequencyPerWeek: parseFloat(commitFrequencyScore.toFixed(2))
        },
        readme: {
            exists: !!readme,
            length: readmeLength,
            sections: readmeSections,
            hasSetup,
            hasUsage
        },
        tests: {
            exists: hasTests,
            count: testFiles.length
        },
        structure: {
            depth: maxDepth
        }
    };
};

module.exports = {
    calculateMetrics
};
