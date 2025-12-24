/**
 * GitHub Issues Helper
 * Creates issues in the repository for critical errors or admin reports.
 */

export interface CreateIssueOptions {
  title: string;
  body: string;
  labels?: string[];
}

export async function createGitHubIssue(
  options: CreateIssueOptions
): Promise<{ success: boolean; url?: string; error?: string }> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const owner = "AdharshJolly";
  const repo = "inc4-2026";

  if (!token) {
    return {
      success: false,
      error: "GitHub token not configured (VITE_GITHUB_TOKEN)",
    };
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          title: options.title,
          body: options.body,
          labels: options.labels || ["bug", "auto-logged"],
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data?.message || response.statusText };
    }

    const data = await response.json();
    return { success: true, url: data.html_url };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
