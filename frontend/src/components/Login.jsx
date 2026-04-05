import { CiWallet } from "react-icons/ci";

const Login = (props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#ec1ae6] via-[#a036eb] to-[#2642e6] px-8 text-center text-white">
      <div className="text-center">
        <h1 className="m-0 text-[2.2rem] font-extrabold tracking-[0.02em] md:text-5xl">Decentrocast</h1>
        <p className="mb-0 mt-[0.4rem] text-base font-medium md:text-[1.2rem]">A decentralized voting application powered by blockchain.</p>
      </div>

      <button
        className="m-[1.8rem] flex items-center justify-center gap-2 rounded-[5px] border-2 border-white bg-white p-4 text-center font-['Montserrat',sans-serif] text-base font-extrabold text-black transition-all duration-300 hover:bg-transparent hover:text-white hover:backdrop-blur-sm"
        onClick={props.connectWallet}
      >
        Get started with MetaMask
        <CiWallet />
      </button>

      <div>
        <p className="m-0 text-center text-[0.8rem] font-semibold tracking-[0.08em]">ONE wallet = ONE vote</p>
      </div>
    </div>
  );
};

export default Login;
