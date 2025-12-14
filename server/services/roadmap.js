/**
 * Personalized Roadmap Generator
 * Generates actionable steps based on specific weaknesses detected.
 */
const generateRoadmap = (metrics, scoreResult) => {
    const { readme, tests, commits, languages } = metrics; // counts, structure available if needed
    const roadmap = [];

    // Priority 1: Documentation (The "Face" of the repo)
    if (!readme.exists) {
        roadmap.push("Create a README.md file");
        roadmap.push("Add a 'Project Description' section to explain what this does");
        roadmap.push("Include an 'Installation' and 'Usage' section");
    } else {
        if (readme.length < 500) roadmap.push("Expand README with more details on features and setup");
        if (!readme.hasSetup) roadmap.push("Add clear 'Getting Started' instructions to the README");
    }

    // Priority 2: Reliability
    if (!tests.exists) {
        const isJS = languages['JavaScript'] > 0 || languages['TypeScript'] > 0;
        const isPy = languages['Python'] > 0;

        if (isJS) roadmap.push("Add a testing framework like Jest or Mocha");
        else if (isPy) roadmap.push("Add 'pytest' for automated testing");
        else roadmap.push("Set up a basic unit testing framework");

        roadmap.push("Write a simple smoke test to verify app startup");
    }

    // Priority 3: Best Practices
    if (commits.frequencyPerWeek < 0.5) {
        roadmap.push("Aim for at least one commit per week to show activity");
        roadmap.push("Use descriptive commit messages (e.g., 'fix: login bug' vs 'update')");
    }

    // Priority 4: Structure (Generic if needed)
    if (roadmap.length < 3) {
        if (scoreResult.score < 90) roadmap.push("Review code for potential refactoring opportunities");
        roadmap.push("Add a LICENSE file if open source");
    }

    return roadmap;
};

module.exports = { generateRoadmap };
