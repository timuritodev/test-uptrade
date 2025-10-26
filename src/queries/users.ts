import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUser, fetchUsers, updateUser, type UsersResponse, type UserResponse, type UpdateUserPayload } from '../lib/api'

export function useUsers(page: number) {
	return useQuery<UsersResponse>({
		queryKey: ['users', page],
		queryFn: () => fetchUsers(page),
		staleTime: 60_000,
		placeholderData: (previousData) => previousData,
	})
}

export function useUser(id: string | number) {
	return useQuery<UserResponse>({
		queryKey: ['user', id],
		queryFn: () => fetchUser(id),
		enabled: !!id,
		staleTime: 60_000,
	})
}

export function useUpdateUser(id: string | number) {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (payload: UpdateUserPayload) => updateUser(id, payload),
		onSuccess: (data) => {
			qc.setQueryData<UserResponse>(['user', id], (prev) => {
				if (!prev) return prev
				return { data: { ...prev.data, ...data } }
			})
		},
	})
}