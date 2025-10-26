import axios from 'axios'

export const api = axios.create({
	baseURL: 'https://reqres.in/api',
	headers: {
		'x-api-key': 'reqres-free-v1'
	}
})

export type ReqResUser = {
	id: number
	email: string
	first_name: string
	last_name: string
	avatar: string
}

export type UsersResponse = {
	page: number
	per_page: number
	total: number
	total_pages: number
	data: ReqResUser[]
}

export type UserResponse = { data: ReqResUser }

export type UpdateUserPayload = Pick<ReqResUser, 'first_name' | 'last_name' | 'email'>

export async function fetchUsers(page: number) {
	const { data } = await api.get<UsersResponse>(`/users`, { params: { page } })
	return data
}

export async function fetchUser(id: string | number) {
	const { data } = await api.get<UserResponse>(`/users/${id}`)
	return data
}

export async function updateUser(id: string | number, payload: UpdateUserPayload) {
	const { data } = await api.put(`/users/${id}`, payload)
	return data as { updatedAt: string } & UpdateUserPayload
}