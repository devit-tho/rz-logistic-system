function SplashScreen() {
  return (
    <div className="text-primary fixed inset-0 z-[9999] flex size-full flex-col items-center justify-center bg-white">
      <img
        src="/images/logo.png"
        alt="RZ Logistic System"
        className="size-80"
      />
    </div>
  );
}

export default SplashScreen;
