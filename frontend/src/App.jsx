import { useEffect, useState } from "react";
import Login from "./components/login";
import StudentOnboarding from "./components/StudentOnboarding";
import StudentDashboard from "./components/StudentDashboard";
import Profile from "./components/profile";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
const [student, setStudent] = useState(() => {
try {
return JSON.parse(localStorage.getItem("studysync_student")) || null;
} catch {
return null;
}
});

const [activePage, setActivePage] = useState("chat");
const [showDashboard, setShowDashboard] = useState(true);
const [studentProfile, setStudentProfile] = useState(() => {
  try {
    const savedStudent = JSON.parse(
      localStorage.getItem("studysync_student")
    );

    if (!savedStudent?.email) return null;

    return JSON.parse(
      localStorage.getItem(
        `studysync_profile_${savedStudent.email}`
      )
    ) || null;
  } catch {
    return null;
  }
});
const [messages, setMessages] = useState([]);
const [chatHistory, setChatHistory] = useState([]);
const [question, setQuestion] = useState("");
const [selectedFile, setSelectedFile] = useState(null);
const [uploadedFiles, setUploadedFiles] = useState([]);
const [loading, setLoading] = useState(false);
const [uploading, setUploading] = useState(false);
const [notice, setNotice] = useState("");
// Learning dashboard state
const learningKey = student?.email
? `studysync_learning_${student.email}`
: "studysync_learning_guest";

const [studyTasks, setStudyTasks] = useState(() => {
try {
const saved = JSON.parse(localStorage.getItem(learningKey));

```
if (saved?.tasks?.length) {
  return saved.tasks;
}
```

} catch (error) {
console.error("Could not load study tasks:", error);
}

return [
{
id: 1,
title: "Revise today's lecture notes",
duration: 25,
category: "Revision",
done: false,
},
{
id: 2,
title: "Learn one new concept",
duration: 30,
category: "Learning",
done: false,
},
{
id: 3,
title: "Practice coding problems",
duration: 40,
category: "Practice",
done: false,
},
{
id: 4,
title: "Review previous topics",
duration: 15,
category: "Revision",
done: false,
},
];
});



const [studyActivity, setStudyActivity] = useState(() => {
try {
return JSON.parse(localStorage.getItem(learningKey))?.activity || [];
} catch {
return [];
}
});

const completedTasks = studyTasks.filter((task) => task.done).length;

const toggleStudyTask = (taskId) => {
const task = studyTasks.find((item) => item.id === taskId);
if (!task) return;

const willComplete = !task.done;

setStudyTasks((previous) =>
previous.map((item) =>
item.id === taskId ? { ...item, done: !item.done } : item
)
);

if (willComplete) {
const today = new Date().toLocaleDateString("en-CA");
setStudyActivity((previous) =>
previous.includes(today) ? previous : [...previous, today]
);
}
};

useEffect(() => {
localStorage.setItem(
learningKey,
JSON.stringify({
tasks: studyTasks,
activity: studyActivity,
})
);
}, [learningKey, studyTasks, studyActivity]);

const getDateKey = (date) => {
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
return `${year}-${month}-${day}`;
};

const activityDates = new Set(studyActivity);

const today = getDateKey(new Date());

let studyStreak = 0;
const streakDate = new Date();

while (activityDates.has(getDateKey(streakDate))) {
studyStreak++;
streakDate.setDate(streakDate.getDate() - 1);
}

if (studyStreak === 0) {
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

if (activityDates.has(getDateKey(yesterday))) {
streakDate.setTime(yesterday.getTime());


while (activityDates.has(getDateKey(streakDate))) {
  studyStreak++;
  streakDate.setDate(streakDate.getDate() - 1);
}


}
}

const longestStreak = (() => {
const dates = [...activityDates].sort();
let longest = 0;
let current = 0;
let previousDate = null;

dates.forEach((dateString) => {
const date = new Date(`${dateString}T12:00:00`);


if (
  previousDate &&
  date.getTime() - previousDate.getTime() === 86400000
) {
  current++;
} else {
  current = 1;
}

longest = Math.max(longest, current);
previousDate = date;


});

return longest;
})();

const weekDays = (() => {
const now = new Date();
const day = now.getDay();
const mondayOffset = day === 0 ? -6 : 1 - day;
const monday = new Date(now);

monday.setDate(now.getDate() + mondayOffset);

const days = [];

for (let index = 0; index < 7; index++) {
const date = new Date(monday);
date.setDate(monday.getDate() + index);


const dateKey = getDateKey(date);

days.push({
  label: date.toLocaleDateString("en-US", {
    weekday: "short",
  }),
  active: activityDates.has(dateKey),
});


}

return days;
})();


