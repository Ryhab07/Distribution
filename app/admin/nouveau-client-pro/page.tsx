'use client'
import { UserAuthProForm } from "@/components/auth/user-auth-pro-form";
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
        { name: "Ajouter un Client Pro", url: "#" },
    ];


    return (
        <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
            <BannerTitle tile={"Ajouter un Client Pro"} paragraph={""} />

            <Breadcrumb paths={breadcrumbPaths} />
            <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
                <div className="flex justify-center mx-auto">
                    <Title>Créer un nouveau client Pro</Title>
                </div>
                <UserAuthProForm />
            </div>
        </div>
    );
};

export default Page;
