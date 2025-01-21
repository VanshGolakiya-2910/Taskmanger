import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import styles from "./ProjectDetails.module.css";
import { TaskCard } from "../../Components/TaskCard/TaskCard";
import TeamMember from "../../Components/TeamMember/TeamMember";
import { Sidebar } from "../../Components/Sidebar/Sidebar";
import TaskManager from "../../Components/Taskmanger/TaskManger"; // Import TaskManager component

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]); // Existing tasks state
  const [users, setUsers] = useState([]); // Existing all users state
  const [usersByProject, setUsersByProject] = useState([]); // New state for users by project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false); // Existing modal state
  const navigate = useNavigate();
  
  // Fetch project details by ID
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/project/${id}`
        );
        setProject(response.data);
        const tasksResponse = await axios.get(
          `http://localhost:5000/api/tasks/project/${id}`
        ); // Fetch tasks
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
  
    fetchProjectDetails();
  }, [id]);
  
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  
  // Fetch users assigned to the current project
  useEffect(() => {
    const fetchUsersByProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/project/${id}`
        );
        setUsersByProject(response.data); // Store users assigned to the project
      } catch (error) {
        console.error("Error fetching users by project:", error);
      }
    };
  
    fetchUsersByProject();
  }, [id]);
  
  const handleBack = () => {
    navigate("/project");
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };
  
  const toggleTaskModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  const toggleUsersModal = () => {
    setIsUsersModalOpen(!isUsersModalOpen);
  };
  
  // Function to handle assigning the current project to the selected user
  const handleAssignProject = (userID) => {
    const projectID = parseInt(id); // Replace this with the actual project ID
    const data = { userID, projectID };
  
    fetch("http://localhost:5000/api/users/assign-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Project assigned to user successfully") {
          alert("Project assigned successfully!");
          // Refresh users assigned to the project
          const fetchUsersByProject = async () => {
            try {
              const response = await axios.get(
                `http://localhost:5000/api/users/project/${id}`
              );
              setUsersByProject(response.data);
            } catch (error) {
              console.error("Error refreshing users by project:", error);
            }
          };
  
          fetchUsersByProject();
        } else {
          alert("Error assigning project.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error assigning project.");
      });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <form className={styles.searchForm} role="search">
              <label htmlFor="searchInput" className="visually-hidden"></label>
              <div className={styles.searchBar}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/3e25b05d1fd543b9870cb114cf23b083/538c0355d503495f24fb6fbe9a40bb2074069bd3b17d119815fb7c1c230d948c?apiKey=3e25b05d1fd543b9870cb114cf23b083&"
                  alt=""
                  className={styles.searchIcon}
                />
                <input
                  type="search"
                  id="searchInput"
                  className={styles.searchInput}
                  placeholder="Search"
                />
              </div>
            </form>
            <div className={styles.headerActions}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/3e25b05d1fd543b9870cb114cf23b083/5c43f5a2b4d0700ce4cc26c510c872f23f3167a3014f7b14f0122b93369df2ef?apiKey=3e25b05d1fd543b9870cb114cf23b083&"
                alt="Notifications"
                className={styles.notificationIcon}
              />
              <div className={styles.userProfile}>
                <div className={styles.avatar} />
                <div className={styles.userName}>User Profile</div>
              </div>
            </div>
          </header>

          <section className={styles.projectSection}>
            <h1 className={styles.projectTitle}>{project?.Project_Name}</h1>
            <div className={styles.projectInfo}>
              <div className={styles.projectDates}>
                <div className={styles.dateInfo}>
                  <div className={styles.dateLabel}>Date added:</div>
                  <div className={styles.dateValue}>
                    {formatDate(project?.Assigned_On)}
                  </div>
                </div>
                <div className={styles.dateInfo}>
                  <div className={styles.dateLabel}>Deadline:</div>
                  <div className={styles.dateValue}>
                    {formatDate(project?.Due_Date)}
                  </div>
                </div>
              </div>
              <div className={styles.projectDescription}>
                <p>{project?.project_desc}</p>
              </div>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.tasksColumn}>
                <div className={styles.columnHeader}>
                  <h2 className={styles.columnTitle}>Tasks</h2>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/3e25b05d1fd543b9870cb114cf23b083/bbe86f4115e4bfd846ecf248a18019ece6a0830bc6c7bcf4e0c374a256fab30f?apiKey=3e25b05d1fd543b9870cb114cf23b083&"
                    alt="Add task"
                    className={styles.addIcon}
                    onClick={toggleTaskModal} // Trigger the modal toggle
                  />
                </div>
                <div className={styles.taskList}>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <TaskCard key={task.Task_ID} task={task} />
                    ))
                  ) : (
                    <p>No tasks available.</p>
                  )}
                </div>
              </div>

              <div className={styles.chatColumn}>
                <div className={styles.chatHeader}>Project Name</div>
                <div className={styles.chatArea} />
                <div className={styles.messageBar}>
                  <div className={styles.messageText}>Message</div>
                  <button
                    className={styles.sendButton}
                    aria-label="Send message"
                  />
                </div>
              </div>
              <div></div>
              <div className={styles.teamColumn}>
                <div className={styles.teamColumnflex}>
                  <h2 className={styles.teamTitle}>Team Members</h2>
                  <div
                    className={styles.addUserButton}
                    onClick={toggleUsersModal}
                  >
                    <span className={styles.addUserIcon}>+</span>
                  </div>
                </div>
                <TeamMember users={usersByProject} />
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Modal for TaskManager */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <TaskManager projectId={project?.Project_ID} />
            <button className={styles.closeButton} onClick={toggleTaskModal}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Modal for Users List */}
      {isUsersModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={toggleUsersModal}>
              &times;
            </button>
            <h2>Available Users</h2>
            <ul className={styles.usersList}>
              {users.length > 0 ? (
                users.map((user) => (
                  <li key={user.User_ID} className={styles.userItem}>
                    <div className={styles.userCard}>
                      <div className={styles.userInfoContainer}>
                        <span className={styles.userInfo}>
                          {user.User_Name} - ({user.Designation})
                        </span>
                      </div>
                      <button
                        className={styles.assignButton}
                        onClick={() => handleAssignProject(user.User_ID)}
                      >
                        + Assign Project
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No users available.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