const subjectProgress = [
{ name: "Learning & Revision", progress: Math.round((completedTasks / Math.max(studyTasks.length, 1)) * 100) },
{ name: "Study Consistency", progress: Math.min(100, studyActivity.length * 10) },
{ name: "Study Materials", progress: uploadedFiles.length > 0 ? 100 : 0 },
];


const storageKey = student
? `studysync_history_${student.email}`
: null;

useEffect(() => {
if (!storageKey) return;


try {
  const savedHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
  setChatHistory(savedHistory);
} catch {
  setChatHistory([]);
}

setMessages([]);
setNotice("");

}, [storageKey]);

useEffect(() => {
if (!storageKey) return;
localStorage.setItem(storageKey, JSON.stringify(chatHistory));
}, [chatHistory, storageKey]);

const saveCurrentChat = (updatedMessages) => {
if (!updatedMessages.length || !student) return;


const chat = {
  id: Date.now(),
  title:
    updatedMessages.find((message) => message.role === "user")?.content
      ?.slice(0, 45) || "Study conversation",
  date: new Date().toLocaleString(),
  messages: updatedMessages,
};

setChatHistory((previous) => [chat, ...previous]);


};

const handleLogin = (studentData) => {
localStorage.setItem(
"studysync_student",
JSON.stringify(studentData)
);

const savedProfile = localStorage.getItem(
`studysync_profile_${studentData.email}`
);

let profile = null;

try {
profile = savedProfile ? JSON.parse(savedProfile) : null;
} catch {
profile = null;
}

setStudent(studentData);
setStudentProfile(profile);

// First-time students complete onboarding.
// Returning students go directly to the AI Tutor.
setShowDashboard(false);
setActivePage("chat");
setMessages([]);
setNotice("");
};

const handleOnboardingComplete = (profile) => {
setStudentProfile(profile);
setShowDashboard(false);
setActivePage("chat");
setMessages([]);
setNotice("");
};

const handleLogout = () => {
  localStorage.removeItem("studysync_student");

  setStudent(null);
  setStudentProfile(null);
  setShowDashboard(true);
  setMessages([]);
  setQuestion("");
  setNotice("");
  setActivePage("chat");
};

const startNewChat = () => {
setMessages([]);
setQuestion("");
setActivePage("chat");
setNotice("");
};

const openHistory = (chat) => {
setMessages(chat.messages || []);
setActivePage("chat");
setNotice(`Opened conversation: ${chat.title}`);
};

const handleUpload = async (event) => {
event.preventDefault();


if (!selectedFile) {
  setNotice("Please choose a PDF file first.");
  return;
}

if (selectedFile.type !== "application/pdf" &&
    !selectedFile.name.toLowerCase().endsWith(".pdf")) {
  setNotice("Please upload a PDF file.");
  return;
}

setUploading(true);
setNotice("");

try {
  const formData = new FormData();
  formData.append("file", selectedFile);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Upload failed.");
  }

  setUploadedFiles((previous) => [
    {
      name: selectedFile.name,
      id: `${selectedFile.name}-${Date.now()}`,
      status: "Uploaded",
    },
    ...previous,
  ]);

  setNotice(`${selectedFile.name} uploaded successfully.`);
  setSelectedFile(null);
  event.target.reset();
} catch (error) {
  setNotice(
    `Upload failed: ${error.message}. Make sure your backend is running.`
  );
} finally {
  setUploading(false);
}


};

const handleAsk = async (event) => {
event.preventDefault();


const trimmedQuestion = question.trim();

if (!trimmedQuestion || loading) return;

const userMessage = {
  role: "user",
  content: trimmedQuestion,
};

const updatedMessages = [...messages, userMessage];

setMessages(updatedMessages);
setQuestion("");
setLoading(true);
setNotice("");

try {
  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question: trimmedQuestion }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Could not get an AI response.");
  }

  const answer =
    data.answer ||
    data.response ||
    data.message ||
    "The API responded, but no answer field was found.";

  const finalMessages = [
    ...updatedMessages,
    { role: "assistant", content: answer },
  ];

  setMessages(finalMessages);
  saveCurrentChat(finalMessages);
} catch (error) {
  setMessages([
    ...updatedMessages,
    {
      role: "assistant",
      content: `Sorry, I couldn't get an answer. ${error.message}`,
    },
  ]);
} finally {
  setLoading(false);
}


};

const deleteHistory = (chatId) => {
setChatHistory((previous) =>
previous.filter((chat) => chat.id !== chatId)
);
};

