import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    async function verify() {
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
      const msg = await res.text();
      alert(msg);
    }
    verify();
  }, [token]);

  return <div>Verifying email...</div>;
}
