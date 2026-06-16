"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/Button";

const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

interface Project {
    id: number;
    title: string;
    description: string;
    tags: string[] | string;
    live_url?: string;
    repo_url?: string;
    image_url?: string[];
    project_type: "web" | "mobile" | "desktop" | "other";
    active?: boolean;
}

interface Image {
    id: string;
    project_id: string;
    file_path: string;
    original_name: string;
    file_size: number;
    width: number;
    height: number;
    display_order: number;
    uploaded_at: string;
}

interface ProjectCreateFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function ProjectCreateForm({ onClose, onSuccess }: ProjectCreateFormProps) {
    // Estados del formulario
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: [] as string[],
        live_url: "",
        repo_url: "",
        image_url: [] as string[],
        project_type: "web",
    });
    const [newTag, setNewTag] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");

    // Estados de control
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("projects");
    const [projects, setProjects] = useState<Project[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [projectImages, setProjectImages] = useState<Image[]>([]);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
    const [actionMessage, setActionMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    //Estados para manejo de imágenes
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageOrder, setImageOrder] = useState(0);

    // Fetch proyectos al montar (solo si está autenticado)
    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
        }
    }, [isAuthenticated]);

    // Fetch imágenes al montar 
    useEffect(() => {
        if (activeTab === "images") {
            
            fetchProjectImages();
        }
    }, [activeTab]);

    // Agregar después de los useState:
    useEffect(() => {
        if (BYPASS_AUTH) {
            setIsAuthenticated(true);
        }
    }, []);

    const fetchProjectImages = async () => {
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getAllImages`);
            if (res.ok) {
                const data = await res.json();
                setProjectImages(data);
            }
        } catch (err) {
            console.error("Error fetching project images:", err);
        }
    };

    const fetchProjects = async () => {

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
                console.log("Fetched projects:", data);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    // Eliminar imagen
    const handleDeleteImage = async (imageId: string) => {
        setDeletingImageId(imageId);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteImage/${imageId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete image");

            // Actualizar estado local removiendo la imagen eliminada
            setProjectImages(prev => prev.filter(img => img.id !== imageId));
            setActionMessage({ type: "success", text: "Imagen eliminada exitosamente" });
            setTimeout(() => setActionMessage(null), 3000);

        } catch (err) {
            setActionMessage({ type: "error", text: err instanceof Error ? err.message : "Error al eliminar imagen" });
            setTimeout(() => setActionMessage(null), 3000);
        } finally {
            setDeletingImageId(null);
        }
    };

    // Agregar imagen
    const handleUploadImage = async () => {

        console.log("Iniciando subida de imagen:", imageFile, "Orden:", imageOrder);

        if (!imageFile) {
            setError("Selecciona una imagen para subir");
            return;
        }

        const formDataImg = new FormData();
        formDataImg.append("image", imageFile);  // ✅ Cambiar a "image"
        formDataImg.append("original_name", imageFile.name);
        formDataImg.append("project_id", editingProject?.id?.toString() || "");  // ✅ Asegurar string
        formDataImg.append("display_order", imageOrder.toString());  // ✅ Cambiar a "display_order"

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadImage`, {
                method: "POST",
                body: formDataImg,
            });

            if (!res.ok) throw new Error("Failed to upload image");

            setImageFile(null);
            setImageOrder(0);
            setShowImageModal(false);

            // Refrescar lista de imágenes

            fetchProjectImages()


        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al subir imagen");
        }
    };

    // Manejar cambios en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Validar contraseña
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) throw new Error("Invalid password");

            setIsAuthenticated(true);
            fetchProjects();

        } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    // Submit del formulario (crear o editar)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const url = editingProject
                ? `${process.env.NEXT_PUBLIC_API_URL}/updateProject/${editingProject.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/addProject`;

            const method = editingProject ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    tags: formData.tags,
                    live_url: formData.live_url,
                    repo_url: formData.repo_url,
                    image_url: formData.image_url,
                    project_type: formData.project_type,
                }),
            });

            if (!res.ok) throw new Error("Failed to save project");

            setActionMessage({ type: "success", text: editingProject ? "Proyecto actualizado exitosamente" : "Proyecto creado exitosamente" });
            setTimeout(() => setActionMessage(null), 3000);
            setTimeout(() => {
                setFormData({
                    title: "",
                    description: "",
                    tags: [],
                    live_url: "",
                    repo_url: "",
                    image_url: [],
                    project_type: "web",
                });
            }, 500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    // Editar proyecto
    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            tags: typeof project.tags === 'string' ? project.tags.split(',') : project.tags,
            live_url: project.live_url || "",
            repo_url: project.repo_url || "",
            image_url: typeof project.image_url === 'string' ? [project.image_url] : (project.image_url || []),
            project_type: project.project_type,
        });
        setActiveTab("form");
    };

    // Eliminar proyecto
    const handleDelete = async () => {
        if (!projectToDelete) return;

        const id = projectToDelete;
        setShowDeleteModal(false);
        setProjectToDelete(null);
        setDeletingProjectId(id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteProject/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete project");

            setActionMessage({ type: "success", text: "Proyecto eliminado exitosamente" });
            setTimeout(() => setActionMessage(null), 3000);
            fetchProjects();
        } catch (err) {
            setActionMessage({ type: "error", text: err instanceof Error ? err.message : "Error al eliminar" });
            setTimeout(() => setActionMessage(null), 3000);
        } finally {
            setDeletingProjectId(null);
        }
    };

    const confirmDelete = (id: number) => {
        setProjectToDelete(id);
        setShowDeleteModal(true);
    };

    // Vista de autenticación 
    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <form onSubmit={handlePasswordSubmit} className="bg-card p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Acceso al Panel de Proyectos</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full px-3 py-2 border rounded mb-4"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Verificando..." : "Acceder"}
                    </Button>
                </form>
            </div>
        );
    }

    // Vista principal con tabs
    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">

                    {/* Header con tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab("projects")}
                            className={`px-4 py-3 text-sm font-medium ${activeTab === "projects"
                                ? "border-b-2 border-accent text-accent"
                                : "text-muted hover:text-foreground"
                                }`}
                        >
                            Proyectos
                        </button>

                        <button
                            onClick={() => setActiveTab("images")}
                            className={`px-4 py-3 text-sm font-medium ${activeTab === "images"
                                ? "border-b-2 border-accent text-accent"
                                : "text-muted hover:text-foreground"
                                }`}
                        >
                            Imágenes
                        </button>

                        <button
                            onClick={() => {
                                setActiveTab("form");
                                setEditingProject(null);
                                setFormData({
                                    title: "",
                                    description: "",
                                    tags: [],
                                    live_url: "",
                                    repo_url: "",
                                    image_url: [],
                                    project_type: "web",
                                });
                            }}
                            className={`px-4 py-3 text-sm font-medium ${activeTab === "form"
                                ? "border-b-2 border-accent text-accent"
                                : "text-muted hover:text-foreground"
                                }`}
                        >
                            {editingProject ? "Editar Proyecto" : "Agregar Proyecto"}
                        </button>
                    </div>

                    {/* Contenido de tabs */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {activeTab === "projects" ? (
                            // Tabla de proyectos
                            <div>
                                {projects.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted">No hay proyectos</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Título</th>
                                                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Etiquetas</th>
                                                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Tipo</th>
                                                    <th className="text-center py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Activo</th>
                                                    <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {projects.map((project, index) => (
                                                    <tr
                                                        key={project.id || `project-${index}`}
                                                        className={`border-b border-border transition-colors hover:bg-accent/5 ${index % 2 === 0 ? 'bg-card/50' : ''
                                                            }`}
                                                    >
                                                        <td className="py-4 px-2">
                                                            <div>
                                                                <p className="font-medium text-foreground">{project.title}</p>
                                                                {project.description && (
                                                                    <p className="text-sm text-muted line-clamp-1 mt-0.5">{project.description}</p>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <div className="flex flex-wrap gap-1">
                                                                {typeof project.tags === 'string'
                                                                    ? project.tags.split(',').map((tag, i) => (
                                                                        <span
                                                                            key={`${project.id}-tag-${i}`}
                                                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
                                                                        >
                                                                            {tag.trim()}
                                                                        </span>
                                                                    ))
                                                                    : project.tags.map((tag, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-foreground/5 text-foreground">
                                                                {project.project_type}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-2 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.active
                                                                ? 'bg-green-500/10 text-green-600'
                                                                : 'bg-red-500/10 text-red-600'
                                                                }`}>
                                                                {project.active ? 'Sí' : 'No'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-2 text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEdit(project)}
                                                                className="mr-2"
                                                            >
                                                                Editar
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => confirmDelete(project.id)}
                                                                 disabled={deletingProjectId === project.id}
                                                            >
                                                                 {deletingProjectId === project.id ? "Eliminando..." : "Eliminar"}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === "images" ? (
                            // Tabla de imágenes
                            <div>
                                {projectImages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted">No hay imágenes en este proyecto</p>
                                        <Button
                                            type="button"
                                            onClick={() => setShowImageModal(true)}
                                            className="mt-4"
                                        >
                                            Agregar Imagen
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">

                                        {/* Botón para agregar imagen - arriba de la tabla */}
                                        <div className="mb-4 flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Imágenes del proyecto</h3>
                                            <Button
                                                type="button"
                                                onClick={() => setShowImageModal(true)}
                                                className="flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Agregar una nueva imagen
                                            </Button>
                                        </div>

                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Preview</th>
                                                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Nombre original</th>
                                                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Tamaño</th>
                                                    <th className="text-center py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Orden</th>
                                                    <th className="text-right py-3 px-2 text-xs font-semibold text-muted uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projectImages.sort((a, b) => a.display_order - b.display_order).map((image) => (
                                                    <tr
                                                        key={image.id}
                                                        className="border-b border-border transition-colors hover:bg-accent/5"
                                                    >
                                                        <td className="py-4 px-2">
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.file_path}`}
                                                                alt={image.original_name}
                                                                className="h-16 w-16 object-cover rounded-md"
                                                            />
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <p className="font-medium text-foreground">{image.original_name}</p>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <p className="text-sm text-muted">{(image.file_size / 1024).toFixed(2)} KB</p>
                                                        </td>
                                                        <td className="py-4 px-2 text-center">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-foreground/5 text-foreground">
                                                                {image.display_order}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-2 text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDeleteImage(image.id)}
                                                             // disabled={deletingImageId === image.id} #TODO Volver a activar esto cuando se validen que no hay ids repetidos
                                                            >
                                                                 {deletingImageId === image.id ? "Eliminando..." : "Eliminar"}
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                        ) : (
                            // Formulario
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h2 className="text-lg font-semibold mb-4">
                                    {editingProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Título</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Título del proyecto"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Descripción</label>
                                    <textarea
                                        name="description"
                                        placeholder="Descripción del proyecto"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tipo de proyecto</label>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant={formData.project_type === "web" ? "outline" : "primary"}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, project_type: "web", live_url: prev.live_url || "", repo_url: prev.repo_url || "" }));
                                                }}
                                                className="flex-1"
                                            >
                                                Web
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={formData.project_type === "web" ? "outline" : "primary"}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, project_type: "other", live_url: "", repo_url: "" }));
                                                }}
                                                className="flex-1"
                                            >
                                                Otro
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tags</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Agregar tag"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && newTag.trim()) {
                                                        setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
                                                        setNewTag("");
                                                    }
                                                }}
                                                className="flex-1 px-3 py-2 border rounded"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (newTag.trim()) {
                                                        setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
                                                        setNewTag("");
                                                    }
                                                }}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-accent/10 text-accent"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, idx) => idx !== i) })}
                                                        className="hover:text-red-500"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={formData.project_type !== "web" ? "hidden" : ""}>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">URL del proyecto</label>
                                        <input
                                            type="text"
                                            name="live_url"
                                            placeholder="https://ejemplo.com"
                                            value={formData.live_url}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">URL del repositorio</label>
                                        <input
                                            type="text"
                                            name="repo_url"
                                            placeholder="https://github.com/usuario/repo"
                                            value={formData.repo_url}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? "Guardando..." : editingProject ? "Actualizar" : "Crear Proyecto"}
                                    </Button>
                                    <Button type="button" onClick={onClose} variant="outline">
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para agregar imagen al proyecto */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-3">Agregar Imagen al Proyecto</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Seleccionar proyecto</label>
                            <select
                                value={editingProject?.id || ""}
                                required
                                onChange={(e) => {
                                    const projectId = parseInt(e.target.value);
                                    const selected = projects.find(p => p.id === projectId) || null;
                                    setEditingProject(selected);
                                }}
                                className="w-full px-3 py-2 border rounded"

                            >
                                <option value="" disabled>Selecciona un proyecto</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.title}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Seleccionar archivo</label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        // Trigger file input click
                                        const fileInput = document.getElementById('image-file-input') as HTMLInputElement;
                                        fileInput?.click();
                                    }}
                                >
                                    Seleccionar imagen
                                </Button>
                                {imageFile && (
                                    <span className="text-sm text-muted self-center truncate max-w-xs">
                                        {imageFile.name}
                                    </span>
                                )}
                            </div>
                            <input
                                id="image-file-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="hidden"
                            />

                            {/* Vista previa de la imagen */}
                            {imageFile && (
                                <div className="mt-3">
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Vista previa"
                                        className="h-24 w-24 object-cover rounded-md border"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Orden de la imagen</label>
                            <input
                                type="number"
                                value={imageOrder}
                                onChange={(e) => setImageOrder(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setShowImageModal(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    // console.log("Subiendo imagen:", imageFile, "Orden:", imageOrder);
                                    handleUploadImage();
                                }}
                                disabled={!imageFile}
                            >
                                Subir Imagen
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-3">¿Eliminar proyecto?</h3>
                        <p className="text-muted mb-4">Esta acción no se puede deshacer. ¿Estás seguro?</p>
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </Button>
                            <Button type="button" variant="destructive" onClick={handleDelete}>
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast notification */}
            {actionMessage && (
                <div className={`fixed bottom-4 right-4 z-[70] px-4 py-3 rounded-lg shadow-lg ${actionMessage.type === "success" ? "bg-green-500" : "bg-red-500"
                    } text-white`}>
                    {actionMessage.text}
                </div>
            )}
        </>
    );
}
