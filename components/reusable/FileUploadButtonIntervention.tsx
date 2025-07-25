import { useEffect, useState } from "react";

const FileUploadButtonIntervention = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [userRole, setUserRole] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setErrorMessage(null); // Réinitialiser le message d'erreur si un fichier est sélectionné
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Veuillez sélectionner un fichier à télécharger.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/intervention/uploadData", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec du téléchargement du fichier");
      }

      const data = await response.json();
      alert("Fichier téléchargé avec succès !");
      console.log("Données téléchargées :", data);
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier :", error);
      setErrorMessage("Une erreur s'est produite lors du téléchargement du fichier.");
    }
  };

    useEffect(() => {
      // Load the role from sessionStorage when the page loads
      const role = sessionStorage.getItem("role");
      setUserRole(role);
    }, []);

  const handleClick = (e) => {
    console.log("userRole", userRole);
    e.preventDefault(); // Prevent default form submission
    if (userRole === "collaborator") {
      window.location.href = "/collaborator/sav/liste-intervention";
    } else if (userRole === "admin") {
      window.location.href = "/admin/sav/liste-intervention";
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      {/* Entrée de fichier avec style personnalisé */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Choisissez un fichier Excel</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full text-gray-700 bg-transparent p-2 rounded-md"
        />
      </div>

      {/* Affichage du fichier sélectionné */}
      {selectedFile && (
        <div className="text-gray-700 mt-2">
          <span className="font-semibold">Fichier sélectionné :</span> {selectedFile.name}
        </div>
      )}

      {/* Affichage du message d'erreur */}
      {errorMessage && (
        <div className="text-red-500 text-sm">
          <span className="font-semibold">Erreur :</span> {errorMessage}
        </div>
      )}

      {/* Bouton de téléchargement */}
      <div className="w-full flex gap-2">
        <button
          onClick={handleUpload}
          className="w-1/2 bg-[#255D74] text-white py-2 rounded-md mt-4 hover:bg-white hover:text-[#255D74] hover:border hover:border-[#255D74] transition-colors duration-300 text-sm"
        >
          Télécharger le fichier Excel
        </button>
        <button
          onClick={handleClick}
          className="w-1/2 bg-white border border-[#255D74] text-[#255D74] py-2 rounded-md mt-4 hover:bg-[#255D74]  hover:text-white transition-colors duration-300"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default FileUploadButtonIntervention;
