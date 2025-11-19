import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*, teams(*)')
      .eq('id', user.id)
      .single()

    return NextResponse.json({ 
      id: user.id,
      email: user.email,
      name: profile?.name || user.user_metadata?.name,
      phone_number: profile?.phone_number,
      ...profile 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
