import React from "react";

const Login = (props) => {
  return (
    <div className="main_container_login">
      <div className="welcome_message">
        <p>A Decentralized Voting Application</p>
      </div>

      <button className="login_button" onClick={props.connectWallet}>
        Connect Metamask Wallet
      </button>

      <div className="login_rules_block">
        <p>
          Your Metmask wallet address will be used as your UID (Unique
          Identification) when casting your vote. <br />
          Every wallet address will get only one shot to cast their vote.
        </p>
      </div>
    </div>
  );
};

export default Login;
