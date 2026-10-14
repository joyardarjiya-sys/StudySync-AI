import { useState } from "react";
import "./StudentOnboarding.css";

function StudentOnboarding({ student, onComplete }) {
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [skills, setSkills] = useState([]);
  const [dailyGoal, setDailyGoal] = useState("60 minutes");
  const [error, setError] = useState("");

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const availableSkills = [
    "Java",
    "Python",
    "DSA",
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Web Development",
    "Cloud Computing",
    "SQL",
    "System Design",
  ];

  const toggleSkill = (skill) => {
    setSkills((previous) =>
      previous.includes(skill)
        ? previous.filter((item) => item !== skill)
        : [...previous, skill]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!course || !year || !careerGoal || skills.length === 0) {
      setError(
        "Please select your course, year, career goal, and at least one skill."
      );
      return;
    }

    const profile = {
      ...student,
      course,
      year,
      specialization,
      careerGoal,
      skills,
      dailyGoal,
      profileCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `studysync_profile_${student.email}`,
      JSON.stringify(profile)
    );

    if (onComplete) {
      onComplete(profile);
    }
  };

  return (
    <main className="onboarding-page">
      {/* Top navigation */}
      <header className="onboarding-header">
        <div className="onboarding-brand">
          <div className="onboarding-logo">S</div>

          <span>
            StudySync<span className="brand-accent"> AI</span>
          </span>
        </div>

        <div className="onboarding-date">
          <span className="date-indicator" />
          <span>{formattedDate}</span>
        </div>
      </header>

      {/* Main content */}
      <section className="onboarding-content">
        <div className="onboarding-intro">
          <div className="onboarding-badge">
            YOUR PERSONAL LEARNING SPACE
          </div>

          <h1>
            Let's build your
            <br />
            <span>learning journey.</span>
          </h1>

          <p>
            {student?.name
              ? `Welcome, ${student.name}! `
              : "Welcome! "}
            Tell us about your goals so we can personalize your
            StudySync AI experience.
          </p>
        </div>

        {/* Profile form */}
        <form className="onboarding-form" onSubmit={handleSubmit}>
          {/* Academic information */}
          <div className="onboarding-section">
            <div className="section-heading">
              <span className="section-number">01</span>

              <div>
                <h2>Your academics</h2>
                <p>Help us understand where you are in your journey.</p>
              </div>
            </div>

            <div className="onboarding-grid">
              <div className="onboarding-field">
                <label htmlFor="course">Course</label>

                <select
                  id="course"
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                >
                  <option value="">Select your course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="BCA">BCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="BBA">BBA</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="onboarding-field">
                <label htmlFor="year">Current year</label>

                <select
                  id="year"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                >
                  <option value="">Select your year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div className="onboarding-field full-width">
                <label htmlFor="specialization">
                  Specialization
                  <span className="optional-label">Optional</span>
                </label>

                <input
                  id="specialization"
                  type="text"
                  value={specialization}
                  onChange={(event) =>
                    setSpecialization(event.target.value)
                  }
                  placeholder="e.g. Computer Science, AI & ML"
                />
              </div>
            </div>
          </div>

          {/* Career information */}
          <div className="onboarding-section">
            <div className="section-heading">
              <span className="section-number">02</span>

              <div>
                <h2>Your career vision</h2>
                <p>Where would you like your skills to take you?</p>
              </div>
            </div>

            <div className="onboarding-field">
              <label htmlFor="career">Target job role</label>

              <select
                id="career"
                value={careerGoal}
                onChange={(event) => setCareerGoal(event.target.value)}
              >
                <option value="">Choose your career goal</option>
                <option value="Software Engineer">
                  Software Engineer
                </option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Cybersecurity Engineer">
                  Cybersecurity Engineer
                </option>
                <option value="Researcher">AI Researcher</option>
                <option value="Undecided">Still exploring</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div className="onboarding-section">
            <div className="section-heading">
              <span className="section-number">03</span>

              <div>
                <h2>Skills to develop</h2>
                <p>Select the skills you want to improve.</p>
              </div>
            </div>

            <div className="skills-grid">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`skill-option ${
                    skills.includes(skill) ? "selected" : ""
                  }`}
                  aria-pressed={skills.includes(skill)}
                  onClick={() => toggleSkill(skill)}
                >
                  <span className="skill-check">
                    {skills.includes(skill) ? "✓" : "+"}
                  </span>

                  {skill}
                </button>
              ))}
            </div>

            <p className="skills-hint">
              {skills.length} skill{skills.length !== 1 ? "s" : ""} selected
            </p>
          </div>

          {/* Learning goal */}
          <div className="onboarding-section">
            <div className="section-heading">
              <span className="section-number">04</span>

              <div>
                <h2>Your daily commitment</h2>
                <p>Choose a learning goal that works for you.</p>
              </div>
            </div>

            <div className="daily-goal-options">
              {["30 minutes", "60 minutes", "2 hours", "3+ hours"].map(
                (goal) => (
                  <button
                    key={goal}
                    type="button"
                    className={`daily-goal-option ${
                      dailyGoal === goal ? "selected" : ""
                    }`}
                    aria-pressed={dailyGoal === goal}
                    onClick={() => setDailyGoal(goal)}
                  >
                    {goal}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="onboarding-error" role="alert">
              {error}
            </div>
          )}

          {/* Submit */}
          <button className="onboarding-submit" type="submit">
            Personalize my learning
            <span>→</span>
          </button>

          <p className="onboarding-footer">
            Your goals. Your pace. Your future.
          </p>
        </form>
      </section>
    </main>
  );
}

export default StudentOnboarding;