const USERS_KEY = "chomnan_blog_users";
const SESSION_KEY = "chomnan_blog_session";

export const DEFAULT_AVATAR = "/default-avatar.svg";

const SEED_USERS = [
  {
    id: "seed-1",
    name: "Moodeng ja",
    username: "moodeng.cute",
    email: "moodeng.cute@gmail.com",
    password: "12345678",
    avatar: DEFAULT_AVATAR,
  },
];

function readUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...SEED_USERS];
    }
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  return [...SEED_USERS];
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
  };

  users.push(newUser);
  writeUsers(users);

  const { password: _, ...publicUser } = newUser;
  return publicUser;
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

  const { password: _, ...publicUser } = user;
  return publicUser;
}

export function getStoredSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
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
  const { password: _, ...publicUser } = user;
  return publicUser;
}

export function updateUserProfile(userId, { name, username, avatar }) {
  const users = readUsers();
  const index = users.findIndex((entry) => entry.id === userId);

  if (index === -1) {
    return { success: false, error: "User not found" };
  }

  const trimmedName = name.trim();
  const trimmedUsername = username.trim();

  if (!trimmedName) {
    return { success: false, error: "Name is required" };
  }

  if (!trimmedUsername) {
    return { success: false, error: "Username is required" };
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
