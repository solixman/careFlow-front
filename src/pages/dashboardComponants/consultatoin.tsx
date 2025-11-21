import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/components/context/AuthContext"; // Adjust path if needed
import "@/components/css/dashboard.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Consultation {
  _id: string;
  appointment: string;
  doctor: User | string; // Can be object or ID
  patient: User | string; // Can be object or ID
  note?: string;
  diagnosis?: string;
  procedures?: string;
  files: string[];
  createdAt: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
    height?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
}

interface ApiResponse {
  consultations: Consultation[];
  message: string;
  total: number;
  limit: number;
  skip: number;
}

interface Filters {
  doctorId: string;
  patientId: string;
  date: string;
  diagnosis: string;
  appointmentId: string;
}

const Consultations: React.FC = () => {
  const auth = useContext(AuthContext);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<Filters>({
    doctorId: "",
    patientId: "",
    date: "",
    diagnosis: "",
    appointmentId: "",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [fetchedPatients, setFetchedPatients] = useState<Record<string, User>>({}); // Cache for fetched patients
  const [fetchingUsers, setFetchingUsers] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [createForm, setCreateForm] = useState({
    patientId: "",
    note: "",
    diagnosis: "",
    procedures: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    respiratoryRate: "",
    oxygenSaturation: "",
  });
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [uploadingConsultationId, setUploadingConsultationId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const limit = 10;

  const buildQueryString = (currentSkip: number, currentFilters: Filters) => {
    const params = new URLSearchParams();
    params.append("skip", currentSkip.toString());
    params.append("limit", limit.toString());
    if (currentFilters.doctorId) params.append("doctorId", currentFilters.doctorId);
    if (currentFilters.patientId) params.append("patientId", currentFilters.patientId);
    if (currentFilters.date) params.append("date", currentFilters.date);
    if (currentFilters.diagnosis) params.append("diagnosis", currentFilters.diagnosis);
    if (currentFilters.appointmentId) params.append("appointmentId", currentFilters.appointmentId);
    return params.toString();
  };

  const fetchConsultations = async (currentSkip: number, currentFilters: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const queryString = buildQueryString(currentSkip, currentFilters);
      const response = await fetch(`http://localhost:3333/consultation?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch consultations: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setConsultations(data.consultations);
      setTotal(data.total);
      setSkip(currentSkip);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/users`, { // Assuming /users endpoint
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
      setUsers(data.users || []);
    } catch (err) {
      alert("Error fetching users: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchPatient = async (patientId: string) => {
    if (fetchedPatients[patientId]) return; // Already fetched
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/profile/${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patient");
      }

      const patient: User = await response.json();
      setFetchedPatients((prev) => ({ ...prev, [patientId]: patient }));
    } catch (err) {
      console.error("Error fetching patient:", err);
    }
  };

  useEffect(() => {
    fetchConsultations(0, filters);
  }, [filters]);

  // Fetch patients for non-patient users if patient is an ID
  useEffect(() => {
    if (auth?.user?.role !== "patient") {
      consultations.forEach((cons) => {
        if (typeof cons.patient === "string") {
          fetchPatient(cons.patient);
        }
      });
    }
  }, [consultations, auth?.user?.role]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    setSkip(0);
    fetchConsultations(0, filters);
  };

  const handleClearFilters = () => {
    setFilters({
      doctorId: "",
      patientId: "",
      date: "",
      diagnosis: "",
      appointmentId: "",
    });
    setSkip(0);
    fetchConsultations(0, {
      doctorId: "",
      patientId: "",
      date: "",
      diagnosis: "",
      appointmentId: "",
    });
  };

  const handlePrevious = () => {
    if (skip > 0) {
      fetchConsultations(skip - limit, filters);
    }
  };

  const handleNext = () => {
    if (skip + limit < total) {
      fetchConsultations(skip + limit, filters);
    }
  };

  const handleCreate = async () => {
    // Basic validation
    if (!createForm.patientId) {
      alert("Patient ID is required.");
      return;
    }

    setActionLoading("create");
    try {
      const token = localStorage.getItem("token");
      const appointmentId = editingConsultation ? editingConsultation.appointment : "new"; // Adjust as needed
      const response = await fetch(`http://localhost:3333/consultation/${appointmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) {
        throw new Error("Failed to create consultation");
      }

      alert("Consultation created successfully!");
      setModalOpen(false);
      setCreateForm({
        patientId: "",
        note: "",
        diagnosis: "",
        procedures: "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        weight: "",
        height: "",
        respiratoryRate: "",
        oxygenSaturation: "",
      });
      fetchConsultations(skip, filters);
    } catch (err) {
      alert("Error creating consultation: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setCreateForm({
      patientId: typeof consultation.patient === "string" ? consultation.patient : consultation.patient._id || "",
      note: consultation.note || "",
      diagnosis: consultation.diagnosis || "",
      procedures: consultation.procedures || "",
      bloodPressure: consultation.vitals?.bloodPressure || "",
      heartRate: consultation.vitals?.heartRate || "",
      temperature: consultation.vitals?.temperature || "",
      weight: consultation.vitals?.weight || "",
      height: consultation.vitals?.height || "",
      respiratoryRate: consultation.vitals?.respiratoryRate || "",
      oxygenSaturation: consultation.vitals?.oxygenSaturation || "",
    });
    setModalOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadingConsultationId) return;

    setActionLoading("upload");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`http://localhost:3333/consultation/${uploadingConsultationId}/attach-file`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      alert("File uploaded successfully!");
      setUploadModalOpen(false);
      setSelectedFile(null);
      fetchConsultations(skip, filters);
    } catch (err) {
      alert("Error uploading file: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (key: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3333/consultation/download/${key}`, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = key.split("-").slice(2).join("-"); // Extract filename from key
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Error downloading file: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const renderPatient = (patient: { name: string; email: string } | string) => {
    if (typeof patient === "object") {
      return `${patient.name} (${patient.email})`;
    } else if (auth?.user?.role !== "patient") {
      const fetched = fetchedPatients[patient];
      return fetched ? `${fetched.name} (${fetched.email})` : "Loading...";
    }
    return "N/A"; // For patients, don't show others
  };

  if (loading) {
    return (
      <div className="consultations-container">
        <h3>Loading Consultations...</h3>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ border: "4px solid #f3f3f3", borderTop: "4px solid oklch(0.6 0.118 184.704)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consultations-container">
        <h3>Error</h3>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => fetchConsultations(skip, filters)} style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="consultations-container">
      <h3>Consultations</h3>
      
      {/* Create Button (Admin Only) */}
      {auth?.user?.role === "admin" && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => { setEditingConsultation(null); setModalOpen(true); }} style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px" }}>
            Create Consultation
          </button>
        </div>
      )}
      
      {/* Filter Section */}
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
                {users.filter(u => u.role === "doctor").map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <select
                name="patientId"
                value={filters.patientId}
                onChange={handleFilterChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: "1 1 150px" }}
              >
                <option value="">All Patients</option>
                {users.filter(u => u.role === "patient").map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <input
                type="datetime-local"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: "1 1 150px" }}
              />
              <input
                type="text"
                name="diagnosis"
                placeholder="Diagnosis"
                value={filters.diagnosis}
                onChange={handleFilterChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: "1 1 150px" }}
              />
              <input
                type="text"
                name="appointmentId"
                placeholder="Appointment ID"
                value={filters.appointmentId}
                onChange={handleFilterChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", flex: "1 1 150px" }}
              />
              <button onClick={fetchUsers} disabled={fetchingUsers} style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px" }}>
                {fetchingUsers ? "Fetching..." : "Fetch Users"}
              </button>
              <button onClick={handleApplyFilters} style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px" }}>
                Apply filters
                </button>
                              <button onClick={handleClearFilters} style={{ padding: "8px 16px", background: "#ccc", color: "black", border: "none", borderRadius: "4px" }}>
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {consultations.length === 0 ? (
        <p>No consultations found.</p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr style={{ background: "#f5f8fa", borderBottom: "2px solid #e0e0e0" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Doctor</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Patient</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Diagnosis</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Note</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Procedures</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Vitals</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Files</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "oklch(0.6 0.118 184.704)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((cons) => (
                <tr key={cons._id} style={{ borderBottom: "1px solid #e0e0e0", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "12px" }}>{typeof cons.doctor === "object" ? `${cons.doctor.name} (${cons.doctor.email})` : "N/A"}</td>
                  <td style={{ padding: "12px" }}>{renderPatient(cons.patient)}</td>
                  <td style={{ padding: "12px" }}>{cons.diagnosis || "N/A"}</td>
                  <td style={{ padding: "12px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>{cons.note || "N/A"}</td>
                  <td style={{ padding: "12px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>{cons.procedures || "N/A"}</td>
                  <td style={{ padding: "12px" }}>
                    {cons.vitals ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {cons.vitals.bloodPressure && <li>Blood Pressure: {cons.vitals.bloodPressure}</li>}
                        {cons.vitals.heartRate && <li>Heart Rate: {cons.vitals.heartRate}</li>}
                        {cons.vitals.temperature && <li>Temperature: {cons.vitals.temperature}</li>}
                        {cons.vitals.weight && <li>Weight: {cons.vitals.weight}</li>}
                        {cons.vitals.height && <li>Height: {cons.vitals.height}</li>}
                        {cons.vitals.respiratoryRate && <li>Respiratory Rate: {cons.vitals.respiratoryRate}</li>}
                        {cons.vitals.oxygenSaturation && <li>Oxygen Saturation: {cons.vitals.oxygenSaturation}</li>}
                      </ul>
                    ) : "N/A"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {cons.files.length > 0 ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {cons.files.map((file, index) => (
                          <li key={index}>
                            <button onClick={() => handleDownload(file)} style={{ padding: "4px 8px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                              Download {file.split("-").slice(2).join("-")}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : "No files"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {auth?.user?.role === "admin" && (
                      <button
                        onClick={() => handleEdit(cons)}
                        disabled={actionLoading === cons._id}
                        style={{ padding: "6px 12px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", marginRight: "8px", cursor: actionLoading === cons._id ? "not-allowed" : "pointer" }}
                      >
                        Edit
                      </button>
                    )}
                    {auth?.user?.role !== "patient" && (
                      <button
                        onClick={() => { setUploadingConsultationId(cons._id); setUploadModalOpen(true); }}
                        disabled={actionLoading === cons._id}
                        style={{ padding: "6px 12px", background: "oklch(0.398 0.07 227.392)", color: "white", border: "none", borderRadius: "4px", cursor: actionLoading === cons._id ? "not-allowed" : "pointer" }}
                      >
                        Upload File
                      </button>
                    )}
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

      {/* Modal for Creating/Editing */}
      {modalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "500px", maxWidth: "90%" }}>
            <h4>{editingConsultation ? "Edit Consultation" : "Create Consultation"}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <select
                value={createForm.patientId}
                onChange={(e) => setCreateForm({ ...createForm, patientId: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              >
                <option value="">Select Patient</option>
                {users.filter(u => u.role === "patient").map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <textarea
                placeholder="Note"
                value={createForm.note}
                onChange={(e) => setCreateForm({ ...createForm, note: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }}
              />
              <input
                type="text"
                placeholder="Diagnosis"
                value={createForm.diagnosis}
                onChange={(e) => setCreateForm({ ...createForm, diagnosis: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <textarea
                placeholder="Procedures"
                value={createForm.procedures}
                onChange={(e) => setCreateForm({ ...createForm, procedures: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }}
              />
              <input
                type="text"
                placeholder="Blood Pressure"
                value={createForm.bloodPressure}
                onChange={(e) => setCreateForm({ ...createForm, bloodPressure: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Heart Rate"
                value={createForm.heartRate}
                onChange={(e) => setCreateForm({ ...createForm, heartRate: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Temperature"
                value={createForm.temperature}
                onChange={(e) => setCreateForm({ ...createForm, temperature: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Weight"
                value={createForm.weight}
                onChange={(e) => setCreateForm({ ...createForm, weight: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Height"
                value={createForm.height}
                onChange={(e) => setCreateForm({ ...createForm, height: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Respiratory Rate"
                value={createForm.respiratoryRate}
                onChange={(e) => setCreateForm({ ...createForm, respiratoryRate: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <input
                type="text"
                placeholder="Oxygen Saturation"
                value={createForm.oxygenSaturation}
                onChange={(e) => setCreateForm({ ...createForm, oxygenSaturation: e.target.value })}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{ padding: "8px 16px", background: "#ccc", color: "black", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={actionLoading === "create"}
                  style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", cursor: actionLoading === "create" ? "not-allowed" : "pointer" }}
                >
                  {actionLoading === "create" ? "Saving..." : editingConsultation ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Uploading File */}
      {uploadModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px", maxWidth: "90%" }}>
            <h4>Upload File</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  style={{ padding: "8px 16px", background: "#ccc", color: "black", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={actionLoading === "upload" || !selectedFile}
                  style={{ padding: "8px 16px", background: "oklch(0.6 0.118 184.704)", color: "white", border: "none", borderRadius: "4px", cursor: actionLoading === "upload" || !selectedFile ? "not-allowed" : "pointer" }}
                >
                  {actionLoading === "upload" ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;
