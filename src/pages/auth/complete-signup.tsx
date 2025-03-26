import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import BlackButton from "~/components/common/Buttons/BlackButton";
import PrimaryButton from "~/components/common/Buttons/PrimaryButton";
import { api } from "~/utils/api";

type Props = Record<string, string>;

const CompleteSignup = (props: Props) => {
  const { update } = useSession();

  const completeSignupMutation = api.user.completeSignup.useMutation({
    async onSuccess() {
      await update();
      void router.push("/");
    },
  });

  const router = useRouter();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");

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
          <BlackButton type="submit">Next</BlackButton>
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
          <BlackButton type="submit">Next</BlackButton>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <input type="file" />
          <PrimaryButton type="submit">Complete</PrimaryButton>
        </form>
      </div>
    );
  }
};

export default CompleteSignup;
