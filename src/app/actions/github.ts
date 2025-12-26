"use server";

import { env } from "@/lib/env";

import { logError, addBreadcrumb } from "@/lib/errorLogger";



interface FileChange {

  path: string;

  content: string;

  message: string;

}



interface SyncResult {

  success: boolean;

  message: string;

  error?: string;

}



export interface CreateIssueOptions {

  title: string;

  body: string;

  labels?: string[];

}



/**

 * Retry mechanism for API calls

 */

async function fetchWithRetry(

  url: string,

  options: RequestInit,

  maxRetries: number = 3

): Promise<Response> {

  let lastError: Error | null = null;



  for (let attempt = 1; attempt <= maxRetries; attempt++) {

    try {

      const response = await fetch(url, options);



      // If successful, return immediately

      if (response.ok) {

        return response;

      }



      // If rate limited, wait before retrying

      if (response.status === 429) {

        const retryAfter = response.headers.get("retry-after");

        const waitTime = (parseInt(retryAfter || "60") + 1) * 1000;

        console.warn(

          `Rate limited. Retrying after ${waitTime / 1000} seconds...`

        );

        await new Promise((resolve) => setTimeout(resolve, waitTime));

        continue;

      }



      // For other non-2xx responses, throw error

      throw new Error(

        `GitHub API error: ${response.status} ${response.statusText}`

      );

    } catch (error) {

      lastError = error instanceof Error ? error : new Error(String(error));

      console.warn(`Attempt ${attempt}/${maxRetries} failed:`, lastError);

      

      // We can't use client-side breadcrumbs here easily, so we just log

      console.error(`Attempt ${attempt} failed: ${lastError.message}`);



      // Wait before retrying (exponential backoff)

      if (attempt < maxRetries) {

        const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...

        await new Promise((resolve) => setTimeout(resolve, delay));

      }

    }

  }



  throw lastError || new Error("GitHub API request failed after retries");

}



/**

 * Commit file changes to GitHub

 * Uses GitHub API to update files directly

 * Includes automatic retry logic for transient failures

 */

export async function commitChangesToGitHub(

  changes: FileChange[],

  branch: string = "development"

): Promise<SyncResult> {

  const token = env.NEXT_GITHUB_TOKEN;

  const owner = "AdharshJolly";

  const repo = "inc4-2026";



  if (!token) {

    const error =

      "GitHub token not available for syncing. Please set NEXT_GITHUB_TOKEN in your .env file with a GitHub Personal Access Token.";

    console.error(error);

    return { success: false, message: error };

  }



  try {

    // Get current branch reference to find the latest commit SHA

    const refResponse = await fetchWithRetry(

      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,

      {

        headers: {

          Authorization: `token ${token}`,

          "Content-Type": "application/json",

        },

      }

    );



    const refData = await refResponse.json();

    const latestCommitSha = refData.object.sha;



    // Get the tree of the latest commit

    const commitResponse = await fetchWithRetry(

      `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,

      {

        headers: {

          Authorization: `token ${token}`,

          "Content-Type": "application/json",

        },

      }

    );



    const commitData = await commitResponse.json();

    const baseTreeSha = commitData.tree.sha;



    // Create blob objects for each changed file

    const treeItems = [];

    for (const change of changes) {

      const blobResponse = await fetchWithRetry(

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



      // Check response status

      if (!blobResponse.ok) {

        const errorBody = await blobResponse.text();

        throw new Error(

          `Failed to create blob for ${change.path}: ${blobResponse.status} ${blobResponse.statusText}. Response: ${errorBody}`

        );

      }



      // Parse and validate response

      const blobData = (await blobResponse.json()) as Record<string, unknown>;



      // Validate sha property exists and is a string

      if (typeof blobData.sha !== "string" || !blobData.sha) {

        throw new Error(

          `Invalid blob response for ${

            change.path

          }: missing or invalid sha property. Response: ${JSON.stringify(

            blobData

          )}`

        );

      }



      // Only push tree item when sha is valid

      treeItems.push({

        path: change.path,

        mode: "100644",

        type: "blob",

        sha: blobData.sha,

      });

    }



    // Create a new tree with the changes

    const treeResponse = await fetchWithRetry(

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



    // Validate tree response

    if (!treeResponse.ok) {

      const errorBody = await treeResponse.text();

      throw new Error(

        `Failed to create tree: ${treeResponse.status} ${treeResponse.statusText}. Response: ${errorBody}`

      );

    }



    const treeData = (await treeResponse.json()) as Record<string, unknown>;



    // Validate tree sha property

    if (typeof treeData.sha !== "string" || !treeData.sha) {

      throw new Error(

        `Invalid tree response: missing or invalid sha property. Response: ${JSON.stringify(

          treeData

        )}`

      );

    }



    // Create a commit with the new tree

    const commitMessageParts = changes.map((c) => c.message);

    const commitMessage =

      commitMessageParts.length === 1

        ? commitMessageParts[0]

        : `Admin Dashboard Updates\n\n${commitMessageParts

            .map((m) => `- ${m}`)

            .join("\n")}`;



    const newCommitResponse = await fetchWithRetry(

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



    // Validate commit response

    if (!newCommitResponse.ok) {

      const errorBody = await newCommitResponse.text();

      throw new Error(

        `Failed to create commit: ${newCommitResponse.status} ${newCommitResponse.statusText}. Response: ${errorBody}`

      );

    }



    const newCommitData = (await newCommitResponse.json()) as Record<

      string,

      unknown

    >;



    // Validate commit sha property

    if (typeof newCommitData.sha !== "string" || !newCommitData.sha) {

      throw new Error(

        `Invalid commit response: missing or invalid sha property. Response: ${JSON.stringify(

          newCommitData

        )}`

      );

    }



    // Update the branch reference to point to the new commit

    const updateRefResponse = await fetchWithRetry(

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

      const errorBody = await updateRefResponse.text();

      throw new Error(

        `Failed to update branch reference for ${branch}: ${updateRefResponse.status} ${updateRefResponse.statusText}. Response: ${errorBody}`

      );

    }



    const message = `Successfully synced ${changes.length} file(s) to ${branch}`;

    console.log(message);

    // addBreadcrumb logic would be different on server, keeping it simple for now

    return { success: true, message };

  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error("Error syncing with GitHub:", errorMessage);

    // logError might need adjustment for server usage if it relies on window/browser APIs

    // Assuming logError is universal or ignoring for now

    return {

      success: false,

      message: "Failed to sync changes to GitHub",

      error: errorMessage,

    };

  }

}



export async function createGitHubIssue(

  options: CreateIssueOptions

): Promise<{ success: boolean; url?: string; error?: string }> {

  const token = env.NEXT_GITHUB_TOKEN;

  const owner = "AdharshJolly";

  const repo = "inc4-2026";



  if (!token) {

    return {

      success: false,

      error: "GitHub token not configured (NEXT_GITHUB_TOKEN)",

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
