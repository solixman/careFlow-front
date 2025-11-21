import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext"; // Adjust path if needed
import "@/components/css/dashboard.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Appointment {
  _id: string;
  patient: string;
  doctor: string;
  patientName?: string;
  date: string;
  hour: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isUrgent: boolean;
}

interface ApiResponse {
  appointments: Appointment[];
  message: string;
  total: number;
  limit: number;
  skip: number;
}

interface Filters {
  doctorId: string;
  status: string;
  isUrgent: string;
  date: string;
  PatientName: string;
}

const Appointments: React.FC = () => {
  const auth = useContext(AuthContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<Filters>({
    doctorId: "",
    status: "",
    isUrgent: "",
    date: "",
    PatientName: "",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [fetchedUsers, setFetchedUsers] = useState<Record<string, User>>({});
  const [fetchingUsers, setFetchingUsers] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    notes: "",
    doctor: "",
    isUrgent: false,
  });
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState({
    date: "",
    doctorId: "",
    purpose: "",
    note: "",
    isUrgent: false,
    name: "", // For cases without patientId
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const limit = 10;

  const buildQueryString = (currentSkip: number, currentFilters: Filters) => {
    const params = new URLSearchParams();
    params.append("skip", currentSkip.toString());
    params.append("limit", limit.toString());
    if (currentFilters.doctorId) params.append("doctorId", currentFilters.doctorId);
    if (currentFilters.status) params.append("status", currentFilters.status);
    if (currentFilters.isUrgent) params.append("isUrgent", currentFilters.isUrgent);
    if (currentFilters.date) params.append("date", currentFilters.date);
    if (currentFilters.PatientName) params.append("PatientName", currentFilters.PatientName);
    return params.toString();
  };

  const fetchAppointments = async (currentSkip: number, currentFilters: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const queryString = buildQueryString(currentSkip, currentFilters);
      const response = await fetch(`http://localhost:3333/appoitment?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setAppointments(data.appointments);
      setTotal(data.total);
      setSkip(currentSkip);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (role?: string, name?: string) => {
    setFetchingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (role) params.append("role", role);
      if (name) params.append("name", name);
      const response = await fetch(`http://localhost:3333/user/all?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      const users: User[] = data.users || [];
      if (role === "doctor") {
        setDoctors(users);
      } else if (role === "patient") {
        setPatients(users);
      } else {
        setDoctors(users.filter(u => u.role === "doctor"));
        setPatients(users.filter(u => u.role === "patient"));
      }
    } catch (err) {
      alert("Error fetching users: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchUser = async (userId: string) => {
    if (fetchedUsers[userId]) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/user/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const user: User = await response.json();
      setFetchedUsers((prev) => ({ ...prev, [userId]: user }));
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchAppointments(0, filters);
  }, [filters]);

  useEffect(() => {
    // Fetch doctors and patients for dropdowns based on role
    if (auth?.user?.role === "admin") {
      fetchUsers(); // Fetch all, then filter
    } else if (auth?.user?.role === "patient") {
      fetchUsers("doctor"); // Only doctors for patients
    }
    // Fetch patient names for display
    appointments.forEach((appt) => {
      if (!appt.patientName) {
        fetchUser(appt.patient);
      }
    });
  }, [auth?.user?.role, appointments]);

  useEffect(() => {
    // Fetch users when create modal opens if not already fetched
    if (createModalOpen && auth?.user?.role === "admin" && (doctors.length === 0 || patients.length === 0)) {
      fetchUsers();
    } else if (createModalOpen && auth?.user?.role === "patient" && doctors.length === 0) {
      fetchUsers("doctor");
    }
  }, [createModalOpen, auth?.user?.role, doctors.length, patients.length]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "true" : "") : value,
    }));
  };

  const handleApplyFilters = () => {
    setSkip(0);
    fetchAppointments(0, filters);
  };

  const handleClearFilters = () => {
    setFilters({
      doctorId: "",
      status: "",
      isUrgent: "",
      date: "",
      PatientName: "",
    });
    setSkip(0);
    fetchAppointments(0, {
      doctorId: "",
      status: "",
      isUrgent: "",
      date: "",
      PatientName: "",
    });
  };

  const handlePrevious = () => {
    if (skip > 0) {
      fetchAppointments(skip - limit, filters);
    }
  };

  const handleNext = () => {
    if (skip + limit < total) {
      fetchAppointments(skip + limit, filters);
    }
  };

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/appoitment/status/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      alert("Appointment cancelled successfully!");
      fetchAppointments(skip, filters);
    } catch (err) {
      alert("Error cancelling appointment: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleModify = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditForm({
      date: appointment.date.split("T")[0],
      notes: appointment.notes,
      doctor: appointment.doctor,
      isUrgent: appointment.isUrgent,
    });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingAppointment) return;
    setActionLoading(editingAppointment._id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/appoitment/update/${editingAppointment._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      alert("Appointment updated successfully!");
      setModalOpen(false);
      fetchAppointments(skip, filters);
    } catch (err) {
      alert("Error updating appointment: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async () => {
    if (!createForm.date || !createForm.doctorId || !createForm.purpose) {
      alert("Please fill in all required fields: date, doctor ID, and purpose.");
      return;
    }
    if (auth?.user?.role !== "patient" && !createForm.name) {
      alert("Name is required for non-patients.");
      return;
    }

    setActionLoading("create");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        patientId: auth?.user?.role === "patient" ? auth.user._id : undefined,
        name: createForm.name || undefined,
        date: createForm.date,
        doctorId: createForm.doctorId,
        purpose: createForm.purpose,
        note: createForm.note,
        isUrgent: createForm.isUrgent,
      };
      const response = await fetch(`http://localhost:3333/appoitment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      alert("Appointment created successfully!");
      setCreateModalOpen(false);
      setCreateForm({ date: "", doctorId: "", purpose: "", note: "", isUrgent: false, name: "" });
      fetchAppointments(skip, filters);
    } catch (err) {
      alert("Error creating appointment: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "yellow";
      case "confirmed": return "green";
      case "unconfirmed": return "orange";
      case "in-progress": return "blue";
      case "completed": return "darkgreen";
      case "cancelled": return "red";
      default: return "black";
    }
  };

  const renderPatient = (patientId: string) => {
    const user = fetchedUsers[patientId];
    return user ? `${user.name} (${user.email})` : "Loading...";
  };

  const renderDoctor = (doctorId: string) => {
    const user = fetchedUsers[doctorId];
    return user ? `${user.name} (${user.email})` : "Loading...";
  };

  if (loading) {
    return (
      <div className="appointments-container">
        <h3>Loading Appointments...</h3>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ border: "4px solid #f3f3f3", borderTop: "4px solid oklch(0.6 0.118 184.704)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointments-container">
        <h3>Error</h3>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => fetchAppointments(skip, filters)} style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="appointments-container">
      <h3>Appointments</h3>
      
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setCreateModalOpen(true)} style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px" }}>
          Create Appointment
        </button>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", marginBottom: "10px" }}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        {showFilters && (
          <div style={{ padding: "16px", background: "#f9f9f9", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                           <select
                name="doctorId"
                value={filters.doctorId}
                onChange={handleFilterChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: "1 1 150px" }}
              >
                <option value="">All Doctors</option>
                {doctors.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: "1 1 150px" }}
              >
                <option value="">All Statuses</option>
                <option value="waiting">Waiting</option>
                <option value="confirmed">Confirmed</option>
                <option value="unconfirmed">Unconfirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={filters.isUrgent === "true"}
                  onChange={handleFilterChange}
                />
                Urgent Only
              </label>
              <input
                type="datetime-local"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: "1 1 150px" }}
              />
              <input
                type="text"
                name="PatientName"
                placeholder="Patient Name"
                value={filters.PatientName}
                onChange={handleFilterChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: "1 1 150px" }}
              />
              <button onClick={handleApplyFilters} style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px" }}>
                Apply Filters
              </button>
              <button onClick={handleClearFilters} style={{ padding: "8px 16px", background: "#ccc", color: "black", border: "none", borderRadius: "4px" }}>
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr style={{ background: "#f5f8fa", borderBottom: "2px solid #e0e0e0" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Patient</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Doctor</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Date</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Hour</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Notes</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Urgent</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} style={{ borderBottom: "1px solid #e0e0e0", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "12px" }}>{renderPatient(appt.patient)}</td>
                  <td style={{ padding: "12px" }}>{renderDoctor(appt.doctor)}</td>
                  <td style={{ padding: "12px" }}>{new Date(appt.date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px" }}>{appt.hour}</td>
                  <td style={{ padding: "12px", fontWeight: appt.status === "cancelled" ? "bold" : "normal", color: getStatusColor(appt.status) }}>{appt.status}</td>
                  <td style={{ padding: "12px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.notes}</td>
                  <td style={{ padding: "12px" }}>{appt.isUrgent ? "Yes" : "No"}</td>
                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() => handleModify(appt)}
                      disabled={actionLoading === appt._id}
                      style={{ padding: "6px 12px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", marginRight: "8px", cursor: actionLoading === appt._id ? "not-allowed" : "pointer" }}
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleCancel(appt._id)}
                      disabled={actionLoading === appt._id || appt.status === "cancelled"}
                      style={{ padding: "6px 12px", background: appt.status === "cancelled" ? "#ccc" : "oklch(0.398 0.07 227.392)", color: "white", border: "none", borderRadius: "4px", cursor: actionLoading === appt._id || appt.status === "cancelled" ? "not-allowed" : "pointer" }}
                    >
                      {actionLoading === appt._id ? "Loading..." : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={handlePrevious} disabled={skip === 0} style={{ padding: "8px 16px", background: skip === 0 ? "#ccc" : "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", cursor: skip === 0 ? "not-allowed" : "pointer" }}>
              Previous
            </button>
            <span>Page {Math.floor(skip / limit) + 1} of {Math.ceil(total / limit)}</span>
            <button onClick={handleNext} disabled={skip + limit >= total} style={{ padding: "8px 16px", background: skip + limit >= total ? "#ccc" : "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", cursor: skip + limit >= total ? "not-allowed" : "pointer" }}>
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal for Editing */}
      {modalOpen && editingAppointment && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px", maxWidth: "90%" }}>
            <h4>Edit Appointment</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="datetime-local"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <textarea
                placeholder="Notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }}
              />
              <select
                value={editForm.doctor}
                onChange={(e) => setEditForm({ ...editForm, doctor: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              >
                <option value="">Select Doctor</option>
                {doctors.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <input
                  type="checkbox"
                  checked={editForm.isUrgent}
                  onChange={(e) => setEditForm({ ...editForm, isUrgent: e.target.checked })}
                />
                Urgent
              </label>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{ padding: "8px 16px", background: "#ccc", color: "black", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={actionLoading === editingAppointment._id}
                  style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", cursor: actionLoading === editingAppointment._id ? "not-allowed" : "pointer" }}
                >
                  {actionLoading === editingAppointment._id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating */}
      {createModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px", maxWidth: "90%" }}>
            <h4>Create Appointment</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="datetime-local"
                value={createForm.date}
                onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <select
                value={createForm.doctorId}
                onChange={(e) => setCreateForm({ ...createForm, doctorId: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              >
                <option value="">Select Doctor</option>
                {doctors.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Purpose"
                value={createForm.purpose}
                onChange={(e) => setCreateForm({ ...createForm, purpose: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <textarea
                placeholder="Note"
                value={createForm.note}
                onChange={(e) => setCreateForm({ ...createForm, note: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <input
                  type="checkbox"
                  checked={createForm.isUrgent}
                  onChange={(e) => setCreateForm({ ...createForm, isUrgent: e.target.checked })}
                />
                Urgent
              </label>
              {auth?.user?.role !== "patient" && (
                <input
                  type="text"
                  placeholder="Name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
              )}
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  style={{ padding: "8px 16px", background: "#ccc", color: "black", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={actionLoading === "create"}
                  style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", cursor: actionLoading === "create" ? "not-allowed" : "pointer" }}
                >
                  {actionLoading === "create" ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
