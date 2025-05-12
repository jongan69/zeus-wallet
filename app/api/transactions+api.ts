export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = url.searchParams.get('address');
  if (!address) {
    return new Response('No address found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  const response = await fetch(`https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.HELIUS_API_KEY}`, {
    method: 'GET',
  });
  const transactions = await response.json();
  return Response.json({ transactions });
}