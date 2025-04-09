export function mapFirebaseAuthError(error) {
  const firebaseErrorMap = {
    "auth/invalid-credential": {
      errorCode: 1404,
      error: "Invalid email or password",
    },
    "auth/user-not-found": {
      errorCode: 1501,
      error: "User not found",
    },
    "auth/wrong-password": {
      errorCode: 1404,
      error: "Invalid email or password",
    },
    "auth/email-already-in-use": {
      errorCode: 1405,
      error: "Email already in use",
    },
    "EMAIL_EXISTS": {
      errorCode: 1405,
      error: "This email is already registered. Try logging in instead.",
    },
    "auth/invalid-email": {
      errorCode: 1403,
      error: "Invalid email format",
    },
    "auth/too-many-requests": {
      errorCode: 1402,
      error: "Too many attempts. Please try again later.",
    },
  };

  return firebaseErrorMap[error.code] || {
    errorCode: 1001,
    error: "Unexpected error. Please try again.",
  };
}
