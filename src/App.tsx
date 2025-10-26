import { AppShell, Container } from '@mantine/core'
import { Route, Routes, Navigate } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import UserDetailPage from './pages/UserDetailPage'

function App() {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Container size="lg" px="md" py="sm">
          Пользователи
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg">
          <Routes>
            <Route path="/" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
