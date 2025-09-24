"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, BarChart3 } from "lucide-react"
import { ConversationList } from "@/components/conversation-list"
import { InsightsDashboard } from "@/components/insights-dashboard"
import { ConversationEditor } from "@/components/conversation-editor"

export interface Interaction {
  id: string
  title: string
  participant: string
  date: string
  context: string
  rating: number
  reflection: {
    didWell: string
    couldImprove: string
    learned: string
  }
  tags: string[]
}

export default function HomePage() {
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [activeTab, setActiveTab] = useState<"history" | "insights">("history")
  const [showForm, setShowForm] = useState(false)
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("retro-interactions")
    if (stored) {
      setInteractions(JSON.parse(stored))
    }
  }, [])

  const saveInteraction = (interaction: Omit<Interaction, "id">) => {
    const newInteraction: Interaction = {
      ...interaction,
      id: Date.now().toString(),
    }
    const updated = [newInteraction, ...interactions]
    setInteractions(updated)
    localStorage.setItem("retro-interactions", JSON.stringify(updated))
    setShowForm(false)
  }

  const updateInteraction = (updatedInteraction: Interaction) => {
    const updated = interactions.map((c) => (c.id === updatedInteraction.id ? updatedInteraction : c))
    setInteractions(updated)
    localStorage.setItem("retro-interactions", JSON.stringify(updated))
    setEditingInteraction(null)
  }

  const deleteInteraction = (id: string) => {
    const updated = interactions.filter((c) => c.id !== id)
    setInteractions(updated)
    localStorage.setItem("retro-interactions", JSON.stringify(updated))
  }

  const handleEditInteraction = (interaction: Interaction) => {
    setEditingInteraction(interaction)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Retro
            </h1>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex bg-muted/30 rounded-full p-1">
            <Button
              variant={activeTab === "history" && !showForm ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setActiveTab("history")
                setEditingInteraction(null)
                setShowForm(false)
              }}
              className="rounded-full px-6"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              variant={activeTab === "insights" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setActiveTab("insights")
                setEditingInteraction(null)
                setShowForm(false)
              }}
              className="rounded-full px-6"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Insights
            </Button>
          </div>
        </div>

        {editingInteraction && (
          <div className="max-w-xl mx-auto mb-8">
            <ConversationEditor
              conversation={editingInteraction}
              onSave={updateInteraction}
              onCancel={() => setEditingInteraction(null)}
            />
          </div>
        )}

        {activeTab === "history" && (
          <ConversationList
            conversations={interactions}
            onDelete={deleteInteraction}
            onEdit={handleEditInteraction}
            onSave={saveInteraction}
          />
        )}

        {activeTab === "insights" && <InsightsDashboard conversations={interactions} />}
      </div>
    </div>
  )
}
