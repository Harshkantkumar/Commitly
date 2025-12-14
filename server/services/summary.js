/**
 * AI-Style Summary Generator
 * Generates a human-like summary text based on metrics and score.
 * Rules: Strengths first, then weaknesses, no harsh language.
 */
const generateSummary = (metrics, scoreResult) => {
    const { score } = scoreResult;
    const { readme, tests, commits, structure } = metrics;

    const strengths = [];
    const weaknesses = [];

    // Identify Strengths
    if (score >= 80) strengths.push("excellent overall structure and quality");
    if (readme.exists && readme.length > 500) strengths.push("comprehensive documentation");
    else if (readme.exists) strengths.push("included documentation");
    if (tests.exists) strengths.push("automated testing");
    if (commits.frequencyPerWeek > 1) strengths.push("consistent development activity");
    if (structure.depth >= 2) strengths.push("a well-organized folder hierarchy");

    // Identify Weaknesses (Constructively)
    if (!readme.exists) weaknesses.push("lacks a README file, which is crucial for onboarding");
    else if (readme.length < 200) weaknesses.push("could benefit from more detailed documentation");
    if (!tests.exists) weaknesses.push("currently has no automated tests");
    if (commits.frequencyPerWeek < 0.5) weaknesses.push("shows sparse commit history");

    let summary = "";

    // Opening
    if (score >= 80) summary += "This project demonstrates " + strengths.join(" and ") + ". ";
    else if (score >= 60) summary += "The project has a solid foundation with " + strengths.join(" and ") + ". ";
    else summary += "The project is off to a start" + (strengths.length ? " with " + strengths.join(", ") : "") + ". ";

    // Critique
    if (weaknesses.length > 0) {
        summary += "To improve, consider addressing the following: " + weaknesses.join(", and ") + ". ";
    } else {
        summary += "Keep up the great work!";
    }

    return summary;
};

module.exports = { generateSummary };
