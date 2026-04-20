import { useToast } from './Toast';

export default function ShareButtons({ url }) {
  const toast = useToast();
  const text = 'I just converted a file with ConvertAnything!';

  return (
    <div className="share-buttons">
      <a href={`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`} target="_blank" rel="noopener noreferrer" className="share-btn share-whatsapp" aria-label="Share on WhatsApp">WhatsApp</a>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="share-btn share-twitter" aria-label="Share on X">X</a>
      <button className="share-btn share-copy" onClick={() => { navigator.clipboard.writeText(url); toast('Link copied!', 'success'); }} type="button" aria-label="Copy link">Copy Link</button>
    </div>
  );
}
