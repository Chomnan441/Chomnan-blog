const USERS_KEY = "chomnan_blog_users";
const SESSION_KEY = "chomnan_blog_session";

const DEFAULT_AVATAR =
  // "https://images.unsplash.com/photo-1534188756822-c212a6a0a6a0?w=100&h=100&fit=crop&crop=face"
  "https://avatars.githubusercontent.com/u/159530699?v=4";

const SEED_USERS = [
  {
    id: "seed-1",
    name: "Wynnie",
    username: "Wynnie.cute",
    email: "Wynnie.cute@gmail.com",
    password: "12345678",
    avatar:
      // "https://images.unsplash.com/photo-1591871937573-74dbba515ee4?w=100&h=100&fit=crop"
      "https://avatars.githubusercontent.com/u/159530699?v=4",
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
