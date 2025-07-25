'use server';
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export const getUserInfo = async () => {
  try {
    const roleStatus = getCookie("role", { cookies });
    const sessionStatus = getCookie("isLoggedIn", { cookies });
    const name = getCookie("name", { cookies });
    const lastname = getCookie("lastname", { cookies });
    const email = getCookie("email", { cookies });
    const phone = getCookie("phone", { cookies });
    const company = getCookie("entreprise", { cookies });
    const id = getCookie("id", { cookies });
    const token = getCookie("token", { cookies });

    // Checking:
    console.log(`User Info: {
        id: ${id},
        token: ${token},
        nom: ${name},
        prenom: ${lastname},
        email: ${email},
        phone: ${phone},
        company: ${company},
        role: ${roleStatus},
        sessionStatus: ${sessionStatus}
    }`);

    return {
      id,
      token,
      name,
      lastname,
      email,
      phone,
      company,
      roleStatus,
      sessionStatus,
    };
  } catch (error) {
    console.error("Error retrieving user info:", error);
    throw error;
  }
};
