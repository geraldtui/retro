"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { MessageCircle, Star, Calendar, Target } from "lucide-react"
import type { Conversation } from "@/app/page"

interface InsightsDashboardProps {
  conversations: Conversation[]
}

export function InsightsDashboard({ conversations }: InsightsDashboardProps) {
  const insights = useMemo(() => {
    if (conversations.length === 0) return null

    const totalConversations = conversations.length
    const averageRating = conversations.reduce((sum, conv) => sum + conv.rating, 0) / totalConversations

    // Rating distribution
    const ratingDistribution = Array.from({ length: 5 }, (_, i) => ({
      rating: i + 1,
      count: conversations.filter((conv) => conv.rating === i + 1).length,
    }))

    // Monthly trends
    const monthlyData = conversations.reduce(
      (acc, conv) => {
        const month = new Date(conv.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
        if (!acc[month]) {
          acc[month] = { month, count: 0, totalRating: 0 }
        }
        acc[month].count++
        acc[month].totalRating += conv.rating
        return acc
      },
      {} as Record<string, { month: string; count: number; totalRating: number }>,
    )

    const monthlyTrends = Object.values(monthlyData)
      .map((data) => ({
        ...data,
        averageRating: data.totalRating / data.count,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    // Most common tags
    const tagCounts = conversations.reduce(
      (acc, conv) => {
        conv.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))

    // Recent improvement areas
    const recentImprovements = conversations
      .slice(0, 10)
      .filter((conv) => conv.reflection.couldImprove)
      .map((conv) => conv.reflection.couldImprove)

    return {
      totalConversations,
      averageRating,
      ratingDistribution,
      monthlyTrends,
      topTags,
      recentImprovements,
    }
  }, [conversations])

  if (!insights) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <BarChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No data to analyze yet</p>
          <p className="text-sm">Log some conversations to see your insights</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{insights.totalConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{insights.averageRating.toFixed(1)}/5</div>
            <div className="flex mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(insights.averageRating) ? "text-primary fill-current" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {insights.monthlyTrends[insights.monthlyTrends.length - 1]?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">conversations logged</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>How you rate your conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={insights.ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="rating" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Conversation frequency and quality over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={insights.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tags and Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Common Topics</CardTitle>
            <CardDescription>Most frequently used tags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topTags.slice(0, 8).map(({ tag, count }) => (
                <div key={tag} className="flex items-center justify-between">
                  <Badge variant="outline">{tag}</Badge>
                  <div className="flex items-center gap-2 flex-1 ml-3">
                    <Progress value={(count / insights.totalConversations) * 100} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Opportunities</CardTitle>
            <CardDescription>Recent areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.recentImprovements.slice(0, 5).map((improvement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{improvement}</p>
                </div>
              ))}
              {insights.recentImprovements.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No improvement areas noted recently. Keep reflecting!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
