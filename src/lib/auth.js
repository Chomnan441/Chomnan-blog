const USERS_KEY = "chomnan_blog_users";
const SESSION_KEY = "chomnan_blog_session";

export const DEFAULT_AVATAR = "/default-avatar.svg";
export const USER_ROLE = "user";
export const ADMIN_ROLE = "admin";

const SEED_USERS = [
  {
    id: "seed-1",
    name: "Moodeng ja",
    username: "moodeng.cute",
    email: "moodeng.cute@gmail.com",
    password: "12345678",
    avatar: DEFAULT_AVATAR,
    role: USER_ROLE,
    bio: "",
  },
  {
    id: "seed-admin",
    name: "Chomnan Phokhawatchanan",
    username: "chomnan.admin",
    email: "admin@chomnan.blog",
    password: "admin1234",
    avatar: DEFAULT_AVATAR,
    role: ADMIN_ROLE,
    bio: "I am a pet enthusiast and freelance writer who loves exploring animal behavior and storytelling.",
  },
];

function normalizeRole(role) {
  return role === ADMIN_ROLE ? ADMIN_ROLE : USER_ROLE;
}

function normalizeUser(user) {
  return {
    ...user,
    role: normalizeRole(user.role),
    bio: typeof user.bio === "string" ? user.bio : "",
  };
}

export function isAdmin(user) {
  return normalizeRole(user?.role) === ADMIN_ROLE;
}

function mergeSeedUsers(users) {
  const merged = users.map(normalizeUser);

  for (const seed of SEED_USERS) {
    const index = merged.findIndex((user) => user.id === seed.id);
    if (index === -1) {
      merged.push(seed);
    } else {
      merged[index] = normalizeUser({
        ...merged[index],
        role: seed.role,
        bio: merged[index].bio || seed.bio || "",
      });
    }
  }

  return merged;
}

function readUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  let users;

  if (stored) {
    try {
      users = JSON.parse(stored);
    } catch {
      users = [...SEED_USERS];
    }
  } else {
    users = [...SEED_USERS];
  }

  const merged = mergeSeedUsers(Array.isArray(users) ? users : [...SEED_USERS]);
  localStorage.setItem(USERS_KEY, JSON.stringify(merged));
  return merged;
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateSignUpFields({ name, username, email, password }) {
  const errors = {};
  const users = readUsers();

  if (!name.trim()) {
    errors.name = "Name is required";
  }

  if (!username.trim()) {
    errors.username = "Username is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email must be a valid email";
  } else if (
    users.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
    )
  ) {
    errors.email = "Email is already taken, Please try another email.";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export function registerUser({ name, username, email, password }) {
  const users = readUsers();
  const newUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
    avatar: DEFAULT_AVATAR,
    role: USER_ROLE,
    bio: "",
  };

  users.push(newUser);
  writeUsers(users);

  return toPublicUser(newUser);
}

export function authenticateUser(email, password) {
  const users = readUsers();
  const user = users.find(
    (entry) =>
      entry.email.toLowerCase() === email.trim().toLowerCase() &&
      entry.password === password,
  );

  if (!user) {
    return null;
  }

  return toPublicUser(user);
}

export function getStoredSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) {
    return null;
  }

  try {
    const session = JSON.parse(stored);
    if (!session?.id) {
      return null;
    }

    const users = readUsers();
    const currentUser = users.find((entry) => entry.id === session.id);
    if (!currentUser) {
      clearSession();
      return null;
    }

    return toPublicUser(currentUser);
  } catch {
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function toPublicUser(user) {
  const { password: _, ...publicUser } = normalizeUser(user);
  return publicUser;
}

export function updateUserProfile(userId, { name, username, avatar, bio }) {
  const users = readUsers();
  const index = users.findIndex((entry) => entry.id === userId);

  if (index === -1) {
    return { success: false, error: "User not found" };
  }

  const trimmedName = name.trim();
  const trimmedUsername = username.trim();
  const trimmedBio = typeof bio === "string" ? bio.trim() : "";

  if (!trimmedName) {
    return { success: false, error: "Name is required" };
  }

  if (!trimmedUsername) {
    return { success: false, error: "Username is required" };
  }

  if (trimmedBio.length > 120) {
    return {
      success: false,
      error: "Bio must be at most 120 characters",
    };
  }

  const usernameTaken = users.some(
    (entry) =>
      entry.id !== userId &&
      entry.username.toLowerCase() === trimmedUsername.toLowerCase(),
  );

  if (usernameTaken) {
    return { success: false, error: "Username is already taken" };
  }

  users[index] = {
    ...users[index],
    name: trimmedName,
    username: trimmedUsername,
    avatar: avatar || users[index].avatar || DEFAULT_AVATAR,
    bio: trimmedBio,
  };

  writeUsers(users);
  const publicUser = toPublicUser(users[index]);
  saveSession(publicUser);
  return { success: true, user: publicUser };
}

export function resetUserPassword(
  userId,
  { currentPassword, newPassword, confirmPassword },
) {
  const users = readUsers();
  const index = users.findIndex((entry) => entry.id === userId);

  if (index === -1) {
    return { success: false, error: "User not found" };
  }

  if (!currentPassword) {
    return { success: false, error: "Current password is required" };
  }

  if (users[index].password !== currentPassword) {
    return { success: false, error: "Current password is incorrect" };
  }

  if (!newPassword) {
    return { success: false, error: "New password is required" };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      error: "New password must be at least 6 characters",
    };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  users[index] = {
    ...users[index],
    password: newPassword,
  };

  writeUsers(users);
  return { success: true };
}
