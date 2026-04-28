'use client';

import { useProductStore } from '../../store/useProductStore';

interface ProductReviewFormProps {
  productId: string;
}

export default function ProductReviewForm({ productId }: ProductReviewFormProps) {
  const { getProductById } = useProductStore();
  const product = getProductById(productId);

  return (
    <div className="mt-12 pt-12 border-t border-gray-100" id="review-form-top">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 h-5 ${index < Math.floor(product?.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 font-medium">Based on {product?.reviews || 0} reviews</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {product?.feedbacks?.length ? (
          [...product.feedbacks].reverse().map((feedback) => (
            <div key={feedback.id} className="pb-8 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                    {feedback.userName.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{feedback.userName}</h4>
                    <p className="text-xs text-gray-400 font-medium">{feedback.date}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${index < feedback.rating ? 'fill-current' : 'text-gray-200'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-base italic">"{feedback.comment}"</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-gray-500 font-medium">No reviews available</p>
            <p className="text-sm text-gray-400 mt-2">Product reviews are not supported by the backend yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
