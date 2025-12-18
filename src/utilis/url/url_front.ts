export const ITEMS_PER_PAGE = 20;

export const ROLES = {
  admin: 'admin',
  landlord: 'landlord',
  user: 'user',
} as const;

export const URL = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },
  
  public: {
    home: '/',
    properties: '/public/properties/list',
    propertyDetail: (id: string) => `/public/properties/detail/${id}`,
    favorites: '/public/favorites',
    about: '/public/about',
    contact: '/public/contact',
    faq: '/public/faq',
  },
  
  app: {
    dashboard: '/public/properties/list',
    profile: '/application/profile',
    settings: '/app/settings',
    messages: '/app/messages',
  },  
  
  landlord: {
    dashboard: '/landlord/dashboard',
    properties: '/landlord/properties/list',
    addProperty: '/landlord/properties/add',
    editProperty: (id: string) => `/landlord/properties/edit/${id}`,
    bookings: '/landlord/bookings',
    finances: '/landlord/finances',
  },

  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users/list',
    addUser: '/admin/users/add',
    editUser: (id: string) => `/admin/users/edit/${id}`,
    properties: '/admin/properties/list',
    addProperties: '/admin/properties/add',
    // reports: '/admin/reports',
  }
} as const;

export default URL;