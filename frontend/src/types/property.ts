export interface Property {
  id: string
  owner_id: string
  title: string
  description: string | null
  address: string
  city: string
  postal_code: string | null
  area: string | null
  size_sqm: number
  monthly_rent: number
  property_type: string
  available_from: string | null
  status: string
  created_at: string
}