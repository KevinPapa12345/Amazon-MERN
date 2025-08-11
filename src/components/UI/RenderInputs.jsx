import Input from "./Input";

const RenderInputs = ({
  action,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  codeSent,
  code,
  setCode,
  newPassword,
  setNewPassword,
}) => {
  if (action === "Forgot") {
    return (
      <>
        {!codeSent && (
          <Input
            type="email"
            src="/icons/email.png"
            alt="email_icon"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
          />
        )}
        {codeSent && (
          <>
            <Input
              type="text"
              placeholder="Enter the code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      {action === "Sign up" && (
        <Input
          type="text"
          src="/icons/person.png"
          alt="person_icon"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === " " && e.preventDefault()}
        />
      )}

      <Input
        type="email"
        src="/icons/email.png"
        alt="email_icon"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
      />

      <Input
        type="password"
        src="/icons/password.png"
        alt="password_icon"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === " " && e.preventDefault()}
      />
    </>
  );
};

export default RenderInputs;
