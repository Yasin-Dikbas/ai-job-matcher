import { useAuth } from '../context/AuthContext'
import CandidateDashboard from './CandidateDashboard'
import EmployerDashboard from './EmployerDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  return user.role === 'employer' ? <EmployerDashboard /> : <CandidateDashboard />
}
