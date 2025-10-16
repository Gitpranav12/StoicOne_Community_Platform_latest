import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Toast, ToastContainer, Modal, Card } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function SettingsTab() {
  const { user, updateProfile, updateAccount, deleteAccount, loading, updateProfilePhoto } =
    useContext(UserContext);

  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [accountData, setAccountData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });

  const isProfileChanged = JSON.stringify(profileData) !== JSON.stringify(user?.profile || {});

  // Load/save profile photo name
  useEffect(() => {
    if (!user?.id) return;
    const storedName = localStorage.getItem(`profilePhotoName_${user.id}`);
    if (storedName) setFileName(storedName);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`profilePhotoName_${user.id}`, fileName);
    }
  }, [fileName, user?.id]);

  // Sync with context user
  useEffect(() => {
    if (user) {
      setProfileData(user.profile || {});
      setAccountData(user.account || {});
    }
  }, [user]);

  const departmentOptions = user?.departmentOptions || {};

  // Regex
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // -------- Handlers --------
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      showToast("Only JPG and JPEG files are allowed!", "danger");
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      showToast("File size must be less than 2MB!", "danger");
      e.target.value = "";
      return;
    }

    const previousFileName = fileName;
    setFileName(file.name);

    try {
      await updateProfilePhoto(file, user.id);
      showToast("Profile photo updated successfully!");

      if (user) {
        const updatedUser = { ...user, photoUpdatedAt: Date.now() };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage")); // notify listeners
      }
    } catch (err) {
      showToast("Failed to update profile photo", "danger");
      setFileName(previousFileName);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!nameRegex.test(profileData.name || "")) {
      showToast("Name must contain only letters!", "danger");
      return;
    }
    try {
      await updateProfile(profileData);
      showToast("Profile updated successfully!");
    } catch {
      showToast("Failed to update profile!", "danger");
    }
  };

  const handleSaveAccount = async () => {
    if (!emailRegex.test(accountData.email || "")) {
      showToast("Please enter a valid email address!", "danger");
      return;
    }
    if (accountData.newPassword && !passwordRegex.test(accountData.newPassword)) {
      showToast(
        "Password must be at least 8 chars, include uppercase, lowercase, number & special char!",
        "danger"
      );
      return;
    }
    if (accountData.newPassword !== accountData.confirmPassword) {
      showToast("New password and confirmation do not match!", "danger");
      return;
    }

    try {
      const data = await updateAccount({
        currentPassword: accountData.currentPassword,
        newPassword: accountData.newPassword,
      });

      showToast(data.message || "Account updated successfully!");
      setAccountData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      showToast(err.message || "Failed to update account!", "danger");
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData(user.profile || {});
      setAccountData(user.account || {});
    }
    showToast("Changes discarded", "secondary");
  };

  const handleDelete = async () => {
    try {
      const data = await deleteAccount();
      showToast(data.message, "danger");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      showToast(err.message || "Failed to delete profile!", "danger");
    }
  };

  const showToast = (message, bg = "success") => {
    setToast({ show: true, message, bg });
    setTimeout(() => setToast({ show: false, message: "", bg: "success" }), 3000);
  };

  // -------- Render --------
  if (loading) return <p>Loading settings...</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="p-3">
      {/* Toast */}
      <ToastContainer className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={toast.show}
          bg={toast.bg}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* -------- Profile Settings -------- */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="mb-3 heading-text">Profile Settings</h5>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="sub-heading-text d-block mb-2">Profile Photo</Form.Label>
              <div className="d-flex align-items-center gap-3">

                {/* Hidden file input */}
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                  id="profilePhotoInput"
                />

                {/* Upload/Change Button */}
                <div>
                  <Button
                    variant={"outline-primary"}
                    onClick={() => document.getElementById("profilePhotoInput").click()}
                    className="mb-1"
                  >
                    {fileName ? "Change Photo" : "Upload Photo"}
                  </Button>
                  <div>
                    {/* Show selected file name */}
                    {fileName && (
                      <small className="text-success">
                        <i class="bi bi-check-square-fill"></i> {fileName} uploaded
                      </small>
                    )}
                  </div>

                </div>
              </div>

              <Form.Text className="text-muted">
                Only JPG/JPEG files allowed. Max size 2MB.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="sub-heading-text">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profileData.name || ""}
                onChange={handleProfileChange}
                placeholder="Enter your name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="sub-heading-text">Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={profileData.bio || ""}
                onChange={handleProfileChange}
                placeholder="Write something about yourself..."
              />
            </Form.Group>

            {/* Department Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label className="sub-heading-text">Department</Form.Label>
              <Form.Select
                name="department"
                value={profileData.department || ""}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    department: e.target.value,
                    designation: "",
                  }))
                }
              >
                <option value="" disabled>
                  Select Department
                </option>
                {Object.keys(departmentOptions).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Designation Dropdown */}
            {profileData.department && (
              <Form.Group className="mb-3">
                <Form.Label className="sub-heading-text">Designation</Form.Label>
                <Form.Select
                  name="designation"
                  value={profileData.designation || ""}
                  onChange={handleProfileChange}
                >
                  <option value="" disabled>
                    Select Designation
                  </option>
                  {(departmentOptions[profileData.department] || []).map((des) => (
                    <option key={des} value={des}>
                      {des}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
              <div className="d-flex gap-2">
                <Button variant="primary" onClick={handleSaveProfile} disabled={!isProfileChanged}>
                  Save Changes
                </Button>
                <Button variant="outline-secondary" onClick={handleCancel} disabled={!isProfileChanged}>
                  Cancel
                </Button>
              </div>
              <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                Delete Profile
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Delete Profile Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete your profile? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowDeleteModal(false);
              handleDelete();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* -------- Account Settings -------- */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3 heading-text">Account Settings</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="sub-heading-text">Email</Form.Label>
              <Form.Control type="email" value={accountData.email || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="sub-heading-text">Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={accountData.currentPassword || ""}
                onChange={handleAccountChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="sub-heading-text">New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={accountData.newPassword || ""}
                onChange={handleAccountChange}
                placeholder="At least 8 characters"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="sub-heading-text">Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={accountData.confirmPassword || ""}
                onChange={handleAccountChange}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleSaveAccount}>
              Update Account
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
