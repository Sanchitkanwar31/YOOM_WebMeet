'use server';

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error('User is not authenticated');
  if (!STREAM_API_KEY) throw new Error('Stream API key secret is missing');
  if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing');
  

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const token = streamClient.generateUserToken({
    user_id: user.id,  // Pass an object with user_id
    exp: Math.floor(Date.now() / 1000) + 3600,  // Optional, specify expiration time (1 hour in this example)
    iat: Math.floor(Date.now() / 1000) - 60     // Optional, issued at time (1 minute ago in this example)
  });
  

  return token;
};