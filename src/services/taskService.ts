import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";


interface Task {
  id?: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  user: string;
}

// Add Task
export const addTask = async (task: Omit<Task, "id">): Promise<void> => {
  console.log("Inside addTask function, received task:", task);

  try {
    const docRef = await addDoc(collection(db, "tasks"), task);
    console.log("Task added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Fetch Tasks
export const getTasks = async (user: string): Promise<Task[]> => {
  try {
    if (!user) {
      console.error("🚨 Invalid user value:", user);
      return [];
    }

    console.log("🔍 Fetching tasks for user:", user);

    const q = query(collection(db, "tasks"), where("user", "==", user));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("⚠️ No tasks found for this user!");
      return [];
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return [];
  }
};

// Update Task
export const updateTask = async (
  taskId: string,
  updatedData: Partial<Task>
): Promise<void> => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updatedData);
    console.log("Task updated successfully!");
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

// Delete Selected Tasks
export const deleteSelectedTasks = async (
  selectedTasks: string[],
  fetchTasks: () => void,
  setSelectedTasks: (tasks: string[]) => void
): Promise<void> => {
  if (selectedTasks.length === 0) return;

  try {
    await Promise.all(
      selectedTasks.map((taskId) => deleteDoc(doc(db, "tasks", taskId)))
    );
    setSelectedTasks([]);
    fetchTasks();
    console.log("✅ Selected tasks deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting tasks:", error);
  }
};

// Update Selected Tasks Status
export const updateSelectedTasksStatus = async (
  selectedTasks: string[],
  newStatus: string,
  fetchTasks: () => void,
  setSelectedTasks: (tasks: string[]) => void
): Promise<void> => {
  if (selectedTasks.length === 0 || !newStatus) return;

  try {
    console.log("Entered");
    await Promise.all(
      selectedTasks.map((taskId) =>
        updateDoc(doc(db, "tasks", taskId), { status: newStatus })
      )
    );

    setSelectedTasks([]);
    fetchTasks();
    console.log(`✅ Selected tasks updated to "${newStatus}" successfully!`);
  } catch (error) {
    console.error("❌ Error updating task status:", error);
  }
};

// Delete Task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    console.log("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
