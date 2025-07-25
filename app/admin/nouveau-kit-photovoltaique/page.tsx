'use client'
import { KitForm } from "@/components/auth/ajouter-kit-form";
import BannerTitle from "@/components/reusable/BannerTitle";
import Title from "@/components/reusable/BigTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";


const Page = () => {
    //const [file, setFile] = useState<File | null>(null);
    const breadcrumbPaths = [
        { name: "Accueil", url: "/admin/mon-compte" },
        { name: "Mon compte", url: "/admin/mon-compte" },
        { name: "Ajouter des kits photovoltaïque", url: "#" },
    ];

    return (
        <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
            <BannerTitle tile={"Ajouter des kits photovoltaïque"} paragraph={""} />

            <Breadcrumb paths={breadcrumbPaths} />
            <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
                <div className="flex justify-center mx-auto">
                    <Title>Ajouter des kits photovoltaïque</Title>
                </div>
                <KitForm />
            </div>
        </div>
    );
};

export default Page;
