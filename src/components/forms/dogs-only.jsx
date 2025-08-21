'use client';

export default function DisclaimerDogsOnly() {
  return (
    <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800 shadow-sm">
      <p className="mb-2 font-semibold">⚠️ Submissions for Dogs Only</p>
      <p>
        We’re currently focusing on collecting veterinary bill data for dogs. At this time, please
        only submit bills related to dog services. Support for cat and other pet submissions will be
        added in the future — stay tuned!
      </p>
    </div>
  );
}
