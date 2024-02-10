import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

type Props = {};

const CompleteSignup = (props: Props) => {
  const completeSignupMutation = api.user.completeSignup.useMutation();

  const router = useRouter();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (completeSignupMutation.isSuccess) {
      router.push("/");
    }
  }, [completeSignupMutation.isSuccess]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeSignupMutation.mutate({ displayName, username });
  };

  if (step == 0) {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(1);
          }}
        >
          <input
            placeholder="Display name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <button type="submit">Next</button>
        </form>
      </div>
    );
  } else if (step == 1) {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <input
            placeholder="@username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Next</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <input type="file" />
          <button type="submit">Complete</button>
        </form>
      </div>
    );
  }
};

export default CompleteSignup;
