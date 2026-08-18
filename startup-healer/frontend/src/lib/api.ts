import axios, { AxiosInstance } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('access_token:v1')
          localStorage.removeItem('user:v1')
          window.location.href = '/auth/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth
  async login(email: string, password: string, portal: string) {
    const response = await this.client.post(`/auth/${portal}/login`, { email, password })
    return response.data
  }

  async logout() {
    try {
      await this.client.post('/auth/logout')
    } catch (err) {
      console.error('Logout failed on backend', err)
    }
  }

  // Clients
  async getClients(search?: string, status?: string) {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    const response = await this.client.get(`/clients?${params}`)
    return response.data
  }
  async getClient(id: string) { return (await this.client.get(`/clients/${id}`)).data }
  async createClient(data: any) { return (await this.client.post('/clients', data)).data }
  async updateClient(id: string, data: any) { return (await this.client.put(`/clients/${id}`, data)).data }
  async deleteClient(id: string) { return (await this.client.delete(`/clients/${id}`)).data }
  async getClientStats() { return (await this.client.get('/clients/stats')).data }
  async getMyProfile() { return (await this.client.get('/clients/my/profile')).data }
  async getAssignedClients() { return (await this.client.get('/clients/assigned')).data }

  // Employees
  async getEmployees() { return (await this.client.get('/employees')).data }
  async getEmployee(id: string) { return (await this.client.get(`/employees/${id}`)).data }
  async createEmployee(data: any) { return (await this.client.post('/employees', data)).data }
  async updateEmployee(id: string, data: any) { return (await this.client.put(`/employees/${id}`, data)).data }
  async deleteEmployee(id: string) { return (await this.client.delete(`/employees/${id}`)).data }
  async getEmployeePerformance(id: string) { return (await this.client.get(`/employees/${id}/performance`)).data }
  async getEmployeeCount() { return (await this.client.get('/employees/count')).data }

  // Tasks
  async getTasks() { return (await this.client.get('/tasks')).data }
  async getMyTasks() { return (await this.client.get('/tasks/my')).data }
  async getMyTodayTasks() { return (await this.client.get('/tasks/my/today')).data }
  async createTask(data: any) { return (await this.client.post('/tasks', data)).data }
  async updateTaskStatus(id: string, status: string) { return (await this.client.put(`/tasks/${id}/status`, { status })).data }
  async getTasksDueToday() { return (await this.client.get('/tasks/due-today/count')).data }
  async getOverdueTasks() { return (await this.client.get('/tasks/overdue/count')).data }
  async getEmployeeTasks(employeeId: string) { return (await this.client.get(`/tasks/employee/${employeeId}`)).data }

  // Targets
  async getMyTargets() { return (await this.client.get('/targets/my')).data }
  async createTarget(data: any) { return (await this.client.post('/targets', data)).data }
  async updateTarget(id: string, data: any) { return (await this.client.put(`/targets/${id}`, data)).data }
  async getEmployeeTargets(employeeId: string) { return (await this.client.get(`/targets/employee/${employeeId}`)).data }

  // EOD Updates
  async submitEod(data: any) { return (await this.client.post('/eod-updates', data)).data }
  async getMyEods() { return (await this.client.get('/eod-updates/my')).data }
  async getEmployeeEods(employeeId: string) { return (await this.client.get(`/eod-updates/employee/${employeeId}`)).data }

  // Service Applications
  async getMyServices() { return (await this.client.get('/service-applications/my')).data }
  async getClientServices(clientId: string) { return (await this.client.get(`/service-applications/client/${clientId}`)).data }
  async createServiceApplication(data: any) { return (await this.client.post('/service-applications', data)).data }
  async updateServiceStatus(id: string, data: any) { return (await this.client.put(`/service-applications/${id}/status`, data)).data }
  async uploadServiceDocument(id: string, documents: any[]) { return (await this.client.put(`/service-applications/${id}/documents`, { documents })).data }

  // Leave Requests
  async createLeaveRequest(data: any) { return (await this.client.post('/leave-requests', data)).data }
  async getMyLeaves() { return (await this.client.get('/leave-requests/my')).data }
  async getAllLeaves() { return (await this.client.get('/leave-requests')).data }
  async getPendingLeaves() { return (await this.client.get('/leave-requests/pending')).data }
  async updateLeaveStatus(id: string, data: any) { return (await this.client.put(`/leave-requests/${id}/status`, data)).data }

  // Attendance
  async checkIn() { return (await this.client.post('/attendance/check-in')).data }
  async checkOut() { return (await this.client.put('/attendance/check-out')).data }
  async getMyAttendance(month?: number, year?: number) {
    const params = new URLSearchParams()
    if (month) params.append('month', month.toString())
    if (year) params.append('year', year.toString())
    return (await this.client.get(`/attendance/my?${params}`)).data
  }
  async getTodayAttendance() { return (await this.client.get('/attendance/today')).data }
  async getEmployeeAttendance(id: string, month?: number, year?: number) {
    const params = new URLSearchParams()
    if (month) params.append('month', month.toString())
    if (year) params.append('year', year.toString())
    return (await this.client.get(`/attendance/employee/${id}?${params}`)).data
  }
  async getAttendanceSummary(month?: number, year?: number) {
    const params = new URLSearchParams()
    if (month) params.append('month', month.toString())
    if (year) params.append('year', year.toString())
    return (await this.client.get(`/attendance/summary?${params}`)).data
  }

  // Salary Slips
  async uploadSalarySlip(data: any) { return (await this.client.post('/salary-slips', data)).data }
  async getMySalarySlips() { return (await this.client.get('/salary-slips/my')).data }
  async getAllSalarySlips() { return (await this.client.get('/salary-slips')).data }
  async getEmployeeSalarySlips(id: string) { return (await this.client.get(`/salary-slips/employee/${id}`)).data }
}

export const apiClient = new ApiClient()
