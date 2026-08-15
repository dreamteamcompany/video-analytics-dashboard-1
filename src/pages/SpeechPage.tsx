import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SpeechPage = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('/speech.md')
      .then((r) => r.text())
      .then(setText);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-10 prose-p:leading-relaxed prose-table:text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default SpeechPage;
