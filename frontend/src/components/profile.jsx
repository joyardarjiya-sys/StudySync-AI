import { useState } from "react";
import "./profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
  localStorage.getItem("studysync_profile_image") || ""
);

 const savedStudent = JSON.parse(
  localStorage.getItem("studysync_student") || "{}"
);

const [profile, setProfile] = useState({
  name: savedStudent.name || "Student",
  email: savedStudent.email || "",
  university: localStorage.getItem("studentUniversity") || "",
  course: localStorage.getItem("studentCourse") || "",
  semester: localStorage.getItem("studentSemester") || "",
  bio: localStorage.getItem("studentBio") || "Learning something new every day.",
});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
const handleSave = (event) => {
  event.preventDefault();

  const student = JSON.parse(
    localStorage.getItem("studysync_student") || "{}"
  );

  const updatedStudent = {
    ...student,
    name: profile.name.trim(),
    email: profile.email.trim(),
  };

  localStorage.setItem(
    "studysync_student",
    JSON.stringify(updatedStudent)
  );

  localStorage.setItem("studentUniversity", profile.university);
  localStorage.setItem("studentCourse", profile.course);
  localStorage.setItem("studentSemester", profile.semester);
  localStorage.setItem("studentBio", profile.bio);

  setIsEditing(false);
};
  return (
    <div className="profile-page">
      {/* Page Header */}
      <header className="profile-header">
        <div>
          <span className="profile-eyebrow">
            STUDYSYNC AI / ACCOUNT
          </span>

          <h1>My Profile<span>.</span></h1>

          <p>Manage your identity and personalize your learning space.</p>
        </div>

        <div className="profile-status">
          <span className="status-dot"></span>
          Student Account
        </div>
      </header>

      {/* Profile Hero */}
      <section className="profile-hero">
        <div className="profile-avatar">
  {profileImage ? (
    <img
      src={profileImage}
      alt="Student profile"
      className="profile-avatar-image"
    />
  ) : (
    profile.name.trim().charAt(0).toUpperCase() || "S"
  )}

  <label
    className="profile-avatar-upload"
    htmlFor="profile-image-input"
    title="Change profile picture"
  >
    ✎
  </label>

  <input
    id="profile-image-input"
    type="file"
    accept="image/*"
    hidden
    onChange={(event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Please choose an image smaller than 2 MB.");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const image = reader.result;

        if (typeof image === "string") {
          try {
            localStorage.setItem("studysync_profile_image", image);
            setProfileImage(image);
          } catch {
            alert("Unable to save the image. Please choose a smaller image.");
          }
        }
      };

      reader.readAsDataURL(file);
      event.target.value = "";
    }}
  />
</div>

        <div className="profile-hero-info">
          <span className="profile-label">YOUR PROFILE</span>

          <h2>{profile.name || "Student"}</h2>

          <p>{profile.email || "Add your email address"}</p>

          <div className="profile-tags">
            <span>🎓 Student</span>
            <span>✦ StudySync AI Member</span>
          </div>
        </div>

       


<button
  type="button"
  className="profile-edit-button"
  onClick={() => setIsEditing(true)}
>
  ✎ Edit Profile
</button>

      </section>

      {/* Profile Statistics */}
      <section className="profile-stats">
        <div className="profile-stat-card">
          <div className="profile-stat-icon">📚</div>
          <div>
            <h3>My Learning</h3>
            <p>Your personal learning space</p>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-icon">📄</div>
          <div>
            <h3>My Documents</h3>
            <p>Your study materials</p>
          </div>
        </div>

        <div className="profile-stat-card">
          <div className="profile-stat-icon">✦</div>
          <div>
            <h3>AI Assistant</h3>
            <p>Your personalized study companion</p>
          </div>
        </div>
      </section>

      {/* Profile Information */}
      <section className="profile-details-card">
        <div className="profile-section-heading">
          <div>
            <span className="profile-label">PERSONAL DETAILS</span>
            <h2>About You</h2>
          </div>

          <span className="profile-section-icon">◈</span>
        </div>

        <form onSubmit={handleSave}>
          <div className="profile-form-grid">
            <div className="profile-field">
              <label htmlFor="profile-name">Full Name</label>

              <input
                id="profile-name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="profile-field">
  <label htmlFor="profile-name">Full Name</label>

  <input
    id="profile-name"
    name="name"
    type="text"
    value={profile.name}
    onChange={handleChange}
    placeholder="Enter your full name"
    disabled={!isEditing}
    required
  />
</div>
            <div className="profile-field">
              <label htmlFor="profile-university">University</label>

              <input
                id="profile-university"
                name="university"
                value={profile.university}
                onChange={handleChange}
                placeholder="Your university"
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-course">Course / Branch</label>

              <input
                id="profile-course"
                name="course"
                value={profile.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech CSE"
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field">
              <label htmlFor="profile-semester">Current Semester</label>

              <select
                id="profile-semester"
                name="semester"
                value={profile.semester}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Select semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </div>

            <div className="profile-field">
              <label htmlFor="profile-bio">About Me</label>

              <input
                id="profile-bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Write a short introduction"
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="profile-form-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button type="submit" className="profile-save-button">
                Save Changes →
              </button>
            </div>
          )}
        </form>
      </section>

      <div className="profile-footer">
        <span>✦</span>
        Your journey. Your knowledge. Your future.
      </div>
    </div>
  );
}

export default Profile;