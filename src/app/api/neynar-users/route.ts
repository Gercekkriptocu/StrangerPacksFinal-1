import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = '2F5B5834-F8C6-4519-B531-EC7DA830BFEB';

  try {
    // Fetch trending (active) users from Neynar (Limit 200 for a larger pool)
    const response = await fetch('https://api.neynar.com/v2/farcaster/user/trending?limit=200', {
      headers: {
        accept: 'application/json',
        api_key: apiKey,
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Neynar API error');
    }

    const data = await response.json();
    const users = data.users;

    // Shuffle users (Fisher-Yates shuffle)
    const shuffled = users.sort(() => 0.5 - Math.random());

    // Select first 3 and extract only usernames
    const selectedUsernames = shuffled.slice(0, 3).map((u: any) => u.username);

    return NextResponse.json({ usernames: selectedUsernames });
  } catch (error) {
    console.error('Neynar Fetch Error:', error);
    // If error occurs, return empty array so the system doesn't crash
    return NextResponse.json({ usernames: [] });
  }
}
