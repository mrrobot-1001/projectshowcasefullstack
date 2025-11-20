import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    console.log('Updating user:', id, updates)
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      throw error
    }

    console.log('User updated successfully:', data)
    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('Attempting to delete user:', id)
    
    // First, delete all likes made by this user
    console.log('Deleting likes by user:', id)
    const { error: likesError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', id)

    if (likesError) {
      console.error('Error deleting user likes:', likesError)
      // Continue anyway
    }

    // Delete the user from auth (this will cascade to users table if set up properly)
    console.log('Deleting user from database:', id)
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (userError) {
      console.error('Error deleting user:', userError)
      throw userError
    }

    console.log('User deleted successfully:', id)
    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete user' },
      { status: 500 }
    )
  }
}
