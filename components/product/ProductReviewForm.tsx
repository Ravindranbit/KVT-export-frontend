'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore, Feedback } from '../../store/useProductStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductReviewFormProps {
  productId: number;
}

export default function ProductReviewForm({ productId }: ProductReviewFormProps) {
  const { user } = useAuthStore();
  const { addFeedback, updateFeedback, removeFeedback, getProductById } = useProductStore();
  const product = getProductById(productId);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!user) {
      setError('Please sign in to leave a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a star rating before submitting.');
      return;
    }

    if (!comment.trim()) {
      setError('Please share your thoughts in the comment section.');
      return;
    }

    if (editingId) {
      updateFeedback(productId, editingId, { rating, comment });
      setMessage('Review updated successfully!');
    } else {
      const newFeedback: Feedback = {
        id: Math.random().toString(36).substring(7),
        userName: user.name,
        rating,
        comment,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      };
      addFeedback(productId, newFeedback);
      setMessage('Review submitted successfully!');
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setComment('');
    setRating(0);
    setEditingId(null);
    setShowForm(false);
    
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  const [message, setMessage] = useState('');

  const handleEdit = (f: Feedback) => {
    setEditingId(f.id);
    setRating(f.rating);
    setComment(f.comment);
    setShowForm(true);
    const formElement = document.getElementById('review-form-top');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mt-12 pt-12 border-t border-gray-100" id="review-form-top">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product?.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 font-medium">Based on {product?.reviews || 0} reviews</span>
          </div>
        </div>
        
        {!showForm && !submitted && (
          <div className="flex flex-col items-end gap-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-right-4 duration-300">
                {error}
              </div>
            )}
            <button
              onClick={() => user ? setShowForm(true) : setError('Please sign in to write a review')}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-md font-bold hover:bg-gray-800 transition shadow-md whitespace-nowrap"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-8 mb-12 border border-gray-100 shadow-sm transition-all animate-fade-in text-left">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{editingId ? 'Edit Your Feedback' : 'Your Feedback'}</h3>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-3">Review Comment</label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-gray-900 placeholder-gray-400"
              placeholder="What did you like or dislike about this product?"
              required
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200]"
          >
            <div className="bg-gray-900/95 backdrop-blur-md text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/10">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-sm font-black tracking-wider uppercase text-emerald-400 leading-none mb-1">Success</span>
                <span className="text-base font-bold text-gray-100 whitespace-nowrap leading-none">
                  {message.includes('updated') ? 'Review Updated' : 'Review Published'}
                </span>
              </div>
              <div className="w-px h-8 bg-white/10 mx-2" />
              <button onClick={() => setSubmitted(false)} className="hover:text-emerald-400 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-8">
        {product?.feedbacks?.length ? (
          product.feedbacks.map((f) => (
            <div key={f.id} className="pb-8 border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                    {f.userName.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{f.userName}</h4>
                    <p className="text-xs text-gray-400 font-medium">{f.date}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < f.rating ? 'fill-current' : 'text-gray-200'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 leading-relaxed text-base italic flex-1">"{f.comment}"</p>
                {user && user.name === f.userName && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEdit(f)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Edit Review">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => removeFeedback(productId, f.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Review">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )).reverse()
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
}
