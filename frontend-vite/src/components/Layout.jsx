import Navbar from "./Navbar.jsx";

const Layout = ({
  children,
  isConnected,
  account,
  connectWallet,
  disconnectWallet,
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#ec1ae6] via-[#a036eb] to-[#2642e6] font-['Montserrat',sans-serif] text-white">
      <Navbar
        isConnected={isConnected}
        account={account}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="fixed bottom-[10px] left-0 right-0 z-[900] m-0 p-0 text-center font-['Montserrat',sans-serif] text-[0.72rem] font-medium text-white/95 md:text-[0.82rem]">
        <p className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          Build to improve transperancy by Rohit Roy | 2026
        </p>
      </footer>
    </div>
  );
};

export default Layout;