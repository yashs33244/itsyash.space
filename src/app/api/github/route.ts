import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

const GITHUB_USERNAME = "yashs33244";

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export async function GET() {
  try {
    // Use the public GitHub GraphQL API - no token needed for public profiles
    // But if a token is available, use it for higher rate limits
    const token = process.env.GITHUB_TOKEN;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const query = `
      {
        user(login: "${GITHUB_USERNAME}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      // Fallback: try REST API for basic stats
      const restResponse = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      const userData = await restResponse.json();

      return NextResponse.json({
        totalContributions: null,
        weeks: [],
        publicRepos: userData.public_repos || 0,
        followers: userData.followers || 0,
      });
    }

    const data = await response.json();
    const calendar =
      data.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return NextResponse.json({
        totalContributions: 0,
        weeks: [],
        publicRepos: 0,
        followers: 0,
      });
    }

    // Also fetch basic user stats
    const userResponse = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    const userData = await userResponse.json();

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks as ContributionWeek[],
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
    });
  } catch (error) {
    console.error("[GitHub API] Error:", error);
    return NextResponse.json(
      { totalContributions: 0, weeks: [], publicRepos: 0, followers: 0 },
      { status: 200 }
    );
  }
}