if (!student) {
  return <Login onLogin={handleLogin} />;
}

if (!studentProfile) {
  return (
    <StudentOnboarding
      student={student}
      onComplete={handleOnboardingComplete}
    />
  );
}
if (showDashboard) {
  return (
    <StudentDashboard
      student={student}
      profile={studentProfile}
      onContinue={() => setShowDashboard(false)}
    />
  );
}
return ( <div className="ss-app"> <aside className="ss-sidebar"> <div className="ss-brand"> <div className="ss-logo">S</div> <div> <h1>StudySync <span>AI</span></h1> <p>YOUR PERSONAL AI TUTOR</p> </div> </div>


    <button className="ss-primary-button" onClick={startNewChat}>
      <span>＋</span> New conversation
    </button>

    <p className="ss-nav-label">WORKSPACE</p>

   
<button
  className={`ss-nav-item ${activePage === "chat" ? "active" : ""}`}
  onClick={() => setActivePage("chat")}
>
  <span>✳</span> AI Tutor
</button>

<button
  className={`ss-nav-item ${activePage === "learning" ? "active" : ""}`}
  onClick={() => setActivePage("learning")}
>
  <span>◈</span> Your Learning
</button>

<button
  className={`ss-nav-item ${activePage === "documents" ? "active" : ""}`}
  onClick={() => {
    console.log("My Documents clicked");
    setActivePage("documents");
  }}
>
  <span>▤</span> My Documents
  <span className="ss-count">{uploadedFiles.length}</span>
</button>
<button
  className={`ss-nav-item ${activePage === "profile" ? "active" : ""}`}
  onClick={() => setActivePage("profile")}
>
  <span>👤</span>
  <span>My Profile</span>
</button>

<p className="ss-nav-label ss-history-label">RECENT CONVERSATIONS</p>


    <div className="ss-history-list">
      {chatHistory.length === 0 ? (
        <p className="ss-empty-history">Your conversations will appear here.</p>
      ) : (
        chatHistory.map((chat) => (
          <div className="ss-history-row" key={chat.id}>
            <button
              className="ss-history-button"
              onClick={() => openHistory(chat)}
              title={chat.title}
            >
              <span>◷</span>
              <span>{chat.title}</span>
            </button>

            <button
              className="ss-delete-button"
              title="Delete conversation"
              onClick={() => deleteHistory(chat.id)}
            >
              ×
            </button>
          </div>
        ))
      )}
    </div>

    <div className="ss-sidebar-bottom">
      <div className="ss-user-card">
        <div className="ss-avatar">
          {(student.name || "S").charAt(0).toUpperCase()}
        </div>
        <div className="ss-user-details">
          <strong>{student.name}</strong>
          <span>{student.email}</span>
        </div>
      </div>

      <button className="ss-logout-button" onClick={handleLogout}>
        ↗ Log out
      </button>
    </div>
  </aside>

   <main className="ss-main">
    <header className="ss-topbar">
      <div>
        <p className="ss-breadcrumb">STUDYSYNC AI <span>/</span> WORKSPACE</p>
        <h2>
          {activePage === "documents" ? "Your library" : "AI Study Space"}
        </h2>
      </div>

      <div className="ss-status">
        <span className="ss-status-dot" />
        AI TUTOR READY
      </div>
    </header>

    {notice && (
      <div className="ss-notice" role="status">
        {notice}
        <button onClick={() => setNotice("")}>×</button>
      </div>
    )}

    {activePage === "profile" ? (
  <Profile />
) : activePage === "learning" ? (

  <section className="ss-content ss-learning-page">
    <div className="ss-learning-header">
      <p className="ss-eyebrow">YOUR LEARNING JOURNEY</p>
      <h3>Small steps. Big progress.</h3>
      <p className="ss-subtitle">
        Build consistent habits, follow your study plan, and track your growth.
      </p>
    </div>
    <div className="ss-weekly-calendar">
  <div className="ss-weekly-calendar-heading">
    <div>
      <p className="ss-eyebrow">YOUR WEEK AT A GLANCE</p>
      <h4>Weekly study activity</h4>
      <p className="ss-calendar-subtitle">
        Every small session moves you forward.
      </p>
    </div>


<div className="ss-calendar-badge">
  ✨ Stay consistent
</div>


  </div>

  <div className="ss-week-days">
    {weekDays.map((day, index) => {
      const now = new Date();
      const today = now.getDay();
      const mondayOffset = today === 0 ? -6 : 1 - today;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);


  const date = new Date(monday);
  date.setDate(monday.getDate() + index);

  const isToday =
    date.toDateString() === now.toDateString();

  return (
    <div
      className={`ss-week-day ${isToday ? "today" : ""} ${
        day.active ? "has-activity" : ""
      }`}
      key={day.label}
    >
      <span className="ss-week-day-label">{day.label}</span>

      <span className="ss-week-day-date">
        {date.getDate()}
      </span>

      <span className="ss-week-day-indicator">
        {day.active ? "✓" : isToday ? "•" : ""}
      </span>
    </div>
  );
})}


  </div>

  <div className="ss-calendar-legend">
    <span>
      <i className="ss-legend-dot ss-legend-active"></i>
      Study activity recorded
    </span>
    <span>
      <i className="ss-legend-dot ss-legend-today"></i>
      Today
    </span>
  </div>
</div>



   <div className="ss-learning-stats">
  <div className="ss-learning-card ss-streak-card">
    <span className="ss-learning-icon">🔥</span>
    <p>Current streak</p>
    <h2>{studyStreak} days</h2>
    <span>Keep your momentum going!</span>
  </div>

  <div className="ss-learning-card">
    <span className="ss-learning-icon">🏆</span>
    <p>Longest streak</p>
    <h2>{longestStreak} days</h2>
    <span>Your personal best</span>
  </div>

  <div className="ss-learning-card">
    <span className="ss-learning-icon">✅</span>
    <p>Tasks completed</p>
    <h2>{completedTasks}/{studyTasks.length}</h2>
    <span>Keep checking off your goals</span>
  </div>

  <div className="ss-learning-card">
    <span className="ss-learning-icon">📈</span>
    <p>Study plan progress</p>
    <h2>
      {studyTasks.length
        ? Math.round((completedTasks / studyTasks.length) * 100)
        : 0}%
    </h2>
    <span>Today's completion</span>
  </div>
</div>

<div className="ss-learning-grid">
  <div className="ss-learning-panel ss-study-plan">
    <div className="ss-learning-panel-heading">
      <div>
        <p className="ss-eyebrow">YOUR DAILY GOALS</p>
        <h4>Today's study plan</h4>
      </div>
      <span className="ss-plan-date">
        {new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })}
      </span>
    </div>
    <div className="ss-daily-progress">
  <div className="ss-daily-progress-info">
    <span>Today's progress</span>
    <strong>
      {studyTasks.length
        ? Math.round((completedTasks / studyTasks.length) * 100)
        : 0}%
    </strong>
  </div>

  <div
    className="ss-daily-progress-track"
    role="progressbar"
    aria-label="Today's study plan progress"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={
      studyTasks.length
        ? Math.round((completedTasks / studyTasks.length) * 100)
        : 0
    }
  >
    <div
      className="ss-daily-progress-fill"
      style={{
        width: `${
          studyTasks.length
            ? Math.round((completedTasks / studyTasks.length) * 100)
            : 0
        }%`,
      }}
    />
  </div>

  <p>
    {completedTasks === 0
      ? "Every great achievement starts with one task."
      : completedTasks === studyTasks.length
        ? "Amazing! You've completed today's study plan! 🎉"
        : `${completedTasks} of ${studyTasks.length} tasks completed. Keep going!`}
  </p>
