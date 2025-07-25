'use client'
import { UserAuthForm } from "@/components/auth/user-auth-form";
import BannerTitle from "@/components/reusable/BannerTitle";
import Title from "@/components/reusable/BigTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
//import axios from 'axios';
//import { useState } from 'react';

const Page = () => {
    //const [file, setFile] = useState<File | null>(null);
    const breadcrumbPaths = [
        { name: "Accueil", url: "/admin/mon-compte" },
        { name: "Mon compte", url: "/admin/mon-compte" },
        { name: "Ajouter un Client", url: "#" },
    ];

    /*const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!file) return;

        const creatorId = sessionStorage.getItem("id");
        if (!creatorId) {
            alert('Erreur: Identifiant du créateur introuvable.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('creatorId', creatorId);

        try {
            const response = await axios.post('/api/admin/uploadClients', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                console.log("response.data.success", response.data.success)
                alert('Clients ajoutés avec succès.');
            }
        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier:', error);
            alert('Erreur lors du téléchargement du fichier.');
        }
    };*/

    return (
        <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
            <BannerTitle tile={"Ajouter un Client"} paragraph={""} />

            <Breadcrumb paths={breadcrumbPaths} />
            <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
                <div className="flex justify-center mx-auto">
                    <Title>Créer un nouveau client</Title>
                </div>
                <UserAuthForm />
                {/*<div className="mt-6">
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleFileUpload} className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
                        Importer des clients
                    </button>
                </div>*/}
            </div>
        </div>
    );
};

export default Page;
