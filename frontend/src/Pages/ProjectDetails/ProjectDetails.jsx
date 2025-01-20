import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import styles from './ProjectDetails.module.css';
import { TaskCard } from '../../Components/TaskCard/TaskCard';
import { TeamMember } from '../../Components/TeamMember/TeamMember';
import { Sidebar } from '../../Components/Sidebar/Sidebar';
import TaskManager  from '../../Components/Taskmanger/TaskManger';// Import TaskManager component

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);  // Added tasks state
    const navigate = useNavigate();

    // State for controlling the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch project details by ID
    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/projects/${id}`);
                setProject(response.data);
                const tasksResponse = await axios.get(` http://localhost:5000/api/tasks/project/${id}`);  // Fetch tasks
                setTasks(tasksResponse.data);
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };

        fetchProjectDetails();
    }, [id]);

    const handleBack = () => {
        navigate('/project');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
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
                                <img src="https://cdn.builder.io/api/v1/image/assets/3e25b05d1fd543b9870cb114cf23b083/538c0355d503495f24fb6fbe9a40bb2074069bd3b17d119815fb7c1c230d948c?apiKey=3e25b05d1fd543b9870cb114cf23b083&" alt="" className={styles.searchIcon} />
                                <input type="search" id="searchInput" className={styles.searchInput} placeholder="Search" />
                            </div>
                        </form>
                        <div className={styles.headerActions}>
                            <img src="https://cdn.builder.io/api/v1/image/assets/3e25b05d1fd543b9870cb114cf23b083/5c43f5a2b4d0700ce4cc26c510c872f23f3167a3014f7b14f0122b93369df2ef?apiKey=3e25b05d1fd543b9870cb114cf23b083&" alt="Notifications" className={styles.notificationIcon} />
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
                                    <div className={styles.dateValue}>{formatDate(project?.Assigned_On)}</div>
                                </div>
                                <div className={styles.dateInfo}>
                                    <div className={styles.dateLabel}>Deadline:</div>
                                    <div className={styles.dateValue}>{formatDate(project?.Due_Date)}</div>
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
                                        onClick={toggleModal} // Trigger the modal toggle
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
                                    <button className={styles.sendButton} aria-label="Send message" />
                                </div>
                            </div>

                            <div className={styles.teamColumn}>
                                <h2 className={styles.teamTitle}>Team Members</h2>
                                <form className={styles.memberSearchForm} role="search">
                                    <label htmlFor="memberSearch" className="visually-hidden">Search Member</label>
                                    <input type="search" id="memberSearch" className={styles.memberSearchInput} placeholder="Search Member" />
                                </form>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Modal for TaskManager */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={toggleModal}>&times;</button>
                        <TaskManager projectId={project?.Project_ID} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectDetails;
