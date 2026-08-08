export default async function TestPage() {
  try {
    const res = await fetch(
      "https://otyejzjsfaqclzbppsye.supabase.co/auth/v1/health",
    );

    return <pre>Status: {res.status}</pre>;
  } catch (e) {
    return <pre>{String(e)}</pre>;
  }
}
