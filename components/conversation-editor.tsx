"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Star, ArrowLeft } from "lucide-react"
import type { Conversation } from "@/app/page"

interface ConversationEditorProps {
  conversation: Conversation
  onSave: (conversation: Conversation) => void
  onCancel: () => void
}

export function ConversationEditor({ conversation, onSave, onCancel }: ConversationEditorProps) {
  const [formData, setFormData] = useState({
    title: conversation.title,
    participant: conversation.participant,
    date: conversation.date,
    context: conversation.context,
    rating: conversation.rating,
    reflection: {
      didWell: conversation.reflection.didWell,
      couldImprove: conversation.reflection.couldImprove,
      learned: conversation.reflection.learned,
    },
    tags: conversation.tags,
  })
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.participant) {
      onSave({
        ...conversation,
        ...formData,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle>Edit & Reflect</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Update conversation details and add your reflections.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Conversation Title</Label>
              <Input
                id="title"
                placeholder="e.g., Team meeting with Sarah"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participant">Participant(s)</Label>
              <Input
                id="participant"
                placeholder="e.g., Sarah, John"
                value={formData.participant}
                onChange={(e) => setFormData((prev) => ({ ...prev, participant: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Context & Summary</Label>
            <Textarea
              id="context"
              placeholder="Brief summary of what was discussed..."
              value={formData.context}
              onChange={(e) => setFormData((prev) => ({ ...prev, context: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  className={`p-1 rounded transition-colors ${
                    star <= formData.rating
                      ? "text-primary hover:text-primary/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Star className={`w-5 h-5 ${star <= formData.rating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Reflection Questions */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-primary">Reflection</h3>

            <div className="space-y-2">
              <Label htmlFor="didWell" className="text-green-400">
                What did I do well in this conversation?
              </Label>
              <Textarea
                id="didWell"
                placeholder="Reflect on your strengths and positive contributions..."
                value={formData.reflection.didWell}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reflection: { ...prev.reflection, didWell: e.target.value },
                  }))
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="couldImprove" className="text-yellow-400">
                What could I have done differently?
              </Label>
              <Textarea
                id="couldImprove"
                placeholder="Consider areas for improvement and alternative approaches..."
                value={formData.reflection.couldImprove}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reflection: { ...prev.reflection, couldImprove: e.target.value },
                  }))
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learned" className="text-primary">
                What did I learn from this interaction?
              </Label>
              <Textarea
                id="learned"
                placeholder="Capture insights and lessons for future conversations..."
                value={formData.reflection.learned}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reflection: { ...prev.reflection, learned: e.target.value },
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
