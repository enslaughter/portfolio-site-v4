import { getVercelOidcToken } from '@vercel/oidc'
import { ExternalAccountClient } from 'google-auth-library'

const {
  GCP_PROJECT_NUMBER,
  GCP_SERVICE_ACCOUNT_EMAIL,
  GCP_WORKLOAD_IDENTITY_POOL_ID,
  GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID,
  NEXT_PUBLIC_WS_URL,
} = process.env

const IAM_CREDENTIALS_ENDPOINT =
  'https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts'

export async function GET() {
  if (
    !GCP_PROJECT_NUMBER ||
    !GCP_SERVICE_ACCOUNT_EMAIL ||
    !GCP_WORKLOAD_IDENTITY_POOL_ID ||
    !GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID
  ) {
    return Response.json({ token: null })
  }

  const authClient = ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `${IAM_CREDENTIALS_ENDPOINT}/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: () => getVercelOidcToken(),
    },
  })

  if (!authClient) {
    return Response.json({ error: 'Failed to initialise auth client' }, { status: 500 })
  }

  const { token: accessToken } = await authClient.getAccessToken()
  if (!accessToken) {
    return Response.json({ error: 'Failed to obtain access token' }, { status: 502 })
  }

  const wsAudience = (NEXT_PUBLIC_WS_URL ?? '').replace(/^wss?:\/\//, 'https://')
  const idTokenResponse = await fetch(
    `${IAM_CREDENTIALS_ENDPOINT}/${GCP_SERVICE_ACCOUNT_EMAIL}:generateIdToken`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ audience: wsAudience, includeEmail: true }),
    }
  )

  if (!idTokenResponse.ok) {
    console.error('ID token generation failed:', await idTokenResponse.text())
    return Response.json({ error: 'ID token generation failed' }, { status: 502 })
  }

  const { token } = await idTokenResponse.json()
  return Response.json({ token })
}
