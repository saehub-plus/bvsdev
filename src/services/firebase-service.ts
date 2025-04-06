
import {
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
  uploadImage,
  deleteImage,
  signInWithEmail,
  signOut,
  Project,
  ProjectPage,
  User,
  auth,
  onAuthStateChanged,
  AuthError
} from '../lib/firebase';

// Auth Services
export const authService = {
  /**
   * Signs in a user with email and password
   * @param email User email
   * @param password User password
   * @returns Promise with user data
   */
  signIn: async (email: string, password: string): Promise<User> => {
    return await signInWithEmail(email, password);
  },
  
  /**
   * Signs out the current user
   */
  signOut: async (): Promise<void> => {
    return await signOut();
  },
  
  /**
   * Gets the current auth state
   * @param callback Function to call when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
  
  /**
   * Gets the current user
   */
  getCurrentUser: () => auth.currentUser,
};

// Project Services
export const projectService = {
  /**
   * Gets all projects
   * @returns Promise with array of projects
   */
  getAllProjects: async (): Promise<Project[]> => {
    return await getProjects();
  },
  
  /**
   * Gets a project by ID
   * @param id Project ID
   * @returns Promise with project data or null
   */
  getProjectById: async (id: string): Promise<Project | null> => {
    return await getProject(id);
  },
  
  /**
   * Creates a new project
   * @param project Project data
   * @returns Promise with created project ID
   */
  createProject: async (project: Project): Promise<string> => {
    return await addProject(project);
  },
  
  /**
   * Updates an existing project
   * @param id Project ID
   * @param project Partial project data to update
   */
  updateProject: async (id: string, project: Partial<Project>): Promise<void> => {
    return await updateProject(id, project);
  },
  
  /**
   * Deletes a project
   * @param id Project ID
   */
  deleteProject: async (id: string): Promise<void> => {
    return await deleteProject(id);
  },
};

// Storage Services
export const storageService = {
  /**
   * Uploads an image to Firebase Storage
   * @param file File to upload
   * @param path Storage path
   * @returns Promise with download URL
   */
  uploadImage: async (file: File, path: string): Promise<string> => {
    return await uploadImage(file, path);
  },
  
  /**
   * Deletes an image from Firebase Storage
   * @param path Storage path
   */
  deleteImage: async (path: string): Promise<void> => {
    return await deleteImage(path);
  },
  
  /**
   * Uploads multiple images for project pages
   * @param pages Project pages with image files
   * @returns Pages with image URLs
   */
  uploadPageImages: async (pages: ProjectPage[]): Promise<ProjectPage[]> => {
    return await Promise.all(
      pages.map(async (page) => {
        if (page.imageFile) {
          const filename = `pages/${Date.now()}_${page.imageFile.name}`;
          const pageImageUrl = await uploadImage(page.imageFile, filename);
          const { imageFile, ...rest } = page;
          return { ...rest, imageUrl: pageImageUrl };
        }
        return page;
      })
    );
  }
};

// Types
export type { Project, ProjectPage, User, AuthError };
