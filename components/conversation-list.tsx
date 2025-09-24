"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Calendar, User, Trash2, Search, MessageCircle, Plus } from "lucide-react"
import { QuickLogForm } from "@/components/quick-log-form"
import type { Interaction } from "@/app/page"

interface ConversationListProps {
  conversations: Interaction[]
  onDelete: (id: string) => void
  onEdit: (interaction: Interaction) => void
  onSave: (interaction: Omit<Interaction, "id">) => void
}

export function ConversationList({ conversations, onDelete, onEdit, onSave }: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "rating" | "title">("date")
  const [filterRating, setFilterRating] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)

  const filteredAndSorted = conversations
    .filter((conv) => {
      const matchesSearch =
        conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.context.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRating = filterRating === "all" || conv.rating.toString() === filterRating
      return matchesSearch && matchesRating
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "rating":
          return b.rating - a.rating
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleSave = (interaction: Omit<Interaction, "id">) => {
    onSave(interaction)
    setShowForm(false)
  }

  if (conversations.length === 0) {
    return (
      <div className="py-6">
        {!showForm ? (
          <div className="text-center py-16 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-1">No interactions yet</p>
            <p className="text-sm mb-6">Start by logging your first interaction</p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Log Interaction
            </Button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ease-out">
            <QuickLogForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search interactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-0 bg-muted/30"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: "date" | "rating" | "title") => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-32 border-0 bg-muted/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full sm:w-32 border-0 bg-muted/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="5">5★</SelectItem>
            <SelectItem value="4">4★</SelectItem>
            <SelectItem value="3">3★</SelectItem>
            <SelectItem value="2">2★</SelectItem>
            <SelectItem value="1">1★</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Card
          className="hover:bg-muted/30 transition-colors cursor-pointer border-0 shadow-sm bg-transparent"
          onClick={() => setShowForm((prev) => !prev)}
        >
          <CardContent className="p-2">
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">{showForm ? "- Hide" : "+ Log New Interaction"}</span>
            </div>
          </CardContent>
        </Card>
        {showForm && (
          <div className="animate-in fade-in-5 slide-in-from-top-2 duration-1000 ease-out">
            <QuickLogForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {filteredAndSorted.map((conversation) => (
          <Card
            key={conversation.id}
            className="hover:bg-muted/30 cursor-pointer border-0 shadow-sm hover:ring-1 hover:ring-primary/40 hover:ring-offset-1 hover:ring-offset-background transition-all duration-200"
            onClick={() => onEdit(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{conversation.title}</h3>
                    {conversation.rating > 0 && (
                      <Badge variant="secondary" className="text-xs px-2 py-0 rounded-full">
                        {conversation.rating}★
                      </Badge>
                    )}
                    {conversation.tags.length > 0 && (
                      <Badge variant="outline" className="text-xs px-2 py-0 rounded-full">
                        {conversation.tags[0]}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {conversation.participant}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(conversation.date).toLocaleDateString()}
                    </div>
                    {conversation.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: conversation.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-primary fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                  {conversation.context && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{conversation.context}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {conversation.reflection.didWell ||
                        conversation.reflection.couldImprove ||
                        conversation.reflection.learned ? (
                        <span className="text-green-500">✓ Reflected</span>
                      ) : (
                        <span className="text-yellow-500">○ Pending</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conversation.id)
                  }}
                  className="text-muted-foreground hover:text-destructive ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
