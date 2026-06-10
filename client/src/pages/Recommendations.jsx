// PATH: resume-builder/client/src/pages/Recommendations.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../configs/api';

const Recommendations = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((s) => s.auth);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReco = async () => {
      try {
        const { data } = await api.get(`/api/recommendations/${resumeId}`, {
          headers: { Authorization: token },
        });
        setRecs(data?.recommendations || []);
      } catch (err) {
        console.error('RECO FETCH ERROR:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReco();
  }, [resumeId, token]);

  if (loading) return <p className="max-w-5xl mx-auto p-4">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Recommendations</h1>
      {recs.length === 0 && <p className="text-slate-600">No recommendations yet.</p>}
      {recs.map((r) => (
        <div key={r.job_id} className="border rounded p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="font-semibold text-lg">{r.job_title || r.job_id}</h2>
              {(r.company || r.location) && (
                <p className="text-sm text-slate-600">{[r.company, r.location].filter(Boolean).join(' • ')}</p>
              )}
            </div>
            <p className="text-sm">Match Score: {(r.score * 100).toFixed(1)}%</p>
          </div>
          {!!r.missing_skills?.length && (
            <>
              <p className="font-semibold mt-3">Missing skills:</p>
              <ul className="list-disc ml-5 text-sm">
                {r.missing_skills.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </>
          )}
          {r.url && (
            <a href={r.url} target="_blank" rel="noreferrer" className="inline-block mt-3 text-blue-600 hover:underline text-sm">
              Apply / View job
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
