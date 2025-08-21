// components/forms/disclaimer-bill.jsx

export default function DisclaimerBill() {
  return (
    <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-xs text-yellow-800 shadow-sm">
      <p className="mb-2 font-semibold">⚠️ Please review your receipt before submitting.</p>
      <p>
        Vet bills may include personal details. For your privacy, we recommend covering or blurring
        any sensitive information before uploading.
      </p>
    </div>
  );
}
