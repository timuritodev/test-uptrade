import { useSearchParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Table, TextInput, Pagination, Group, Anchor, Loader, Center, Alert } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useUsers } from '../queries/users'

export default function UsersPage() {
	const [params, setParams] = useSearchParams()
	const [search, setSearch] = useState('')

	const page = Number(params.get('page') ?? '1') || 1
	const { data, isLoading, isError } = useUsers(page)

	const filtered = useMemo(() => {
		if (!data) return []
		const q = search.trim().toLowerCase()
		if (!q) return data.data
		return data.data.filter((u) =>
			[u.id, u.first_name, u.last_name, u.email]
				.join(' ')
				.toLowerCase()
				.includes(q),
		)
	}, [data, search])

	if (isLoading) {
		return (
			<Center py="xl">
				<Loader />
			</Center>
		)
	}

	if (isError) {
		return <Alert color="red">Не удалось загрузить пользователей</Alert>
	}

	const total = data?.total_pages ?? 1

	return (
		<>
			<Group justify="space-between" mb="md">
				<TextInput
					leftSection={<IconSearch size={16} />}
					placeholder="Поиск..."
					value={search}
					onChange={(e) => setSearch(e.currentTarget.value)}
					w={320}
				/>
			</Group>

			<Table striped withTableBorder withColumnBorders highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>ID</Table.Th>
						<Table.Th>First Name</Table.Th>
						<Table.Th>Last Name</Table.Th>
						<Table.Th>Email</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{filtered.length === 0 && (
						<Table.Tr>
							<Table.Td colSpan={4}>
								<Center py="md">Нет данных</Center>
							</Table.Td>
						</Table.Tr>
					)}
					{filtered.map((u) => (
						<Table.Tr key={u.id}>
							<Table.Td>
								<Anchor component={Link} to={`/users/${u.id}`}>
									{u.id}
								</Anchor>
							</Table.Td>
							<Table.Td>{u.first_name}</Table.Td>
							<Table.Td>{u.last_name}</Table.Td>
							<Table.Td>{u.email}</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			<Group justify="center" mt="md">
				<Pagination
					total={total}
					value={page}
					onChange={(p) => setParams({ page: String(p) })}
				/>
			</Group>
		</>
	)
}


