import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify judge credentials
    const { data: judge, error } = await supabase
      .from('judges')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('is_active', true)
      .single()

    if (error || !judge) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    await supabase
      .from('judges')
      .update({ last_login: new Date().toISOString() })
      .eq('id', judge.id)

    return NextResponse.json({
      success: true,
      judge: {
        id: judge.id,
        name: judge.name,
        email: judge.email
      }
    })
  } catch (error) {
    console.error('Error in judge login:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
