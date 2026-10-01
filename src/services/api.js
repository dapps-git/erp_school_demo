import { mockStorage } from './mockStorage';

class ApiClient {
  constructor() {
    this.storage = mockStorage;
  }

  getToken() {
    return localStorage.getItem('school_crm_token');
  }

  // Auth
  async login(credentials) {
    return this.storage.login(credentials.email, credentials.password);
  }

  async getMe() {
    return this.storage.getMe();
  }

  async updateProfile(data) {
    return this.storage.updateProfile(data);
  }

  async changePassword(data) {
    return this.storage.changePassword(data.currentPassword, data.newPassword);
  }

  // Dashboard
  async getDashboard() {
    return this.storage.getDashboard();
  }

  // Classes & Divisions
  async getClasses() {
    return this.storage.getClasses();
  }

  async addClass(data) {
    return this.storage.addClass(data);
  }

  async addDivision(classId, data) {
    return this.storage.addDivision(classId, data);
  }

  async updateDivision(id, data) {
    return this.storage.updateDivision(id, data);
  }

  async deleteDivision(id) {
    return this.storage.deleteDivision(id);
  }

  // Students
  async getStudents(params = {}) {
    return this.storage.getStudents(params);
  }

  async getStudent(id) {
    return this.storage.getStudent(id);
  }

  async createStudent(data) {
    return this.storage.createStudent(data);
  }

  async updateStudent(id, data) {
    return this.storage.updateStudent(id, data);
  }

  async deleteStudent(id) {
    return this.storage.deleteStudent(id);
  }

  // Attendance
  async getAttendanceSheet(params) {
    return this.storage.getAttendanceSheet(params);
  }

  async saveAttendance(data) {
    return this.storage.saveAttendance(data);
  }

  async getAttendanceHistory(params = {}) {
    return this.storage.getAttendanceHistory(params);
  }

  // Staff
  async getStaff(params = {}) {
    return this.storage.getStaff(params);
  }

  async getStaffById(id) {
    return this.storage.getStaffById(id);
  }

  async createStaff(data) {
    return this.storage.createStaff(data);
  }

  async updateStaff(id, data) {
    return this.storage.updateStaff(id, data);
  }

  async deleteStaff(id) {
    return this.storage.deleteStaff(id);
  }

  // Salary
  async getSalaries(params = {}) {
    return this.storage.getSalaries(params);
  }

  async createSalary(data) {
    return this.storage.createSalary(data);
  }

  async updateSalary(id, data) {
    return this.storage.updateSalary(id, data);
  }

  async deleteSalary(id) {
    return this.storage.deleteSalary(id);
  }

  // Finance (Income & Expense)
  async getIncomes(params = {}) {
    return this.storage.getIncomes(params);
  }

  async createIncome(data) {
    return this.storage.createIncome(data);
  }

  async deleteIncome(id) {
    return this.storage.deleteIncome(id);
  }

  async getExpenses(params = {}) {
    return this.storage.getExpenses(params);
  }

  async createExpense(data) {
    return this.storage.createExpense(data);
  }

  async deleteExpense(id) {
    return this.storage.deleteExpense(id);
  }

  async getFinancialSummary() {
    return this.storage.getFinancialSummary();
  }

  // Reports
  async getReport(type, params = {}) {
    return this.storage.getReport(type, params);
  }

  // Settings
  async getSettings() {
    return this.storage.getSettings();
  }

  async updateSettings(data) {
    return this.storage.updateSettings(data);
  }
}

export const api = new ApiClient();
export default api;
