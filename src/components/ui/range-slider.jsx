'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export default function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = [0, 100],
  onChange,
  formatLabel = (val) => `$${val}`,
  label = '',
  className = '',
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(null); // 'min' | 'max' | null
  const sliderRef = useRef(null);
  const isInternalUpdate = useRef(false);

  // Update local value when prop changes
  useEffect(() => {
    if (!isInternalUpdate.current) {
      setLocalValue(value);
    }
  }, [value]);

  // Clamp value to min/max and ensure min <= max
  const clampValue = useCallback((val) => {
    return Math.max(min, Math.min(max, val));
  }, [min, max]);

  // Round to nearest step
  const roundToStep = useCallback((val) => {
    return Math.round(val / step) * step;
  }, [step]);

  // Get position as percentage
  const getPercentage = useCallback((val) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  // Get value from mouse/touch position
  const getValueFromPosition = useCallback((clientX) => {
    if (!sliderRef.current) return min;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const rawValue = min + (percentage / 100) * (max - min);

    return clampValue(roundToStep(rawValue));
  }, [min, max, clampValue, roundToStep]);

  // Handle dragging
  const handleMove = useCallback((clientX) => {
    if (!isDragging) return;

    const newValue = getValueFromPosition(clientX);

    setLocalValue((prev) => {
      let newRange = [...prev];

      if (isDragging === 'min') {
        // Don't let min go above max
        newRange[0] = Math.min(newValue, prev[1]);
      } else if (isDragging === 'max') {
        // Don't let max go below min
        newRange[1] = Math.max(newValue, prev[0]);
      }

      // Schedule onChange call after state update
      isInternalUpdate.current = true;
      Promise.resolve().then(() => {
        isInternalUpdate.current = false;
        if (onChange) {
          onChange(newRange);
        }
      });

      return newRange;
    });
  }, [isDragging, getValueFromPosition, onChange]);

  // Mouse handlers
  const handleMouseDown = (handle) => (e) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(null);
    }
  }, [isDragging]);

  // Touch handlers
  const handleTouchStart = (handle) => (e) => {
    setIsDragging(handle);
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(null);
    }
  }, [isDragging]);

  // Global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Keyboard navigation
  const handleKeyDown = (handle) => (e) => {
    let delta = 0;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        delta = step;
        break;
      case 'Home':
        delta = handle === 'min' ? min - localValue[0] : min - localValue[1];
        break;
      case 'End':
        delta = handle === 'min' ? max - localValue[0] : max - localValue[1];
        break;
      default:
        return;
    }

    e.preventDefault();

    setLocalValue((prev) => {
      let newRange = [...prev];

      if (handle === 'min') {
        newRange[0] = clampValue(Math.min(prev[0] + delta, prev[1]));
      } else {
        newRange[1] = clampValue(Math.max(prev[1] + delta, prev[0]));
      }

      if (onChange) {
        onChange(newRange);
      }

      return newRange;
    });
  };

  const minPercent = getPercentage(localValue[0]);
  const maxPercent = getPercentage(localValue[1]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="mb-2 flex items-center justify-between text-xs font-medium" style={{ color: '#0F172B' }}>
          <span>{label}</span>
          <span style={{ color: '#475569' }}>
            {formatLabel(localValue[0])} - {formatLabel(localValue[1])}
          </span>
        </div>
      )}

      <div className="relative w-full px-2">
        {/* Track */}
        <div
          ref={sliderRef}
          className="relative h-2 rounded-full"
          style={{ backgroundColor: '#E2E8F0' }}
        >
          {/* Active range */}
          <div
            className="absolute h-full rounded-full"
            style={{
              backgroundColor: '#2C7FFF',
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          {/* Min handle */}
          <button
            type="button"
            role="slider"
            aria-label={`Minimum ${label}`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={localValue[0]}
            tabIndex={0}
            onMouseDown={handleMouseDown('min')}
            onTouchStart={handleTouchStart('min')}
            onKeyDown={handleKeyDown('min')}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-125"
            style={{
              backgroundColor: '#2C7FFF',
              left: `${minPercent}%`,
              cursor: isDragging === 'min' ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}
          />

          {/* Max handle */}
          <button
            type="button"
            role="slider"
            aria-label={`Maximum ${label}`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={localValue[1]}
            tabIndex={0}
            onMouseDown={handleMouseDown('max')}
            onTouchStart={handleTouchStart('max')}
            onKeyDown={handleKeyDown('max')}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-125"
            style={{
              backgroundColor: '#2C7FFF',
              left: `${maxPercent}%`,
              cursor: isDragging === 'max' ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}
          />
        </div>

        {/* Min/Max labels below track */}
        <div className="mt-1 flex justify-between text-xs" style={{ color: '#94A3B8' }}>
          <span>{formatLabel(min)}</span>
          <span>{formatLabel(max)}</span>
        </div>
      </div>
    </div>
  );
}
