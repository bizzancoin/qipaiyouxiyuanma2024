import Cookies from 'js-cookie'
import store from '@/store'

const RoleKey = 'Admin-Role'

export function getRole() {
  return Cookies.get(RoleKey);
}

export function setRole(role) {
  return Cookies.set(RoleKey, role);
}

export function removeRole() {
  return Cookies.remove(RoleKey)
}

export function hasUrlPermission(permission, role, mcode) {
  if (role === 2) return true; // 超级admin权限 直接通过
  if (!mcode) return true;
  return permission.some(code => mcode === code);
}

export function hasPermission(mcode) {
 return hasUrlPermission(store.getters.permission, store.getters.role,mcode);
}
