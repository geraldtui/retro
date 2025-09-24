"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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
  const [showModal, setShowModal] = useState(false)

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
    setShowModal(false)
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-1">No interactions yet</p>
          <p className="text-sm mb-6">Start by logging your first interaction</p>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Log Interaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-none w-[90vw] max-h-[90vh] overflow-y-auto custom-scrollbar">
              <QuickLogForm onSave={handleSave} onCancel={() => setShowModal(false)} />
            </DialogContent>
          </Dialog>
        </div>
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
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer border-0 shadow-sm bg-transparent">
              <CardContent className="p-2">
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Log New Interaction</span>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-none w-[90vw] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <QuickLogForm onSave={handleSave} onCancel={() => setShowModal(false)} />
          </DialogContent>
        </Dialog>

        {filteredAndSorted.map((conversation) => (
          <Card
            key={conversation.id}
            className="hover:bg-muted/30 transition-colors cursor-pointer border-0 shadow-sm"
            onClick={() => onEdit(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium">{conversation.title}</h3>
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
                    {conversation.tags.length > 0 && (
                      <div className="flex gap-1">
                        {conversation.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-2 py-0 rounded-full">
                            {tag}
                          </Badge>
                        ))}
                        {conversation.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-2 py-0 rounded-full">
                            +{conversation.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
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
