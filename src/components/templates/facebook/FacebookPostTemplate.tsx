/**
 * Facebook Post Template
 * Standard text + image/video post
 * Supports scheduling and engagement tracking
 */

import React from 'react'
import { Post, MediaAsset } from '@/types'
import { Heart, MessageCircle, Share2, Smile, MapPin, Clock } from 'lucide-react'

interface Props {
  post: Post
  content: string
  media: MediaAsset[]
  mode: 'preview' | 'edit' | 'published'
  className?: string
}

export function FacebookPostTemplate({ post, content, media, mode, className = '' }: Props) {
  const imageUrl = media.find((m) => m.type === 'image')?.url || post.generatedImage
  const videoUrl = media.find((m) => m.type === 'video')?.url || post.generatedVideoUrl

  return (
    <div className={`bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-md ${className}`}>
      {/* Facebook Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600" />
            <div>
              <p className="font-bold text-sm text-black">Your Page</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 text-xs text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Location</span>
        </div>
      </div>

      {/* Content Text */}
      <div className="p-4">
        <p className="text-sm text-black break-words">
          {content.length > 63206 ? content.substring(0, 63203) + '...' : content}
        </p>
      </div>

      {/* Image/Video */}
      {(imageUrl || videoUrl) && (
        <div className="w-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-auto"
              controls
              poster={imageUrl}
            />
          ) : (
            <img
              src={imageUrl}
              alt="Post content"
              className="w-full h-auto object-cover max-h-96"
            />
          )}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
        <div className="flex justify-between">
          <span>❤️ 234 👍 567 😮 89</span>
          <span>123 comments • 45 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around py-2 border-t border-gray-200">
        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 flex-1 py-2 justify-center rounded hover:text-blue-600 transition">
          <Heart className="w-5 h-5" />
          <span className="text-sm">Like</span>
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 flex-1 py-2 justify-center rounded hover:text-blue-600 transition">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">Comment</span>
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 flex-1 py-2 justify-center rounded hover:text-blue-600 transition">
          <Share2 className="w-5 h-5" />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {/* Comment Section */}
      {mode !== 'published' && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex gap-2">
            <Smile className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 text-sm outline-none hover:bg-gray-200 focus:bg-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default FacebookPostTemplate
