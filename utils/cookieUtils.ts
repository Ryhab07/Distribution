// cookieUtils.ts
import { parse } from 'cookie';

export const getCookie = (reqHeaders: any, cookieName: string): string | undefined => {
  const cookies = parse(reqHeaders.cookie || '');
  return cookies[cookieName];
};

export const getSessionStatus = (reqHeaders: any): string | undefined => {
  const cookies = parse(reqHeaders.cookie || '');
  return cookies['isLoggedIn'];
};

export const getRoleStatus = (reqHeaders: any): string | undefined => {
    const cookies = parse(reqHeaders.cookie || '');
    return cookies['role'];
  };
  
