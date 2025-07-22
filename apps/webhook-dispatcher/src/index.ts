import type { 
  Environment, 
  HygraphWebhookPayload, 
  GitHubDispatchPayload 
} from './types';

const MOLLY_HYGRAPH_ID = 'cm04nyf07552w07k4jjp4m99x';
const CALEB_HYGRAPH_ID = 'cm4ah947ne1z507ln7pxluzwu';

async function handleWebhook(
  request: Request, 
  env: Environment
): Promise<Response> {
  try {
    // Parse the incoming webhook payload
    const payload = await request.json() as HygraphWebhookPayload;
    
    console.log('Received webhook:', JSON.stringify(payload, null, 2));
    
    // Determine which site to deploy based on the data.id
    let eventType: string;
    
    if (payload.data?.id === MOLLY_HYGRAPH_ID) {
      eventType = 'molly';
    } else if (payload.data?.id === CALEB_HYGRAPH_ID) {
      eventType = 'caleb';
    } else if (payload.data?.id) {
      eventType = 'micah';
    } else {
      // Default to all if no ID is provided
      eventType = 'all';
    }
    
    console.log(`Determined event type: ${eventType}`);
    
    // Create GitHub dispatch payload
    const dispatchPayload: GitHubDispatchPayload = {
      event_type: eventType,
      client_payload: {
        operation: payload.operation,
        typename: payload.data?.__typename,
        stage: payload.data?.stage,
        source: 'hygraph-webhook',
        timestamp: new Date().toISOString()
      }
    };
    
    // Send repository dispatch to GitHub
    const githubResponse = await fetch(
      `${env.GITHUB_API_URL}/repos/${env.GITHUB_REPO}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.NPM_GH_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'webhook-dispatcher/1.0'
        },
        body: JSON.stringify(dispatchPayload)
      }
    );
    
    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error('GitHub API error:', githubResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to dispatch to GitHub',
          status: githubResponse.status,
          details: errorText
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('Successfully dispatched to GitHub');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        eventType,
        dispatched: true,
        payload: dispatchPayload
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function handleCORS(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export default {
  async fetch(
    request: Request, 
    env: Environment
  ): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }
    
    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405,
          headers: { 
            'Content-Type': 'application/json',
            'Allow': 'POST, OPTIONS'
          }
        }
      );
    }
    
    // Validate environment variables
    if (!env.NPM_GH_TOKEN || !env.GITHUB_REPO) {
      return new Response(
        JSON.stringify({ error: 'Missing required environment variables' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const response = await handleWebhook(request, env);
    
    // Add CORS headers to the response
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
  }
}; 