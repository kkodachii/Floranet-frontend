// API service for authentication and other API calls
// Replace the base URL with your actual backend URL

import config from "../config/env";

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth headers with token
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication methods
  async login(username, password) {
    return this.request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async getNotifications(id) {
    return this.request(`/admin/notifications/${id}`);
  }

  async markAsRead(id) {
    return this.request(`/admin/notifications/read/${id}`, {
      method: "POST",
    });
  }

  async markAllAsRead(id) {
    return this.request(`/admin/notifications/read-all/${id}`, {
      method: "POST",
    });
  }

  async sendOTP(email) {
    return this.request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email, otp) {
    return this.request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    });
  }

  async logout() {
    return this.request("/admin/logout", {
      method: "POST",
    });
  }

  // User management methods
  async getUsers() {
    return this.request("/admin/users");
  }

  async getUserById(id) {
    return this.request(`/admin/users/${id}`);
  }

  async createUser(userData) {
    return this.request("/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: "DELETE",
    });
  }

  // Resident management methods
  async getResidents(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/residents?${params.toString()}`);
  }

  async getResidentRequests(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/resident-requests?${params.toString()}`);
  }

  async getArchivedResidents(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/archived-residents?${params.toString()}`);
  }

  async getResidentById(residentId) {
    return this.request(`/admin/residents/${residentId}`);
  }

  async getNextResidentId() {
    return this.request(`/admin/residents-next-id`);
  }

  async updateResident(residentId, residentData) {
    return this.request(`/admin/residents/${residentId}`, {
      method: "PUT",
      body: JSON.stringify(residentData),
    });
  }

  async createResident(residentData) {
    return this.request(`/admin/residents`, {
      method: "POST",
      body: JSON.stringify(residentData),
    });
  }

  async acceptResidentRequest(id) {
    return this.request(`/admin/resident-requests/${id}/accept`, {
      method: "POST",
    });
  }

  async deleteResidentRequest(id) {
    return this.request(`/admin/resident-requests/${id}`, {
      method: "DELETE",
    });
  }

  async archiveResident(id) {
    return this.request(`/admin/residents/${id}/archive`, {
      method: "POST",
    });
  }

  async unarchiveResident(id) {
    return this.request(`/admin/residents/${id}/unarchive`, {
      method: "POST",
    });
  }

  // Vendor management methods
  async getVendors(queryParams = "") {
    return this.request(`/admin/vendors${queryParams}`);
  }

  async getVendorsWithDetails(search = "", filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/vendors-with-details?${params.toString()}`);
  }

  async getVendorRequests(search = "", filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/vendor-requests?${params.toString()}`);
  }

  async getArchivedVendors(search = "", filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/archived-vendors?${params.toString()}`);
  }

  async getVendorById(id) {
    return this.request(`/admin/vendors/${id}`);
  }

  async createVendor(vendorData) {
    return this.request("/admin/vendors", {
      method: "POST",
      body: JSON.stringify(vendorData),
    });
  }

  async updateVendor(id, vendorData) {
    return this.request(`/admin/vendors/${id}`, {
      method: "PUT",
      body: JSON.stringify(vendorData),
    });
  }

  async archiveVendor(id) {
    return this.request(`/admin/vendors/${id}/archive`, {
      method: "POST",
    });
  }

  async unarchiveVendor(id) {
    return this.request(`/admin/vendors/${id}/unarchive`, {
      method: "POST",
    });
  }

  async deleteVendor(id) {
    return this.request(`/admin/vendors/${id}`, {
      method: "DELETE",
    });
  }

  async acceptVendor(id) {
    return this.request(`/admin/vendors/${id}/accept`, {
      method: "POST",
    });
  }

  async rejectVendor(id) {
    return this.request(`/admin/vendors/${id}/reject`, {
      method: "POST",
    });
  }

  // Vehicle management methods
  async getVehicles(queryParams = "") {
    return this.request(`/admin/vehicle-passes${queryParams}`);
  }

  async getVehiclesWithDetails(search = "", filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(
      `/admin/vehicle-passes-with-details?${params.toString()}`
    );
  }

  async getVehicleRequests(search = "", filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/vehicle-pass-requests?${params.toString()}`);
  }

  async getArchivedVehicles(search = "", filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/archived-vehicle-passes?${params.toString()}`);
  }

  async getVehicleById(id) {
    return this.request(`/admin/vehicle-passes/${id}`);
  }

  async createVehicle(vehicleData) {
    return this.request("/admin/vehicle-passes", {
      method: "POST",
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id, vehicleData) {
    return this.request(`/admin/vehicle-passes/${id}`, {
      method: "PUT",
      body: JSON.stringify(vehicleData),
    });
  }

  async archiveVehicle(id) {
    return this.request(`/admin/vehicle-passes/${id}/archive`, {
      method: "POST",
    });
  }

  async unarchiveVehicle(id) {
    return this.request(`/admin/vehicle-passes/${id}/unarchive`, {
      method: "POST",
    });
  }

  async deleteVehicle(id) {
    return this.request(`/admin/vehicle-passes/${id}`, {
      method: "DELETE",
    });
  }

  async acceptVehicle(id) {
    return this.request(`/admin/vehicle-passes/${id}/accept`, {
      method: "POST",
    });
  }

  async rejectVehicle(id) {
    return this.request(`/admin/vehicle-passes/${id}/reject`, {
      method: "POST",
    });
  }

  // New: Get next Vehicle Pass ID
  async getNextVehiclePassId() {
    return this.request(`/admin/vehicle-passes-next-id`);
  }

  // Alert management methods
  async getAlerts(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/alerts?${params.toString()}`);
  }

  async getAlertById(id) {
    return this.request(`/admin/alerts/${id}`);
  }

  async createAlert(alertData) {
    return this.request("/admin/alerts", {
      method: "POST",
      body: JSON.stringify(alertData),
    });
  }

  async updateAlert(id, alertData) {
    return this.request(`/admin/alerts/${id}`, {
      method: "PUT",
      body: JSON.stringify(alertData),
    });
  }

  async updateAlertStatus(id, status) {
    return this.request(`/admin/alerts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async deleteAlert(id) {
    return this.request(`/admin/alerts/${id}`, {
      method: "DELETE",
    });
  }

  async getAlertStats() {
    return this.request("/admin/alerts-stats");
  }

  async getUserAlerts(page = 1, filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/user/alerts?${params.toString()}`);
  }

  //send garbage alert
  async sendGarbageAlert(title, content) {
    return this.request("/sendPush", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
  }

  // Payment management methods
  async getPayments(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/payments?${params.toString()}`);
  }

  async getPaymentById(id) {
    return this.request(`/admin/payments/${id}`);
  }

  async createPayment(paymentData) {
    return this.request("/admin/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  async updatePayment(id, paymentData) {
    return this.request(`/admin/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id) {
    return this.request(`/admin/payments/${id}`, {
      method: "DELETE",
    });
  }

  // Monthly due management methods
  async getMonthlyDues(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/monthly-dues?${params.toString()}`);
  }

  async getMonthlyDueById(id) {
    return this.request(`/admin/monthly-dues/${id}`);
  }

  async createMonthlyDue(monthlyDueData) {
    return this.request("/admin/monthly-dues", {
      method: "POST",
      body: JSON.stringify(monthlyDueData),
    });
  }

  async updateMonthlyDue(id, monthlyDueData) {
    return this.request(`/admin/monthly-dues/${id}`, {
      method: "PUT",
      body: JSON.stringify(monthlyDueData),
    });
  }

  async deleteMonthlyDue(id) {
    return this.request(`/admin/monthly-dues/${id}`, {
      method: "DELETE",
    });
  }

  // Resident monthly due history
  async getResidentMonthlyDueHistory(
    residentId,
    year = new Date().getFullYear(),
    defaultAmount = null
  ) {
    const params = new URLSearchParams();
    params.append("year", year);
    if (defaultAmount !== null && defaultAmount !== undefined) {
      params.append("default_amount", defaultAmount);
    }

    return this.request(
      `/admin/residents/${residentId}/monthly-dues/history?${params.toString()}`
    );
  }

  // Available monthly dues for payment
  async getAvailableMonthlyDuesForPayment(
    residentId,
    year = new Date().getFullYear()
  ) {
    const params = new URLSearchParams();
    params.append("year", year);

    return this.request(
      `/admin/residents/${residentId}/monthly-dues/available?${params.toString()}`
    );
  }

  // Collection methods
  async getCollections(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/collections?${params.toString()}`);
  }

  async getCollectionById(id) {
    return this.request(`/admin/collections/${id}`);
  }

  async createCollection(collectionData) {
    return this.request("/admin/collections", {
      method: "POST",
      body: JSON.stringify(collectionData),
    });
  }

  async updateCollection(id, collectionData) {
    return this.request(`/admin/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(collectionData),
    });
  }

  async deleteCollection(id) {
    return this.request(`/admin/collections/${id}`, {
      method: "DELETE",
    });
  }

  async getCollectionStreets() {
    return this.request("/admin/collections-streets");
  }

  async getCollectionStats() {
    return this.request("/admin/collections-stats");
  }

  async getCollectionYears() {
    return this.request("/admin/collections-years");
  }

  async getCollectionMonths() {
    return this.request("/admin/collections-months");
  }

  async updateCollectionAmount(id, amount) {
    return this.request(`/admin/collections/${id}/amount`, {
      method: "PATCH",
      body: JSON.stringify({ amount_per_resident: amount }),
    });
  }

  // Collection Report methods
  async getCollectionReports(year = null, month = null) {
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (month) params.append("month", month);

    return this.request(`/admin/collection-reports?${params.toString()}`);
  }

  async getCollectionReportById(id) {
    return this.request(`/admin/collection-reports/${id}`);
  }

  async generateCollectionReport(year, month) {
    return this.request("/admin/collection-reports/generate", {
      method: "POST",
      body: JSON.stringify({ year, month }),
    });
  }

  async generateCollectionReportRange(
    startYear,
    startMonth,
    endYear,
    endMonth
  ) {
    return this.request("/admin/collection-reports/generate-range", {
      method: "POST",
      body: JSON.stringify({
        start_year: startYear,
        start_month: startMonth,
        end_year: endYear,
        end_month: endMonth,
      }),
    });
  }

  async getCollectionReportSummary(year = null) {
    const params = new URLSearchParams();
    if (year) params.append("year", year);

    return this.request(
      `/admin/collection-reports/summary?${params.toString()}`
    );
  }

  async getCollectionReportYears() {
    return this.request("/admin/collection-reports/years");
  }

  // Complaint management methods
  async getComplaints(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/complaints?${params.toString()}`);
  }

  async getComplaintsFiltered(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/complaints-filtered?${params.toString()}`);
  }

  async getComplaintById(id) {
    return this.request(`/admin/complaints/${id}`);
  }

  async createComplaint(complaintData) {
    return this.request("/admin/complaints", {
      method: "POST",
      body: JSON.stringify(complaintData),
    });
  }

  async updateComplaint(id, complaintData) {
    return this.request(`/admin/complaints/${id}`, {
      method: "PUT",
      body: JSON.stringify(complaintData),
    });
  }

  async updateComplaintStatus(id, status) {
    return this.request(`/admin/complaints/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async updateComplaintRemarks(id, remarks) {
    return this.request(`/admin/complaints/${id}/remarks`, {
      method: "PATCH",
      body: JSON.stringify({ remarks }),
    });
  }

  async updateComplaintFollowups(id, followups) {
    return this.request(`/admin/complaints/${id}/followups`, {
      method: "PATCH",
      body: JSON.stringify({ followups }),
    });
  }

  async updateComplaintPriority(id, priority) {
    return this.request(`/admin/complaints/${id}/priority`, {
      method: "PATCH",
      body: JSON.stringify({ priority }),
    });
  }

  async deleteComplaint(id) {
    return this.request(`/admin/complaints/${id}`, {
      method: "DELETE",
    });
  }

  async getComplaintStats() {
    return this.request("/admin/complaints-stats");
  }

  // User complaint methods
  async getUserComplaints(page = 1, filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/user/complaints?${params.toString()}`);
  }

  async createUserComplaint(complaintData) {
    return this.request("/user/complaints", {
      method: "POST",
      body: JSON.stringify(complaintData),
    });
  }

  async updateUserComplaintStatus(id, status) {
    return this.request(`/user/complaints/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async updateUserComplaintRemarks(id, remarks) {
    return this.request(`/user/complaints/${id}/remarks`, {
      method: "PATCH",
      body: JSON.stringify({ remarks }),
    });
  }

  async updateUserComplaintFollowups(id, followups) {
    return this.request(`/user/complaints/${id}/followups`, {
      method: "PATCH",
      body: JSON.stringify({ followups }),
    });
  }

  async updateUserComplaintPriority(id, priority) {
    return this.request(`/user/complaints/${id}/priority`, {
      method: "PATCH",
      body: JSON.stringify({ priority }),
    });
  }

  // CCTV Request methods
  async getCCTVRequestsFiltered(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });
    return this.request(`/admin/cctv-requests?${params.toString()}`);
  }

  async getCCTVRequestById(id) {
    return this.request(`/admin/cctv-requests/${id}`);
  }

  async updateCCTVStatus(id, status) {
    return this.request(`/admin/cctv-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async updateCCTVFollowups(id, followups) {
    return this.request(`/admin/cctv-requests/${id}/followups`, {
      method: "PATCH",
      body: JSON.stringify({ followups }),
    });
  }

  async updateCCTVFootage(id, footageData) {
    const formData = new FormData();
    formData.append("footage", footageData.file);
    if (footageData.description) {
      formData.append("description", footageData.description);
    }

    const token = localStorage.getItem("token");
    const url = `${this.baseURL}/api/admin/cctv-requests/${id}/footage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed with status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("CCTV footage upload failed:", error);
      throw error;
    }
  }

  async deleteCCTVFootage(cctvId, footageId) {
    return this.request(`/admin/cctv-requests/${cctvId}/footage/${footageId}`, {
      method: "DELETE",
    });
  }

  // Community Post methods
  async getCommunityPosts(page = 1, search = "", filters = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    return this.request(`/admin/community-posts?${params.toString()}`);
  }

  async getCommunityPostById(id) {
    return this.request(`/admin/community-posts/${id}`);
  }

  async createCommunityPost(postData) {
    const formData = new FormData();

    // Add text fields
    formData.append("type", postData.type || "text");
    formData.append("category", postData.category || "general");
    formData.append("content", postData.content || "");
    formData.append("visibility", postData.visibility || "public");

    // Add images if any
    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((image, index) => {
        formData.append("images[]", image);
      });
    }

    const token = localStorage.getItem("token");
    const url = `${this.baseURL}/api/admin/community-posts`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Validation errors:", errorData.errors); // Debug log
        throw new Error(
          errorData.message ||
            `Post creation failed with status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Community post creation failed:", error);
      throw error;
    }
  }

  async updateCommunityPost(id, postData) {
    const formData = new FormData();

    // Add _method field to simulate PUT request
    formData.append("_method", "PUT");

    // Always add all fields, even if they're null/empty
    formData.append("type", postData.type || "text");
    formData.append("category", postData.category || "general");
    formData.append("content", postData.content || "");
    formData.append("visibility", postData.visibility || "public");

    // Add existing images that should be kept
    if (postData.existingImages && postData.existingImages.length > 0) {
      postData.existingImages.forEach((image, index) => {
        formData.append("existing_images[]", image);
      });
    }

    // Add new images if any
    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((image, index) => {
        formData.append("images[]", image);
      });
    }

    // Debug logging
    console.log("Frontend sending update data:", {
      type: postData.type || "text",
      category: postData.category || "general",
      content: postData.content || "",
      visibility: postData.visibility || "public",
      existingImages: postData.existingImages || [],
      newImages: postData.images || [],
    });

    // Debug FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const token = localStorage.getItem("token");
    const url = `${this.baseURL}/api/admin/community-posts/${id}`;

    try {
      const response = await fetch(url, {
        method: "POST", // Changed from PUT to POST
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Post update failed with status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Community post update failed:", error);
      throw error;
    }
  }

  async deleteCommunityPost(id) {
    return this.request(`/admin/community-posts/${id}`, {
      method: "DELETE",
    });
  }

  async likeCommunityPost(id, reaction = "like") {
    return this.request(`/admin/community-posts/${id}/like`, {
      method: "POST",
      body: JSON.stringify({ reaction }),
    });
  }

  async addCommentToPost(postId, commentData) {
    return this.request(`/admin/community-posts/${postId}/comment`, {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  }

  async getComments(postId) {
    return this.request(`/admin/community-posts/${postId}/comments`);
  }

  async deleteComment(postId, commentId) {
    return this.request(
      `/admin/community-posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );
  }

  // Reports methods
  async generateCCTVRequestPDF(filters) {
    const url = `${this.baseURL}/api/admin/reports/cctv-request/pdf`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `PDF generation failed with status: ${response.status}`
        );
      }

      return {
        success: true,
        data: await response.blob(),
      };
    } catch (error) {
      console.error("CCTV Request PDF generation failed:", error);
      throw error;
    }
  }

  async generateComplaintRequestPDF(filters) {
    const url = `${this.baseURL}/api/admin/reports/complaint-request/pdf`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `PDF generation failed with status: ${response.status}`
        );
      }

      return {
        success: true,
        data: await response.blob(),
      };
    } catch (error) {
      console.error("Complaint Request PDF generation failed:", error);
      throw error;
    }
  }

  async generateMonthlyCollectionPDF(year, street = null) {
    const url = `${this.baseURL}/api/admin/reports/monthly-collection/pdf`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ year, street }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `PDF generation failed with status: ${response.status}`
        );
      }

      return {
        success: true,
        data: await response.blob(),
      };
    } catch (error) {
      console.error("Monthly Collection PDF generation failed:", error);
      throw error;
    }
  }

  async generateAlertReportsPDF(filters) {
    const url = `${this.baseURL}/api/admin/reports/alert-reports/pdf`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `PDF generation failed with status: ${response.status}`
        );
      }

      return {
        success: true,
        data: await response.blob(),
      };
    } catch (error) {
      console.error("Alert Reports PDF generation failed:", error);
      throw error;
    }
  }

  async generatePaymentDetailsPDF(residentId, year) {
    const url = `${this.baseURL}/api/admin/reports/payment-details/pdf`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ residentId, year }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `PDF generation failed with status: ${response.status}`
        );
      }

      return {
        success: true,
        data: await response.blob(),
      };
    } catch (error) {
      console.error("Payment Details PDF generation failed:", error);
      throw error;
    }
  }

  async getStreets() {
    return this.request("/admin/reports/streets");
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
