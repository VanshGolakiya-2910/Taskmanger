import {
  createProjectService,
  addProjectMemberService,
  removeProjectMemberService,
  transferProjectOwnershipService,
} from "../services/project.service.js";

export const createProject = async (req, res) => {
  try {
    const project = await createProjectService({
      userId: req.user.id,
      name: req.body.name,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Project creation failed" });
  }
};

export const addProjectMember = async (req, res) => {
  try {
    await addProjectMemberService({
      projectId: req.params.projectId,
      targetUserId: req.body.userId,
      role: req.body.role,
    });

    res.status(200).json({ message: "Member added" });
  } catch (err) {
    if (err.message === "INVALID_PROJECT_ROLE") {
      return res.status(400).json({ message: "Invalid project role" });
    }

    res.status(500).json({ message: "Failed to add member" });
  }
};

export const removeProjectMember = async (req, res) => {
  try {
    await removeProjectMemberService({
      projectId: req.params.projectId,
      targetUserId: req.params.userId,
    });

    res.status(200).json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove member" });
  }
};

export const transferOwnership = async (req, res) => {
  try {
    await transferProjectOwnershipService({
      projectId: req.params.projectId,
      newManagerId: req.body.newManagerId,
    });

    res.status(200).json({ message: "Ownership transferred" });
  } catch (err) {
    res.status(500).json({ message: "Transfer failed" });
  }
};
