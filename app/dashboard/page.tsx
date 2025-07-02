import AuthGuard from "@/components/AuthGuard";

export default function Dashboard() {
  return (
    <AuthGuard>
      <h1>dashboard</h1>
    </AuthGuard>
  );
}
