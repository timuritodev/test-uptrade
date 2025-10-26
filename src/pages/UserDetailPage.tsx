import { useParams } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Button, Card, Group, Avatar, Text, Loader, Center, Alert, Modal, Stack, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useUser, useUpdateUser } from '../queries/users'
import { z } from 'zod'
import { notifications } from '@mantine/notifications'

const schema = z.object({
	first_name: z.string().min(1, 'Обязательное поле'),
	last_name: z.string().min(1, 'Обязательное поле'),
	email: z.string().email('Некорректный email'),
})

export default function UserDetailPage() {
	const { id = '' } = useParams<{ id: string }>()
	const { data, isLoading, isError } = useUser(id)
	const [opened, { open, close }] = useDisclosure(false)
	const mutation = useUpdateUser(id)

	const form = useForm({
		initialValues: { first_name: '', last_name: '', email: '' },
		validate: zodResolver(schema),
	})

	const user = data?.data

	if (isLoading) {
		return (
			<Center py="xl">
				<Loader />
			</Center>
		)
	}

	if (isError || !user) {
		return <Alert color="red">Пользователь не найден</Alert>
	}

	return (
		<>
			<Card withBorder>
				<Group>
					<Avatar src={user.avatar} radius="xl" size={72} />
					<div>
						<Text size="lg" fw={600}>
							{user.first_name} {user.last_name}
						</Text>
						<Text c="dimmed">ID: {user.id}</Text>
						<Text>{user.email}</Text>
					</div>
					<Button ml="auto" onClick={() => {
						form.setValues({ first_name: user.first_name, last_name: user.last_name, email: user.email })
						open()
					}}>
						Редактировать
					</Button>
				</Group>
			</Card>

			<Modal opened={opened} onClose={close} title="Редактирование пользователя" centered>
				<form
					onSubmit={form.onSubmit(async (values) => {
						try {
							await mutation.mutateAsync(values)
							notifications.show({ color: 'green', message: 'Данные обновлены' })
							close()
						} catch (e) {
							notifications.show({ color: 'red', message: 'Ошибка при сохранении' })
						}
					})}
				>
					<Stack>
						<TextInput label="First name" withAsterisk {...form.getInputProps('first_name')} />
						<TextInput label="Last name" withAsterisk {...form.getInputProps('last_name')} />
						<TextInput label="Email" withAsterisk {...form.getInputProps('email')} />
						<Group justify="flex-end" mt="md">
							<Button variant="default" onClick={close} disabled={mutation.isPending}>
								Отмена
							</Button>
							<Button type="submit" loading={mutation.isPending}>
								Сохранить
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</>
	)
}


