import "./StudentDashboard.css";

function StudentDashboard({ student, profile, onContinue }) {
const today = new Date();

const formattedDate = today.toLocaleDateString("en-IN", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric",
});

const firstName = student?.name?.split(" ")[0] || "Student";

return ( <div className="dashboard-page"> <header className="dashboard-header"> <div className="dashboard-brand"> <div className="dashboard-logo">S</div> <div> <h1>
StudySync <span>AI</span> </h1> <p>YOUR PERSONAL LEARNING SPACE</p> </div> </div>

```
    <div className="dashboard-date">
      <span>◷</span>
      {formattedDate}
    </div>
  </header>

  <main className="dashboard-content">
    <section className="dashboard-welcome">
      <div>
        <p className="dashboard-eyebrow">YOUR LEARNING JOURNEY STARTS HERE</p>
        <h2>
          Welcome back, {firstName}
          <span>.</span>
        </h2>
        <p>
          Your goals are set. Let's turn them into progress, one day at a
          time.
        </p>
      </div>

      <div className="dashboard-avatar">
        {firstName.charAt(0).toUpperCase()}
      </div>
    </section>

    <section className="dashboard-stats">
      <article className="dashboard-stat-card">
        <span className="dashboard-stat-icon">◷</span>
        <p>DAILY LEARNING GOAL</p>
        <h3>{profile?.dailyGoal || "60 minutes"}</h3>
        <span className="dashboard-stat-note">Your daily target</span>
      </article>

      <article className="dashboard-stat-card">
        <span className="dashboard-stat-icon">✧</span>
        <p>LEARNING STREAK</p>
        <h3>0 days</h3>
        <span className="dashboard-stat-note">
          Start learning to build your streak
        </span>
      </article>

      <article className="dashboard-stat-card">
        <span className="dashboard-stat-icon">◎</span>
        <p>SKILLS TO DEVELOP</p>
        <h3>{profile?.skills?.length || 0} skills</h3>
        <span className="dashboard-stat-note">Your selected focus areas</span>
      </article>
    </section>

    <section className="dashboard-grid">
      <article className="dashboard-card dashboard-profile-card">
        <p className="dashboard-eyebrow">YOUR PROFILE</p>
        <h3>Your learning roadmap</h3>

        <div className="dashboard-detail">
          <span>Course</span>
          <strong>{profile?.course || "Not specified"}</strong>
        </div>

        <div className="dashboard-detail">
          <span>Academic year</span>
          <strong>{profile?.year || "Not specified"}</strong>
        </div>

        <div className="dashboard-detail">
          <span>Specialization</span>
          <strong>{profile?.specialization || "Not specified"}</strong>
        </div>

        <div className="dashboard-detail">
          <span>Career goal</span>
          <strong>{profile?.careerGoal || "Not specified"}</strong>
        </div>
      </article>

      <article className="dashboard-card dashboard-skills-card">
        <p className="dashboard-eyebrow">YOUR FOCUS AREAS</p>
        <h3>Skills you're building</h3>

        <div className="dashboard-skill-list">
          {profile?.skills?.length ? (
            profile.skills.map((skill) => (
              <span className="dashboard-skill-tag" key={skill}>
                <span>✦</span> {skill}
              </span>
            ))
          ) : (
            <p>No skills selected yet.</p>
          )}
        </div>

        <div className="dashboard-goal-box">
          <span>✧</span>
          <div>
            <strong>Your next step</strong>
            <p>
              Spend {profile?.dailyGoal || "60 minutes"} learning something
              that moves you closer to your career goal.
            </p>
          </div>
        </div>
      </article>
    </section>

    <section className="dashboard-action-card">
      <div>
        <p className="dashboard-eyebrow">READY WHEN YOU ARE</p>
        <h3>Let's make today's learning count.</h3>
        <p>
          Upload your notes, ask questions, and learn with your personal AI
          tutor.
        </p>
      </div>

      <button onClick={onContinue}>
        Enter AI Study Space <span>→</span>
      </button>
    </section>

    <footer className="dashboard-footer">
      Made for your curiosity. Powered by StudySync AI.
    </footer>
  </main>
</div>


);
}

export default StudentDashboard;
