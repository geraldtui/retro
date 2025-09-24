"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Star } from "lucide-react"
import type { Conversation } from "@/app/page"

interface ConversationFormProps {
  onSave: (conversation: Omit<Conversation, "id">) => void
  onCancel: () => void
}

export function ConversationForm({ onSave, onCancel }: ConversationFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    participant: "",
    date: new Date().toISOString().split("T")[0],
    context: "",
    rating: 0,
    reflection: {
      didWell: "",
      couldImprove: "",
      learned: "",
    },
    tags: [] as string[],
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
    if (formData.title && formData.participant && formData.rating > 0) {
      onSave(formData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start New Reflection</CardTitle>
        <p className="text-sm text-muted-foreground">
          Log a conversation and reflect deeply on the interaction to grow from the experience.
        </p>
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
              placeholder="Briefly describe what the conversation was about and the key points discussed..."
              value={formData.context}
              onChange={(e) => setFormData((prev) => ({ ...prev, context: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
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
                  <Star className={`w-6 h-6 ${star <= formData.rating ? "fill-current" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Reflection Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Reflection Questions</h3>

            <div className="space-y-2">
              <Label htmlFor="didWell">What did I do well in this conversation?</Label>
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
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="couldImprove">What could I have done differently?</Label>
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
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learned">What did I learn from this interaction?</Label>
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
                rows={2}
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
              Save Reflection
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
