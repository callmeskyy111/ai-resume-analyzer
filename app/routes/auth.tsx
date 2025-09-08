export const meta = () => [
  { title: "ResuMind | Auth 🛡️" },
  {
    name: "description",
    content: "Log into your account",
  },
];

export default function auth() {
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex-col flex gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="">Welcome</h1>
            <h2>Log In to Continue Your Career Journey</h2>
          </div>
        </section>
      </div>
    </main>
  );
}
