function AuthLoadingScreen() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-busy="true"
    >
      <p className="text-stone-500">Loading...</p>
    </div>
  );
}

export default AuthLoadingScreen;
