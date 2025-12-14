/**
 * Scoring Engine
 * assigns a 0-100 score based on code quality, structure, documentation, and best practices.
 */

const calculateScore = (metrics) => {
    let score = 50; // Start with a neutral baseline
    let breakdown = [];

    // 1. Documentation (README) - Max impact: +/- 30
    if (metrics.readme.exists) {
        score += 10;
        breakdown.push("Has a README (+10)");

        if (metrics.readme.sections >= 3) {
            score += 10;
            breakdown.push("Detailed README sections (+10)");
        } else {
            breakdown.push("Short README (< 3 sections)");
        }

        if (metrics.readme.hasSetup) {
            score += 5;
            breakdown.push("Includes Setup instructions (+5)");
        }
    } else {
        score -= 15;
        breakdown.push("No README found (-15)");
    }

    // 2. Testing - Max impact: +/- 20
    if (metrics.tests.exists) {
        score += 20;
        breakdown.push("Tests present (+20)");
    } else {
        score -= 20;
        breakdown.push("No automated tests detected (-20)");
    }

    // 3. Commit Consistency - Max impact: +/- 10
    if (metrics.commits.frequencyPerWeek >= 1) {
        score += 10;
        breakdown.push("Consistent commit history (+10)");
    } else if (metrics.commits.totalFetched > 0) {
        score -= 5;
        breakdown.push("Inconsistent or sparse commits (-5)");
    }

    // 4. Project Structure / Code - Max impact: +20
    if (metrics.counts.files > 5) {
        score += 10;
        breakdown.push("Substantial code base (+10)");
    }

    if (metrics.structure.depth >= 2) {
        score += 5;
        breakdown.push("Organized folder structure (+5)");
    } else if (metrics.counts.files > 10 && metrics.structure.depth < 2) {
        score -= 5;
        breakdown.push("Flat directory structure for medium project (-5)");
    }

    // Clamp score 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine Level
    let level = "Beginner";
    if (score >= 80) level = "Expert";
    else if (score >= 60) level = "Intermediate";
    else if (score >= 40) level = "Junior";

    return {
        score,
        level,
        breakdown
    };
};

module.exports = {
    calculateScore
};
