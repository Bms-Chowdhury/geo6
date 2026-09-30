import { UserRole, PermissionKey, AppUser } from '../types';

export const ALL_PERMISSIONS: PermissionKey[] = [
  'articles.create',
  'articles.read',
  'articles.update',
  'articles.delete',
  'articles.publish',
  'articles.unpublish',
  'articles.schedule',
  'articles.reschedule',
  'articles.archive',
  'articles.restore',
  'articles.permanent_delete',
  'articles.manage_all',
  'revisions.read',
  'revisions.create',
  'revisions.restore',
  'revisions.manage_all',
  'media.create',
  'media.read',
  'media.update',
  'media.delete',
  'media.manage_all',
  'categories.create',
  'categories.read',
  'categories.update',
  'categories.delete',
  'categories.manage_all',
  'tags.create',
  'tags.read',
  'tags.update',
  'tags.delete',
  'tags.manage_all',
  'authors.create',
  'authors.read',
  'authors.update',
  'authors.delete',
  'authors.manage_all',
  'comments.read',
  'comments.moderate',
  'comments.delete',
  'comments.restore',
  'comments.manage_all',
  'users.create',
  'users.read',
  'users.update',
  'users.disable',
  'users.delete',
  'users.manage_all',
  'roles.read',
  'roles.assign',
  'roles.update',
  'roles.manage',
  'settings.read',
  'settings.update',
  'seo.read',
  'seo.update',
  'feeds.read',
  'feeds.manage',
  'ads.create',
  'ads.read',
  'ads.update',
  'ads.delete',
  'ads.manage',
  'sponsors.create',
  'sponsors.read',
  'sponsors.update',
  'sponsors.delete',
  'sponsors.manage',
  'editorial.read',
  'editorial.update',
  'corrections.create',
  'corrections.read',
  'corrections.update',
  'corrections.delete',
  'audit_logs.read',
  'audit_logs.export',
  'security.read',
  'security.manage',
  'system.read',
  'system.manage'
];

export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: ALL_PERMISSIONS,
  admin: [
    'articles.create',
    'articles.read',
    'articles.update',
    'articles.delete',
    'articles.publish',
    'articles.unpublish',
    'articles.schedule',
    'articles.reschedule',
    'articles.archive',
    'articles.restore',
    'revisions.read',
    'revisions.create',
    'media.create',
    'media.read',
    'media.update',
    'media.delete',
    'categories.read',
    'tags.read',
    'authors.read',
    'comments.read',
    'comments.moderate',
    'ads.read',
    'editorial.read',
    'corrections.create',
    'corrections.read'
  ]
};

/**
 * Future-proof permission check helper:
 * Evaluates whether a user account has the required permission.
 * Denies by default if user is inactive or permission is not explicitly granted.
 */
export function hasPermission(user: AppUser | null | undefined, permission: PermissionKey): boolean {
  if (!user || !user.active) {
    return false;
  }
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr_super_m2',
    email: 'm2bmsbabu@gmail.com',
    name: 'M2 Babu',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    active: true,
    title: 'Editor-in-Chief & Super Admin',
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: '2026-09-19T20:00:00.000Z'
  },
  {
    id: 'usr_admin_niaong',
    email: 'niaongprumarma2001@gmail.com',
    name: 'Niaong Pru Marma',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    active: true,
    title: 'Senior Newsroom Admin',
    createdAt: '2026-02-10T10:30:00.000Z',
    lastLogin: '2026-09-19T19:15:00.000Z'
  },
  {
    id: 'usr_admin_doly',
    email: 'dolymarma521@gmail.com',
    name: 'Doly Marma',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    active: true,
    title: 'Newsroom Admin & Content Editor',
    createdAt: '2026-03-01T12:00:00.000Z',
    lastLogin: '2026-09-19T18:20:00.000Z'
  }
];
