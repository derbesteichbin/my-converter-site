import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Interactive crop frame for Resize for Social Media ("crop to fill").
//
// Shows each image with a frame in the target aspect ratio that the user
// drags (mouse or finger) or moves with the arrow keys. The frame is always
// the largest rectangle of that ratio that fits the image — the same rule
// the server applies in cropRect() (server/lib/socialImage.js) — so only its
// centre needs to be stored and sent: { x, y } as fractions of the image.
// No stored centre means "automatic": the server picks the most
// interesting region itself.

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const round4 = (v) => Math.round(v * 10000) / 10000;

// Frame size as fractions of the displayed image.
function frameSize(imageW, imageH, ratioW, ratioH) {
  const image = imageW / imageH;
  const target = ratioW / ratioH;
  return image > target ? { w: target / image, h: 1 } : { w: 1, h: image / target };
}

export default function CropPicker({ files, ratio, focusFor, onChange }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [url, setUrl] = useState('');
  const [natural, setNatural] = useState(null); // { w, h } once loaded
  const [failed, setFailed] = useState(false);
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  const current = files[Math.min(index, files.length - 1)];
  const [ratioW, ratioH] = ratio.split(':').map(Number);

  useEffect(() => {
    if (index > files.length - 1) setIndex(Math.max(0, files.length - 1));
  }, [files.length, index]);

  useEffect(() => {
    if (!current) return undefined;
    const objectUrl = URL.createObjectURL(current);
    setUrl(objectUrl);
    setNatural(null);
    setFailed(false);
    return () => URL.revokeObjectURL(objectUrl);
  }, [current]);

  if (!current) return null;

  const focus = focusFor(current);
  const size = natural ? frameSize(natural.w, natural.h, ratioW, ratioH) : null;
  // Same shape as the target: the whole image is kept and there is nothing
  // to position.
  const nothingToCrop = size && size.w > 0.999 && size.h > 0.999;
  const centre = focus || { x: 0.5, y: 0.5 };
  const frame = size && {
    left: clamp(centre.x - size.w / 2, 0, 1 - size.w),
    top: clamp(centre.y - size.h / 2, 0, 1 - size.h),
  };

  function moveTo(x, y) {
    onChange(current, {
      x: round4(clamp(x, size.w / 2, 1 - size.w / 2)),
      y: round4(clamp(y, size.h / 2, 1 - size.h / 2)),
    });
  }

  function onPointerDown(e) {
    if (!size || nothingToCrop) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = stageRef.current.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      boxW: box.width,
      boxH: box.height,
      from: { x: frame.left + size.w / 2, y: frame.top + size.h / 2 },
    };
  }

  function onPointerMove(e) {
    const drag = dragRef.current;
    if (!drag) return;
    moveTo(
      drag.from.x + (e.clientX - drag.startX) / drag.boxW,
      drag.from.y + (e.clientY - drag.startY) / drag.boxH
    );
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function onKeyDown(e) {
    if (!size || nothingToCrop) return;
    const step = e.shiftKey ? 0.1 : 0.02;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    moveTo(frame.left + size.w / 2 + move[0], frame.top + size.h / 2 + move[1]);
  }

  return (
    <div className="crop-picker">
      <div className="crop-picker-head">
        <span className="crop-picker-title">{t('tool.cropTitle')}</span>
        {files.length > 1 && (
          <span className="crop-picker-nav">
            <button type="button" className="crop-nav-btn" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} aria-label={t('tool.cropPrev')}>‹</button>
            <span className="crop-picker-count">{t('tool.cropCounter', { current: index + 1, total: files.length })}</span>
            <button type="button" className="crop-nav-btn" onClick={() => setIndex((i) => Math.min(files.length - 1, i + 1))} disabled={index === files.length - 1} aria-label={t('tool.cropNext')}>›</button>
          </span>
        )}
      </div>

      {failed ? (
        <p className="crop-picker-note">{t('tool.cropNoPreview')}</p>
      ) : (
        <div className="crop-stage-wrap">
          <div className="crop-stage" ref={stageRef}>
            <img
              src={url}
              alt=""
              draggable={false}
              onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              onError={() => setFailed(true)}
            />
            {frame && (
              <div
                className={`crop-frame ${focus ? 'crop-frame-manual' : 'crop-frame-auto'} ${nothingToCrop ? 'crop-frame-fixed' : ''}`}
                style={{
                  left: `${frame.left * 100}%`,
                  top: `${frame.top * 100}%`,
                  width: `${size.w * 100}%`,
                  height: `${size.h * 100}%`,
                }}
                role="group"
                tabIndex={nothingToCrop ? -1 : 0}
                aria-label={t('tool.cropFrameLabel')}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onKeyDown={onKeyDown}
              />
            )}
          </div>
        </div>
      )}

      {!failed && (
        <div className="crop-picker-foot">
          <span className={`crop-status ${focus ? 'crop-status-manual' : ''}`}>
            {nothingToCrop ? t('tool.cropNothingToCrop') : focus ? t('tool.cropManual') : t('tool.cropAuto')}
          </span>
          {focus && !nothingToCrop && (
            <button type="button" className="btn-ghost crop-reset" onClick={() => onChange(current, null)}>
              {t('tool.cropReset')}
            </button>
          )}
        </div>
      )}
      {!failed && !nothingToCrop && <p className="crop-picker-note">{t('tool.cropHint')}</p>}
    </div>
  );
}
