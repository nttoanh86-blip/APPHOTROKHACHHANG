import React, { useState } from 'react';
import { Landmark, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
  containerClassName = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-slate-100 flex items-center justify-center ${containerClassName}`}>
      {!hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-slate-200/70 animate-pulse flex items-center justify-center">
              <Landmark className="w-8 h-8 text-slate-400 animate-bounce opacity-40" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            {...rest}
          />
        </>
      ) : (
        <div className="w-full h-full min-h-[160px] p-4 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 text-white">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2">
            <ImageOff className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-xs font-semibold text-white/90 line-clamp-2">
            {fallbackTitle || alt || 'Tài liệu hướng dẫn VietinBank'}
          </p>
          <span className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">
            Hình ảnh minh họa hệ thống
          </span>
        </div>
      )}
    </div>
  );
};
