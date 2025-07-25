import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logo/LOGO-long-black.png'

const Logo: React.FC = () => {
  return (
    <Link href="/Accueil">
        <Image className=''
          src={logo}
          alt="Logo"
          width={100}
          height={50}
        />
    </Link>
  );
};

export default Logo;

