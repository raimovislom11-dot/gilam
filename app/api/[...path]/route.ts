import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

const API_URL = process.env.API_URL ?? 'https://gilam.213.199.51.43.sslip.io'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, params)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, params)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, params)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, params)
}

async function handleRequest(request: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  try {
    const { path } = await paramsPromise
    const pathString = path.join('/')
    const url = new URL(request.url)
    const queryString = url.search
    
    const targetUrl = `${API_URL}/api/${pathString}${queryString}`

    const session = await getSession()
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    if (session?.apiToken) {
      headers.set('Authorization', `Bearer ${session.apiToken}`)
    }

    const method = request.method
    let body: any = undefined
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.text()
    }

    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
    })

    if (!res.ok) {
      const errorText = await res.text()
      return new NextResponse(errorText, {
        status: res.status,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const dataText = await res.text()
    return new NextResponse(dataText, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Proxy Error' }, { status: 500 })
  }
}
