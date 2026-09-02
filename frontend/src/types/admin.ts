export interface AdminStats {
  total_users: number
  total_properties: number
  active_properties: number
  total_space_requests: number
  active_space_requests: number
  total_matches: number
  total_leads: number
}

export interface SpaceRequest {
  id: string
  user_id: string
  description: string | null
  city: string
  area: string | null
  min_size: number | null
  max_size: number | null
  max_rent: number | null
  desired_from: string | null
  status: string
  created_at: string
}

export interface Match {
  id: string
  property_id: string
  request_id: string
  score: number | null
  source: string
  reason: string | null
  status: string
  created_at: string
}