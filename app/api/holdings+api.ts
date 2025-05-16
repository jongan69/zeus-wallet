export async function GET(request: Request) {
    const url = new URL(request.url);
    const address = url.searchParams.get('address');
    const network = url.searchParams.get('network');
    // console.log("network", network);
    const baseUrl = network === 'mainnet' ? 'https://api.helius.xyz?api-key=' + process.env.HELIUS_API_KEY : 'https://api-devnet.helius.xyz?api-key=' + process.env.HELIUS_API_KEY;
    const body = JSON.stringify({
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getAssetsByOwner",
        "params": {
            "ownerAddress": address,
            "page": 1,
            "limit": 1000,
            "sortBy": {
                "sortBy": "created",
                "sortDirection": "asc"
            },
            "options": {
                "showUnverifiedCollections": false,
                "showCollectionMetadata": true,
                "showGrandTotal": true,
                "showFungible": true,
                "showNativeBalance": true,
                "showInscription": false,
                "showZeroBalance": false
            }
        }
    });
    // console.log("fullUrl", fullUrl);
    if (!address) {
        return new Response('No address found', {
            status: 404,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
    const response = await fetch(baseUrl, {
        method: 'POST',
        body: body,
    });
    const holdings = await response.json();
    return Response.json({ holdings });
}