interface QnAItem {
  question: string;
  answer: string;
}

interface QnAProps {
  items: QnAItem[];
}

export default function QnA({ items }: QnAProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <details key={index} className="border rounded-lg group">
            <summary className="w-full text-left p-4 font-semibold hover:bg-gray-50 flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span className="text-2xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="p-4 pt-0 text-gray-700 whitespace-pre-wrap">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
