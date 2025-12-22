/**
 * GitHub Sync Utility
 * Handles committing changes to GitHub when admin session ends
 */

interface FileChange {
  path: string;
  content: string;
  message: string;
}

/**
 * Commit file changes to GitHub
 * Uses GitHub API to update files directly
 */
export async function commitChangesToGitHub(
  changes: FileChange[],
  branch: string = "development"
) {
  const token = import.meta.env.VITE_TINA_TOKEN;
  const owner = "AdharshJolly";
  const repo = "inc4-2026";

  if (!token) {
    console.error("GitHub token not available for syncing");
    return false;
  }

  try {
    // Get current branch reference to find the latest commit SHA
    const refResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!refResponse.ok) {
      throw new Error(
        `Failed to get branch reference: ${refResponse.statusText}`
      );
    }

    const refData = await refResponse.json();
    const latestCommitSha = refData.object.sha;

    // Get the tree of the latest commit
    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
      {
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!commitResponse.ok) {
      throw new Error(`Failed to get commit: ${commitResponse.statusText}`);
    }

    const commitData = await commitResponse.json();
    const baseTreeSha = commitData.tree.sha;

    // Create blob objects for each changed file
    const treeItems = [];
    for (const change of changes) {
      const blobResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: change.content,
            encoding: "utf-8",
          }),
        }
      );

      if (!blobResponse.ok) {
        throw new Error(`Failed to create blob: ${blobResponse.statusText}`);
      }

      const blobData = await blobResponse.json();
      treeItems.push({
        path: change.path,
        mode: "100644",
        type: "blob",
        sha: blobData.sha,
      });
    }

    // Create a new tree with the changes
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeItems,
        }),
      }
    );

    if (!treeResponse.ok) {
      throw new Error(`Failed to create tree: ${treeResponse.statusText}`);
    }

    const treeData = await treeResponse.json();

    // Create a commit with the new tree
    const commitMessageParts = changes.map((c) => c.message);
    const commitMessage =
      commitMessageParts.length === 1
        ? commitMessageParts[0]
        : `Admin Dashboard Updates\n\n${commitMessageParts
            .map((m) => `- ${m}`)
            .join("\n")}`;

    const newCommitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          tree: treeData.sha,
          parents: [latestCommitSha],
        }),
      }
    );

    if (!newCommitResponse.ok) {
      throw new Error(
        `Failed to create commit: ${newCommitResponse.statusText}`
      );
    }

    const newCommitData = await newCommitResponse.json();

    // Update the branch reference to point to the new commit
    const updateRefResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha: newCommitData.sha,
          force: false,
        }),
      }
    );

    if (!updateRefResponse.ok) {
      throw new Error(
        `Failed to update branch: ${updateRefResponse.statusText}`
      );
    }

    console.log(`Successfully committed changes to ${branch}`);
    return true;
  } catch (error) {
    console.error("Error syncing with GitHub:", error);
    return false;
  }
}

/**
 * Store pending changes in session storage to batch commit on logout
 */
export function storePendingChange(change: FileChange) {
  const pending = getPendingChanges();
  pending.push(change);
  sessionStorage.setItem("pendingGitHubChanges", JSON.stringify(pending));
}

/**
 * Get all pending changes
 */
export function getPendingChanges(): FileChange[] {
  const pending = sessionStorage.getItem("pendingGitHubChanges");
  return pending ? JSON.parse(pending) : [];
}

/**
 * Clear pending changes after successful commit
 */
export function clearPendingChanges() {
  sessionStorage.removeItem("pendingGitHubChanges");
}

/**
 * Check if there are pending changes
 */
export function hasPendingChanges(): boolean {
  return getPendingChanges().length > 0;
}