</div>


    <div className="ss-study-task-list">
      {studyTasks.map((task) => (
        <label
          className={`ss-study-task ${task.done ? "completed" : ""}`}
          key={task.id}
        >
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleStudyTask(task.id)}
          />

          <span className="ss-task-check">✓</span>

          <span className="ss-task-details">
            <strong>{task.title}</strong>
            <small>{task.duration} min · {task.category}</small>
          </span>

          <span className="ss-task-duration">
            {task.duration}m
          </span>
        </label>
      ))}
    </div>

    <div className="ss-plan-progress">
      <div>
        <span>Daily goal progress</span>
        <strong>
          {completedTasks}/{studyTasks.length} completed
        </strong>
      </div>

      <div className="ss-progress-track">
        <div
          className="ss-progress-fill"
          style={{
            width: `${
              studyTasks.length
                ? (completedTasks / studyTasks.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </div>

  <div className="ss-learning-panel ss-weekly-panel">
    <p className="ss-eyebrow">CONSISTENCY IS KEY</p>
    <h4>Your weekly activity</h4>
    <p className="ss-weekly-description">
      Complete at least one study task each day to build your streak.
    </p>

    <div className="ss-weekly-tracker">
      {weekDays.map((day) => (
        <div className="ss-weekly-day" key={day.label}>
          <span className="ss-weekly-day-label">{day.label}</span>
          <div
            className={`ss-weekly-day-circle ${
              day.active ? "is-active" : ""
            }`}
          >
            {day.active ? "✓" : "·"}
          </div>
        </div>
      ))}
    </div>

    <div className="ss-streak-message">
      <span>✨</span>
      <p>
        {completedTasks === studyTasks.length
          ? "Amazing! You've completed every task in today's plan."
          : "Every completed task brings you one step closer to your goals."}
      </p>
    </div>
  </div>
</div>

<div className="ss-learning-panel ss-subject-progress">
  <p className="ss-eyebrow">KEEP GROWING</p>
  <h4>Your learning goals</h4>

  {subjectProgress.map((subject) => (
    <div className="ss-subject-row" key={subject.name}>
      <div className="ss-subject-heading">
        <strong>{subject.name}</strong>
        <span>{subject.progress}%</span>
      </div>

      <div className="ss-progress-track">
        <div
          className="ss-progress-fill"
          style={{ width: `${subject.progress}%` }}
        />
      </div>
    </div>
  ))}
</div>
```

  </section>
) : activePage === "documents" ? (

      <section className="ss-content ss-documents-page">
        <div className="ss-welcome-icon">▤</div>
        <p className="ss-eyebrow">YOUR KNOWLEDGE BASE</p>
        <h3>Everything you need to learn.</h3>
        <p className="ss-subtitle">
          Upload your lecture notes, textbooks, and study material.
        </p>

        <form className="ss-upload-card" onSubmit={handleUpload}>
          <div className="ss-upload-icon">↑</div>
          <h4>Upload your study material</h4>
          <p>Select a PDF document to add it to your study workspace.</p>

          <label className="ss-file-picker">
            {selectedFile ? selectedFile.name : "Choose a PDF"}
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] || null)
              }
            />
          </label>

          <button className="ss-primary-button" type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload document →"}
          </button>
        </form>

        <div className="ss-document-list">
          <h4>Uploaded in this session</h4>
          {uploadedFiles.length === 0 ? (
            <p className="ss-empty-history">
              Your uploaded documents will appear here.
            </p>
          ) : (
            uploadedFiles.map((file) => (
              <div className="ss-document-row" key={file.id}>
                <div className="ss-pdf-icon">PDF</div>
                <div className="ss-document-info">
                  <strong>{file.name}</strong>
                  <span>Ready to use</span>
                </div>
                <span className="ss-file-status">● {file.status}</span>
              </div>
            ))
          )}
        </div>
      </section>
    ) : (
      <section className="ss-chat-layout">
        <div className="ss-chat-intro">
          <div className="ss-welcome-icon">✳</div>
          <p className="ss-eyebrow">YOUR PERSONAL LEARNING ASSISTANT</p>
          <h3>
            Hey, {student.name.split(" ")[0]}.
            <br />
            <span>What are we learning today?</span>
          </h3>
          <p className="ss-subtitle">
            Ask questions about your study materials and explore concepts
            with your AI tutor.
          </p>

          {messages.length === 0 && (
            <div className="ss-suggestions">
              {[
                "Explain a difficult concept simply",
                "Help me prepare for an exam",
                "Summarize my study notes",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuestion(suggestion)}
                >
                  <span>✧</span> {suggestion} <span>↗</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ss-chat-messages">
          {messages.map((message, index) => (
            <div
              className={`ss-message ${message.role === "user" ? "ss-user-message" : "ss-ai-message"}`}
              key={`${index}-${message.role}`}
            >
              <div className="ss-message-avatar">
                {message.role === "user"
                  ? (student.name || "S").charAt(0).toUpperCase()
                  : "✳"}
              </div>
              <div className="ss-message-body">
                <strong>
                  {message.role === "user" ? "You" : "StudySync AI"}
                </strong>
                <p>{message.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="ss-thinking">
              <span />
              <span />
              <span />
              StudySync is thinking...
            </div>
          )}
        </div>

        <form className="ss-chat-composer" onSubmit={handleAsk}>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form.requestSubmit();
              }
            }}
            placeholder="Ask anything about your studies..."
            rows={2}
          />

          <div className="ss-composer-bottom">
            <span>↳ AI-powered learning · Shift + Enter for a new line</span>
            <button type="submit" disabled={loading || !question.trim()}>
              {loading ? "Thinking..." : "Ask AI ↑"}
            </button>
          </div>
        </form>

        <p className="ss-disclaimer">
          AI can make mistakes. Check important information against your study materials.
        </p>
      </section>
    )}
  </main>
</div>


);
}

export default App;
