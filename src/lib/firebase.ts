
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp, 
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBp2R-SGh5u2ByEVM5AYPnfYCiaLX7Lw-k",
  authDomain: "projetos-bruno-1d53d.firebaseapp.com",
  projectId: "projetos-bruno-1d53d",
  storageBucket: "projetos-bruno-1d53d.firebasestorage.app",
  messagingSenderId: "77998473929",
  appId: "1:77998473929:web:562da573b6159e745d8318",
  measurementId: "G-BEEBE8PVYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Project type definitions
export interface ProjectPage {
  id?: string;
  name: string;
  features: string;
  imageUrl?: string;
  imageFile?: File;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  date: string | Date;
  technologies: string[];
  link?: string;
  imageUrl?: string;
  pages: ProjectPage[];
  createdAt?: Timestamp;
}

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Firestore functions
export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsQuery = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(projectsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date ? data.date : new Date(),
      } as Project;
    });
  } catch (error) {
    console.error("Error getting projects: ", error);
    throw error;
  }
};

export const getProject = async (id: string): Promise<Project | null> => {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.date ? data.date : new Date(),
      } as Project;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting project: ", error);
    throw error;
  }
};

export const addProject = async (project: Project): Promise<string> => {
  try {
    const projectWithTimestamp = {
      ...project,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, "projects"), projectWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error adding project: ", error);
    throw error;
  }
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
  try {
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, project);
  } catch (error) {
    console.error("Error updating project: ", error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting project: ", error);
    throw error;
  }
};

// Storage functions
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

export const deleteImage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image: ", error);
    throw error;
  }
};

// Auth state hook
export { auth, db, storage, onAuthStateChanged };
export type { User };
