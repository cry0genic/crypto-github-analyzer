const octokit = require("../index");
const { toDateTime, sortArrayByAsc } = require("../utils")
// Returns a weekly aggregate of the number of additions and deletions pushed to a repository.
const getWeeklyCommitActivity = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/stats/code_frequency`);
    let result = response.map((item) => {
        const date = item[0];
        const additions = item[1];
        const deletions = item[2];
        return {
            date: toDateTime(date),
            additions,
            deletions,
        }
    });
    result = sortArrayByAsc(result, "date");
    return result;
};

// Returns the last year of commit activity grouped by week. 
// The days array is a group of commits per day, starting on Sunday.
const getLastYearCommitActivity = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/stats/commit_activity`);
    let result = response.map((item) => {
        const total = item.total;
        const week = item.week;
        return {
            "total": total,
            "date": toDateTime(week),
        }
    })
    result = sortArrayByAsc(result, "date");
    return result;
};

// Returns the total number of commits authored by the contributor. 
// In addition, the response includes a Weekly Hash (weeks array) with the following information:
// w - Start of the week, given as a Unix timestamp.
// a - Number of additions
// d - Number of deletions
// c - Number of commits
const getAllContributorCommitActivity = async (owner, repo) => {
    const response = await octokit.paginate(`GET /repos/${owner}/${repo}/stats/contributors`);
    let result = response.map((item) => {
        const total = item.total;
        const weeks = item.weeks;
        const author = item.author.html_url;
        return {
            "total": total,
            "contributor": author, // left out weeks as of now
            // "weeks": weeks //
        };
    });
    return result.sort((a, b) => {
        return b.total - a.total;
    }); //desc order of contributions
};

// Returns the total commit counts for the owner and total commit counts in all. 
// all is everyone combined, including the owner in the last 52 weeks. 
// If you'd like to get the commit counts for non-owners, you can subtract owner from all.
// The array order is oldest week (index 0) to most recent week.
const getWeeklyCommitCount = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/stats/participation`);
    const data = response.data;
    const allTotal = data.all.reduce((x, y) => x + y, 0);
    const ownerTotal = data.owner.reduce((x, y) => x + y, 0);
    const exceptOwner = allTotal - ownerTotal;
    return {
        allTotal,
        ownerTotal,
        exceptOwner
    };
};

// Each array contains the day number, hour number, and number of commits:
// 0-6: Sunday - Saturday
// 0-23: Hour of day
// Number of commits
// For example, [2, 14, 25] indicates that there were 25 total commits, 
// during the 2:00pm hour on Tuesdays. All times are based on the time zone of individual commits.
const getHourlyCommitCountForEachDay = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/stats/punch_card`);
    console.log(response); // not implemented as of now
};

module.exports = {
    getWeeklyCommitActivity,
    getWeeklyCommitCount,
    getLastYearCommitActivity,
    getAllContributorCommitActivity,
    getHourlyCommitCountForEachDay
};