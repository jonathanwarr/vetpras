export function isAdmin(userOrEmail) {
  const email =
    typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email;

  if (!email) return false;

  const list = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const admins = list
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return admins.includes(email.toLowerCase());
}
