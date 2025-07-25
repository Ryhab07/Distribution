import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SuccessCard() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] opacity-100 z-[9999] flex justify-center items-center">
      <div className="relative z-20">
        <Card className="w-[350px] opacity-100">
          <CardHeader>
            <CardTitle>Votre demande a été envoyée avec succès.</CardTitle>
          </CardHeader>
          <CardContent>
            Félicitations! Votre demande a été traitée avec succès . Nous vous
            remercions pour votre contribution à notre plateforme. Si vous avez
            d&apos;autres demandes ou besoins administratifs, n&apos;hésitez pas
            à nous contacter. Nous sommes là pour vous aider et assurer une
            expérience utilisateur optimale.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
