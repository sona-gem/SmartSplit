import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTripStore from "../store/useTripStore";

export default function JoinTrip() {
  const { token } = useParams();
  const navigate = useNavigate();
  const joinTrip = useTripStore((state) => state.joinTrip);
  const user = useTripStore((state) => state.user);
  const [status, setStatus] = useState("joining"); // joining | success | error
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!user) {
      // save the invite URL and redirect to login
      localStorage.setItem("pendingInvite", `/join/${token}`);
      navigate("/login");
      return;
    }
    handleJoin();
  }, []);

  async function handleJoin() {
    const result = await joinTrip(token, user.name);
    if (!result) {
      setStatus("error");
      return;
    }
    if (result.alreadyMember) {
      navigate(`/trip/${result.trip._id}`);
      return;
    }
    setStatus("success");
    setTimeout(() => navigate(`/trip/${result.trip._id}`), 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-sm text-center">
        {status === "joining" && (
          <>
            <p className="text-2xl mb-2">✈️</p>
            <p className="font-semibold text-gray-800">Joining trip...</p>
          </>
        )}
        {status === "success" && (
          <>
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold text-gray-800">You're in!</p>
            <p className="text-sm text-gray-500 mt-1">Redirecting to trip...</p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-2xl mb-2">❌</p>
            <p className="font-semibold text-gray-800">Invalid invite link</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-blue-600 text-sm"
            >
              Go home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
