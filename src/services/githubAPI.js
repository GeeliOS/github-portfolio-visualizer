import axios from 'axios';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  }
});

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN || "";


export const getGitHubUser = async (username) => {
  try {
    const response = await githubAPI.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    throw error;
  }
};

export const getAllUserRepos = async (username, perPage = 100) => {
  try {
    let allRepos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await githubAPI.get(`/users/${username}/repos`, {
        params: {
          sort: 'updated',
          direction: 'desc',
          page,
          per_page: perPage
        }
      });

      const repos = response.data;
      allRepos = [...allRepos, ...repos];

      if (repos.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allRepos;
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw error;
  }
};