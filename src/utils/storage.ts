import {
  NetworkLab,
  NetworkProject,
  TroubleshootingItem,
  CommandItem,
  BlogPost,
  Certification,
  ContactMessage,
} from '../types/network';
import {
  INITIAL_LABS,
  INITIAL_PROJECTS,
  INITIAL_TROUBLESHOOTING,
  INITIAL_COMMANDS,
  INITIAL_BLOG_POSTS,
  INITIAL_CERTIFICATIONS,
} from '../data/initialData';

const STORAGE_KEYS = {
  LABS: 'afzal_net_labs',
  PROJECTS: 'afzal_net_projects',
  BLOGS: 'afzal_net_blogs',
  CERTS: 'afzal_net_certs',
  MESSAGES: 'afzal_net_messages',
};

export const getStoredLabs = (): NetworkLab[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.LABS);
    return item ? JSON.parse(item) : INITIAL_LABS;
  } catch {
    return INITIAL_LABS;
  }
};

export const saveStoredLabs = (labs: NetworkLab[]) => {
  localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labs));
};

export const getStoredProjects = (): NetworkProject[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return item ? JSON.parse(item) : INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
};

export const saveStoredProjects = (projects: NetworkProject[]) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const getStoredBlogs = (): BlogPost[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.BLOGS);
    return item ? JSON.parse(item) : INITIAL_BLOG_POSTS;
  } catch {
    return INITIAL_BLOG_POSTS;
  }
};

export const saveStoredBlogs = (blogs: BlogPost[]) => {
  localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
};

export const getStoredCerts = (): Certification[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.CERTS);
    return item ? JSON.parse(item) : INITIAL_CERTIFICATIONS;
  } catch {
    return INITIAL_CERTIFICATIONS;
  }
};

export const saveStoredCerts = (certs: Certification[]) => {
  localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(certs));
};

export const getStoredMessages = (): ContactMessage[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return item
      ? JSON.parse(item)
      : [
          {
            id: 'msg-demo-1',
            name: 'Sarah Jenkins',
            email: 's.jenkins@enterprise-tech.corp',
            subject: 'Opportunity: Senior Network Infrastructure Specialist',
            message:
              'Hi Afzal, We came across your Cisco & Palo Alto lab work and were very impressed with your enterprise routing projects. We are currently looking for a Network Engineer to lead our infrastructure redesign. Let us schedule a call this week!',
            createdAt: '2026-09-22 14:32',
            read: false,
          },
        ];
  } catch {
    return [];
  }
};

export const saveStoredMessages = (messages: ContactMessage[]) => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.LABS);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.BLOGS);
  localStorage.removeItem(STORAGE_KEYS.CERTS);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
};
