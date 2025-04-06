
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Project,
  ProjectPage,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  uploadImage,
  deleteImage,
} from "../lib/firebase";
import {
  PlusCircle,
  LogOut,
  Trash2,
  Edit,
  Save,
  X,
  Image,
  Loader2,
  FileText,
  Calendar,
  Link as LinkIcon,
  Code,
  AlertTriangle,
} from "lucide-react";

const AdminPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    technologies: [],
    link: "",
    pages: [],
  });
  const [techInput, setTechInput] = useState("");
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const projectImageRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Falha na conexão com o banco de dados",
        description:
          "Não foi possível carregar os projetos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechInput(e.target.value);
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      addTechnology();
    }
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const removeTechnology = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectImageFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      technologies: [],
      link: "",
      pages: [],
    });
    setTechInput("");
    setProjectImageFile(null);
    if (projectImageRef.current) {
      projectImageRef.current.value = "";
    }
    setCurrentProject(null);
  };

  const handleCancelAddProject = () => {
    setIsAddingProject(false);
    setIsEditingProject(false);
    resetForm();
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pages.length === 0) {
      toast({
        title: "Erro de validação",
        description: "Adicione pelo menos uma página ao projeto.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      let imageUrl = formData.imageUrl || "";

      // Upload project image if exists
      if (projectImageFile) {
        const filename = `projects/${Date.now()}_${projectImageFile.name}`;
        imageUrl = await uploadImage(projectImageFile, filename);
      }

      // Process pages to upload their images
      const pagesWithImages = await Promise.all(
        formData.pages.map(async (page) => {
          if (page.imageFile) {
            const filename = `pages/${Date.now()}_${page.imageFile.name}`;
            const pageImageUrl = await uploadImage(page.imageFile, filename);
            const { imageFile, ...rest } = page;
            return { ...rest, imageUrl: pageImageUrl };
          }
          return page;
        })
      );

      // Create or update the project with all data
      const projectToSave = {
        ...formData,
        imageUrl,
        pages: pagesWithImages,
      };

      if (isEditingProject && currentProject?.id) {
        await updateProject(currentProject.id, projectToSave);
        toast({
          title: "Projeto atualizado com sucesso",
          description: "As alterações foram salvas na matriz de projetos.",
          variant: "default",
        });
      } else {
        await addProject(projectToSave);
        toast({
          title: "Projeto adicionado com sucesso",
          description: "A matriz de projetos foi atualizada.",
          variant: "default",
        });
      }

      // Reset form and fetch updated projects
      resetForm();
      setIsAddingProject(false);
      setIsEditingProject(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: isEditingProject ? "Erro ao atualizar projeto" : "Erro ao adicionar projeto",
        description: "Não foi possível salvar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Page management functions
  const [currentPage, setCurrentPage] = useState<ProjectPage>({
    name: "",
    features: "",
  });
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const [pageImageFile, setPageImageFile] = useState<File | null>(null);
  const pageImageRef = useRef<HTMLInputElement>(null);

  const handlePageInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentPage((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPageImageFile(e.target.files[0]);
    }
  };

  const resetPageForm = () => {
    setCurrentPage({
      name: "",
      features: "",
    });
    setPageImageFile(null);
    if (pageImageRef.current) {
      pageImageRef.current.value = "";
    }
  };

  const handleAddPage = () => {
    if (!currentPage.name || !currentPage.features) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e as funcionalidades da página.",
        variant: "destructive",
      });
      return;
    }

    const newPage: ProjectPage = {
      ...currentPage,
      imageFile: pageImageFile || undefined,
    };

    setFormData((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));

    toast({
      title: "Página adicionada",
      description: "A página foi adicionada ao projeto.",
      variant: "default",
    });

    resetPageForm();
    setIsAddingPage(false);
  };

  const handleEditPage = () => {
    if (editingPageIndex === null) return;

    if (!currentPage.name || !currentPage.features) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e as funcionalidades da página.",
        variant: "destructive",
      });
      return;
    }

    const updatedPage: ProjectPage = {
      ...currentPage,
      imageFile: pageImageFile || undefined,
    };

    setFormData((prev) => {
      const updatedPages = [...prev.pages];
      updatedPages[editingPageIndex] = updatedPage;
      return { ...prev, pages: updatedPages };
    });

    toast({
      title: "Página atualizada",
      description: "As alterações na página foram salvas.",
      variant: "default",
    });

    resetPageForm();
    setIsEditingPage(false);
    setEditingPageIndex(null);
  };

  const startEditPage = (index: number) => {
    const page = formData.pages[index];
    setCurrentPage({
      name: page.name,
      features: page.features,
      imageUrl: page.imageUrl,
    });
    setEditingPageIndex(index);
    setIsEditingPage(true);
    setIsAddingPage(false);
  };

  const removePage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pages: prev.pages.filter((_, i) => i !== index),
    }));

    toast({
      title: "Página removida",
      description: "A página foi removida do projeto.",
      variant: "default",
    });
  };

  // New function to handle edit project
  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      ...project,
      date: typeof project.date === 'string' 
        ? project.date 
        : project.date instanceof Date 
          ? project.date.toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0],
    });
    setIsEditingProject(true);
    setIsAddingProject(false);
  };

  // New function to handle delete project
  const confirmDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      setSubmitting(true);
      
      // Find the project to get image URLs for deletion
      const projectToRemove = projects.find(p => p.id === projectToDelete);
      
      if (projectToRemove) {
        // Delete project image if exists
        if (projectToRemove.imageUrl) {
          const imageRef = projectToRemove.imageUrl.split('?')[0].split('/').pop();
          if (imageRef) {
            try {
              await deleteImage(`projects/${imageRef}`);
            } catch (error) {
              console.error("Error deleting project image:", error);
            }
          }
        }
        
        // Delete page images if exist
        if (projectToRemove.pages && projectToRemove.pages.length > 0) {
          for (const page of projectToRemove.pages) {
            if (page.imageUrl) {
              const pageImageRef = page.imageUrl.split('?')[0].split('/').pop();
              if (pageImageRef) {
                try {
                  await deleteImage(`pages/${pageImageRef}`);
                } catch (error) {
                  console.error("Error deleting page image:", error);
                }
              }
            }
          }
        }
      }
      
      // Delete the project document
      await deleteProject(projectToDelete);
      
      toast({
        title: "Projeto excluído com sucesso",
        description: "O projeto foi removido permanentemente.",
        variant: "default",
      });
      
      // Refresh the projects list
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Erro ao excluir projeto",
        description: "Não foi possível remover o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // Helper function to format date for display
  const formatDate = (dateValue: string | Date) => {
    if (typeof dateValue === "string") {
      return new Date(dateValue).toLocaleDateString();
    }
    return dateValue.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="min-h-screen py-16 bg-cyber-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-display text-neon-green">
              Painel Administrativo
            </h1>
            <button
              onClick={logout}
              className="cyber-button flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>

          <div className="tech-container mb-8">
            <div className="terminal-header border-b border-neon-green/30 mb-6 pb-2 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-neon-green/70 mr-2"></div>
                <div className="font-mono text-neon-green/70 text-sm">
                  admin_dashboard.js
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsAddingProject(true);
                    setIsEditingProject(false);
                    resetForm();
                  }}
                  className="cyber-button !py-1 !px-3 flex items-center gap-1 text-sm"
                  disabled={isAddingProject || isEditingProject}
                >
                  <PlusCircle size={16} />
                  Novo Projeto
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-10 flex justify-center">
                <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
              </div>
            ) : isAddingProject || isEditingProject ? (
              <div className="animate-fade-in">
                <h2 className="text-xl font-display text-neon-green mb-4">
                  {isEditingProject ? "Editar Projeto" : "Adicionar Novo Projeto"}
                </h2>
                <form onSubmit={handleAddProject}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-foreground/80 mb-2 font-mono"
                        >
                          Título do Projeto
                        </label>
                        <input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full bg-cyber-black border border-neon-green/30 rounded p-3 text-foreground font-mono"
                          placeholder="Nome do projeto"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="date"
                          className="block text-foreground/80 mb-2 font-mono"
                        >
                          Data de Criação
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={
                            typeof formData.date === "string"
                              ? formData.date
                              : formData.date instanceof Date
                                ? formData.date.toISOString().split("T")[0]
                                : new Date().toISOString().split("T")[0]
                          }
                          onChange={handleInputChange}
                          className="w-full bg-cyber-black border border-neon-green/30 rounded p-3 text-foreground font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-foreground/80 mb-2 font-mono"
                      >
                        Descrição
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full bg-cyber-black border border-neon-green/30 rounded p-3 text-foreground font-mono min-h-[100px]"
                        placeholder="Descreva o projeto"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="link"
                          className="block text-foreground/80 mb-2 font-mono"
                        >
                          Link do Projeto
                        </label>
                        <input
                          id="link"
                          name="link"
                          value={formData.link || ""}
                          onChange={handleInputChange}
                          className="w-full bg-cyber-black border border-neon-green/30 rounded p-3 text-foreground font-mono"
                          placeholder="https://exemplo.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="projectImage"
                          className="block text-foreground/80 mb-2 font-mono"
                        >
                          {isEditingProject && formData.imageUrl ? "Substituir Imagem do Projeto" : "Imagem do Projeto"}
                        </label>
                        {isEditingProject && formData.imageUrl && (
                          <div className="mb-2 flex items-center">
                            <img src={formData.imageUrl} alt={formData.title} className="h-16 border border-neon-green/20 rounded mr-2" />
                            <span className="text-xs text-foreground/70">Imagem atual</span>
                          </div>
                        )}
                        <input
                          type="file"
                          id="projectImage"
                          ref={projectImageRef}
                          onChange={handleProjectImageChange}
                          className="w-full bg-cyber-black border border-neon-green/30 rounded p-3 text-foreground font-mono"
                          accept="image/*"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-foreground/80 mb-2 font-mono">
                        Tecnologias
                      </label>
                      <div className="flex items-center">
                        <input
                          id="techInput"
                          value={techInput}
                          onChange={handleTechInputChange}
                          onKeyDown={handleTechKeyDown}
                          className="flex-grow bg-cyber-black border border-neon-green/30 rounded-l p-3 text-foreground font-mono"
                          placeholder="Adicionar tecnologia (pressione Enter)"
                        />
                        <button
                          type="button"
                          onClick={addTechnology}
                          className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/30 border-l-0 rounded-r p-3 font-mono"
                        >
                          Adicionar
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.technologies.map((tech, index) => (
                          <div
                            key={index}
                            className="bg-neon-green/10 border border-neon-green/30 rounded px-3 py-1 flex items-center gap-2"
                          >
                            <span className="text-neon-green text-sm">
                              {tech}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTechnology(index)}
                              className="text-foreground/70 hover:text-destructive"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-foreground/80 font-mono">
                          Páginas do Projeto
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingPage(true);
                            setIsEditingPage(false);
                          }}
                          className="cyber-button !py-1 !px-3 flex items-center gap-1 text-sm"
                        >
                          <PlusCircle size={16} />
                          Adicionar Página
                        </button>
                      </div>

                      {formData.pages.length > 0 ? (
                        <div className="space-y-3 mb-4">
                          {formData.pages.map((page, index) => (
                            <div
                              key={index}
                              className="border border-neon-green/20 rounded p-3 flex justify-between items-center"
                            >
                              <div>
                                <h4 className="text-neon-green font-mono">
                                  {page.name}
                                </h4>
                                <p className="text-foreground/70 text-sm truncate max-w-md">
                                  {page.features}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditPage(index)}
                                  className="text-neon-green/70 hover:text-neon-green"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removePage(index)}
                                  className="text-foreground/70 hover:text-destructive"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-neon-green/20 rounded mb-4">
                          <FileText className="w-10 h-10 text-neon-green/30 mx-auto mb-2" />
                          <p className="text-foreground/50">
                            Nenhuma página adicionada
                          </p>
                        </div>
                      )}

                      {isAddingPage && (
                        <div className="border border-neon-green/30 rounded p-4 mb-4 animate-fade-in">
                          <h4 className="text-neon-green font-mono mb-3">
                            Adicionar Página
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label
                                htmlFor="pageName"
                                className="block text-foreground/80 mb-1 font-mono text-sm"
                              >
                                Nome da Página
                              </label>
                              <input
                                id="pageName"
                                name="name"
                                value={currentPage.name}
                                onChange={handlePageInputChange}
                                className="w-full bg-cyber-black border border-neon-green/30 rounded p-2 text-foreground font-mono"
                                placeholder="Ex: Home, Dashboard, etc."
                                required
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="pageFeatures"
                                className="block text-foreground/80 mb-1 font-mono text-sm"
                              >
                                Funcionalidades
                              </label>
                              <textarea
                                id="pageFeatures"
                                name="features"
                                value={currentPage.features}
                                onChange={handlePageInputChange}
                                className="w-full bg-cyber-black border border-neon-green/30 rounded p-2 text-foreground font-mono min-h-[80px]"
                                placeholder="Descreva as funcionalidades desta página"
                                required
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="pageImage"
                                className="block text-foreground/80 mb-1 font-mono text-sm"
                              >
                                Imagem da Página
                              </label>
                              <input
                                type="file"
                                id="pageImage"
                                ref={pageImageRef}
                                onChange={handlePageImageChange}
                                className="w-full bg-cyber-black border border-neon-green/30 rounded p-2 text-foreground font-mono"
                                accept="image/*"
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingPage(false);
                                  resetPageForm();
                                }}
                                className="border border-neon-green/30 bg-transparent hover:bg-neon-green/10 text-foreground rounded px-3 py-1 font-mono text-sm"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={handleAddPage}
                                className="bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/30 text-neon-green rounded px-3 py-1 font-mono text-sm flex items-center gap-1"
                              >
                                <Save size={14} />
                                Adicionar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isEditingPage && (
                        <div className="border border-neon-green/30 rounded p-4 mb-4 animate-fade-in">
                          <h4 className="text-neon-green font-mono mb-3">
                            Editar Página
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label
                                htmlFor="pageName"
                                className="block text-foreground/80 mb-1 font-mono text-sm"
                              >
                                Nome da Página
                              </label>
                              <input
                                id="pageName"
                                name="name"
                                value={currentPage.name}
                                onChange={handlePageInputChange}
                                className="w-full bg-cyber-black border border-neon-green/30 rounded p-2 text-foreground font-mono"
                                placeholder="Ex: Home, Dashboard, etc."
                                required
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="pageFeatures"
                                className="block text-foreground/80 mb-1 font-mono text-sm"
                              >
                                Funcionalidades
                              </label>
                              <textarea
                                id="pageFeatures"
                                name="features"
                                value={currentPage.features}
                                onChange={handlePageInputChange}
                                className="w-full bg-cyber-black border border-neon-green/30 rounded p-2 text-foreground font-mono min-h-[80px]"
                                placeholder="Descreva as funcionalidades desta página"
                                required
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="pageImage"
                                className="block text-foreground/80 mb-1 font-mono text-sm"
                              >
                                Imagem da Página
                              </label>
                              {currentPage.imageUrl && (
                                <div className="mb-2 border border-neon-green/20 p-1 inline-block rounded">
                                  <img
                                    src={currentPage.imageUrl}
                                    alt={currentPage.name}
                                    className="h-20 object-cover rounded"
                                  />
                                </div>
                              )}
                              <input
                                type="file"
                                id="pageImage"
                                ref={pageImageRef}
                                onChange={handlePageImageChange}
                                className="w-full bg-cyber-black border border-neon-green/30 rounded p-2 text-foreground font-mono"
                                accept="image/*"
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsEditingPage(false);
                                  setEditingPageIndex(null);
                                  resetPageForm();
                                }}
                                className="border border-neon-green/30 bg-transparent hover:bg-neon-green/10 text-foreground rounded px-3 py-1 font-mono text-sm"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={handleEditPage}
                                className="bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/30 text-neon-green rounded px-3 py-1 font-mono text-sm flex items-center gap-1"
                              >
                                <Save size={14} />
                                Salvar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={handleCancelAddProject}
                      className="cyber-button !bg-transparent"
                      disabled={submitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="cyber-button"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Salvando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save size={16} />
                          {isEditingProject ? "Atualizar Projeto" : "Salvar Projeto"}
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                {projects.length > 0 ? (
                  <div className="space-y-6">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="border border-neon-green/20 rounded p-4 hover:border-neon-green/40 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {project.imageUrl && (
                            <div className="md:w-1/4">
                              <div className="aspect-video border border-neon-green/10 rounded overflow-hidden">
                                <img
                                  src={project.imageUrl}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}

                          <div
                            className={project.imageUrl ? "md:w-3/4" : "w-full"}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-neon-green font-display text-xl">
                                {project.title}
                              </h3>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditProject(project)}
                                  className="text-neon-green/70 hover:text-neon-green transition-colors p-1"
                                  title="Editar projeto"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => confirmDeleteProject(project.id || '')}
                                  className="text-foreground/60 hover:text-red-500 transition-colors p-1"
                                  title="Excluir projeto"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs text-foreground/60 mb-3">
                              <div className="flex items-center">
                                <Calendar size={12} className="mr-1" />
                                {formatDate(project.date)}
                              </div>

                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-neon-green/70 hover:text-neon-green"
                                >
                                  <LinkIcon size={12} className="mr-1" />
                                  Visualizar
                                </a>
                              )}

                              <div className="flex items-center">
                                <FileText size={12} className="mr-1" />
                                {project.pages?.length || 0} páginas
                              </div>
                            </div>

                            <p className="text-foreground/70 text-sm line-clamp-2 mb-3">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.technologies?.map((tech, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-0.5 rounded bg-neon-green/10 text-neon-green/80 border border-neon-green/20 font-mono"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Code className="w-16 h-16 text-neon-green/30 mx-auto mb-4" />
                    <p className="text-foreground/70 mb-4">
                      Nenhum projeto cadastrado
                    </p>
                    <button
                      onClick={() => setIsAddingProject(true)}
                      className="cyber-button"
                    >
                      Adicionar Projeto
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-cyber-dark border border-neon-green/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neon-green font-display">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/70">
              Esta ação irá excluir permanentemente o projeto e todas as suas imagens.
              Essa operação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 mt-4">
            <AlertDialogCancel 
              className="border border-neon-green/30 bg-transparent hover:bg-neon-green/10 text-foreground"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-900/40 hover:bg-red-800/60 border border-red-500/50 text-red-200"
              onClick={handleDeleteProject}
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Excluindo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 size={14} />
                  Excluir
                </div>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminPage;

