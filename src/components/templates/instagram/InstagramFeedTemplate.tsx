/**
 * Instagram Feed Template
 * Single image post (1:1 ratio, 480x480px max)
 * Displays like the actual Instagram feed post
 */

import React from 'react'
import { Post, MediaAsset } from '@/types'
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'

interface Props {
  post: Post
  content: string
  media: MediaAsset[]
  mode: 'preview' | 'edit' | 'published'
  className?: string
}

export function InstagramFeedTemplate({ post, content, media, mode, className = '' }: Props) {
  const imageUrl = media.find((m) => m.type === 'image')?.url || post.generatedImage

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-full" />
          <div>
            <p className="font-semibold text-sm">Your Account</p>
            <p className="text-xs text-gray-500">Location</p>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-900">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gray-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Post content"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <p className="text-gray-600">No image</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4">
            <button className="text-gray-700 hover:text-red-600 transition">
              <Heart className="w-6 h-6" />
            </button>
            <button className="text-gray-700 hover:text-gray-900 transition">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-gray-700 hover:text-gray-900 transition">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="text-gray-700 hover:text-gray-900 transition">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes count */}
        <p className="text-sm font-semibold">1,234 likes</p>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <div className="text-sm">
          <span className="font-semibold">Your Account </span>
          <span className="text-gray-800 break-words">
            {content.length > 2200 ? content.substring(0, 2197) + '...' : content}
          </span>
        </div>

        {/* Comments count */}
        <button className="text-xs text-gray-500 mt-2 hover:text-gray-700">
          View all 45 comments
        </button>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-2">2 HOURS AGO</p>
      </div>

      {/* Add comment */}
      {mode !== 'published' && (
        <div className="border-t px-4 py-3 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm bg-transparent placeholder-gray-500 outline-none"
          />
          <button className="text-blue-500 font-semibold text-sm hover:text-blue-600">Post</button>
        </div>
      )}
    </div>
  )
}

export default InstagramFeedTemplate
